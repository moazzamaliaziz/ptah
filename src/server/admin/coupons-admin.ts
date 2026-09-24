/**
 * Coupon admin service (P5). Server-only write layer for managing discount
 * coupons from the admin panel. Mirrors catalog-admin.ts conventions:
 *   • Returns discriminated `MutationResult`s — no Prisma types leak, invalid
 *     input is a friendly error, not a throw.
 *   • Authorization (`coupons.edit`) + audit are the caller's (server action)
 *     responsibility; this module validates shape + business rules.
 *   • Money stays integer cents; codes are unique (friendly pre-check + P2002
 *     backstop).
 *
 * Redemption counts are computed on demand from live bookings that carry the
 * code (status NOT IN FAILED/CANCELLED) — the SAME rule the reserve transaction
 * enforces the cap with — never a drift-prone counter column. Deleting a coupon
 * NEVER rewrites money already charged: a booking's `couponCode`/`discountCents`
 * are frozen and there is no FK from bookings to coupons, so the delete simply
 * leaves historical orders intact.
 */
import "server-only";
import type { z } from "zod";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { couponInputSchema, type CouponInput } from "@/content/coupon-admin-schema";

export type MutationResult<T = void> =
  | ({ ok: true } & (T extends void ? object : { value: T }))
  | { ok: false; error: string };

function ok<T>(value: T): { ok: true; value: T } {
  return { ok: true, value };
}
function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}
function firstIssue(error: z.ZodError): string {
  const i = error.issues[0];
  return i ? `${i.path.join(".") || "form"}: ${i.message}` : "Invalid input.";
}

/** Live redemptions = bookings on the code that were not abandoned/cancelled. */
const LIVE_REDEMPTION_WHERE = {
  status: { notIn: ["FAILED", "CANCELLED"] },
} satisfies Prisma.BookingWhereInput;

// ── List + read ──────────────────────────────────────────────────────────────

export interface AdminCouponRow {
  id: string;
  code: string;
  type: string;
  value: number;
  currency: string | null;
  active: boolean;
  redemptions: number;
  maxRedemptions: number | null;
  startsAt: Date | null;
  endsAt: Date | null;
  updatedAt: Date;
}

/** Every coupon, newest first, each with its live redemption count. */
export async function listAdminCoupons(): Promise<AdminCouponRow[]> {
  const coupons = await db.coupon.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, code: true, type: true, value: true, currency: true,
      active: true, maxRedemptions: true, startsAt: true, endsAt: true, updatedAt: true,
    },
  });
  if (coupons.length === 0) return [];

  // One grouped COUNT for the whole page (avoids an N+1 of per-coupon counts).
  const grouped = await db.booking.groupBy({
    by: ["couponCode"],
    where: { couponCode: { in: coupons.map((c) => c.code) }, ...LIVE_REDEMPTION_WHERE },
    _count: true,
  });
  const byCode = new Map<string, number>();
  for (const g of grouped) if (g.couponCode) byCode.set(g.couponCode, g._count);

  return coupons.map((c) => ({
    id: c.id,
    code: c.code,
    type: c.type,
    value: c.value,
    currency: c.currency,
    active: c.active,
    redemptions: byCode.get(c.code) ?? 0,
    maxRedemptions: c.maxRedemptions,
    startsAt: c.startsAt,
    endsAt: c.endsAt,
    updatedAt: c.updatedAt,
  }));
}

export interface AdminCouponDetail extends CouponInput {
  id: string;
  redemptions: number;
}

/** Full editable detail for one coupon, or null. */
export async function getAdminCoupon(id: string): Promise<AdminCouponDetail | null> {
  const c = await db.coupon.findUnique({
    where: { id },
    select: {
      id: true, code: true, type: true, value: true, currency: true,
      minSpendCents: true, maxRedemptions: true, startsAt: true, endsAt: true, active: true,
    },
  });
  if (!c) return null;
  const redemptions = await db.booking.count({ where: { couponCode: c.code, ...LIVE_REDEMPTION_WHERE } });
  return {
    id: c.id,
    code: c.code,
    type: c.type,
    value: c.value,
    currency: c.currency,
    minSpendCents: c.minSpendCents,
    maxRedemptions: c.maxRedemptions,
    startsAt: c.startsAt,
    endsAt: c.endsAt,
    active: c.active,
    redemptions,
  };
}

// ── Create / update / delete ───────────────────────────────────────────────────

/** The scalar write payload — assignable to both create and update `data`. */
function couponWriteData(input: CouponInput) {
  return {
    code: input.code,
    type: input.type,
    value: input.value,
    currency: input.currency,
    minSpendCents: input.minSpendCents,
    maxRedemptions: input.maxRedemptions,
    startsAt: input.startsAt,
    endsAt: input.endsAt,
    active: input.active,
  };
}

/** Create a coupon. Returns the new id for a redirect to its editor. */
export async function createCoupon(raw: unknown): Promise<MutationResult<string>> {
  const parsed = couponInputSchema.safeParse(raw);
  if (!parsed.success) return fail(firstIssue(parsed.error));

  const existing = await db.coupon.findUnique({ where: { code: parsed.data.code }, select: { id: true } });
  if (existing) return fail(`A coupon with the code "${parsed.data.code}" already exists.`);

  try {
    const created = await db.coupon.create({ data: couponWriteData(parsed.data), select: { id: true } });
    return ok(created.id);
  } catch {
    return fail("Could not create the coupon (the code may already be taken).");
  }
}

/** Update an existing coupon's editable fields. */
export async function updateCoupon(id: string, raw: unknown): Promise<MutationResult> {
  const parsed = couponInputSchema.safeParse(raw);
  if (!parsed.success) return fail(firstIssue(parsed.error));

  const clash = await db.coupon.findFirst({ where: { code: parsed.data.code, NOT: { id } }, select: { id: true } });
  if (clash) return fail(`Another coupon already uses the code "${parsed.data.code}".`);

  const found = await db.coupon.findUnique({ where: { id }, select: { id: true } });
  if (!found) return fail("Coupon not found.");

  await db.coupon.update({ where: { id }, data: couponWriteData(parsed.data) });
  return { ok: true };
}

/**
 * Hard-delete a coupon. Safe: bookings reference the code by value (no FK), so
 * historical orders keep their frozen discount. New checkouts can no longer use
 * the code. To stop a code without losing its history, set it inactive instead.
 */
export async function deleteCoupon(id: string): Promise<MutationResult> {
  const found = await db.coupon.findUnique({ where: { id }, select: { id: true } });
  if (!found) return fail("Coupon not found.");
  await db.coupon.delete({ where: { id } });
  return { ok: true };
}
