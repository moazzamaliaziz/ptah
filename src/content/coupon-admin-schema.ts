/**
 * Coupon admin contract (P5). Pure module: the zod input schema + parsing/render
 * helpers for the discount-coupon management UI. No `server-only` / DB / Next
 * imports so it is unit-testable and importable from the client editor.
 *
 * The stored `value` means different things per type: for PERCENT it is a whole
 * percentage 1–100; for FIXED it is an integer amount in cents. The admin form
 * enters a percentage or a money amount respectively; the server action
 * normalizes BOTH to the integer `value` this schema validates (via
 * `parseCouponValue`), so the schema itself only ever sees whole numbers.
 *
 * Dates are entered as calendar days (YYYY-MM-DD). A start day begins at
 * 00:00:00 UTC; an end day is inclusive, so it ends at 23:59:59.999 UTC — that
 * way "ends 2026-12-31" stays valid through the whole of Dec 31.
 */
import { z } from "zod";
import { SITE_CURRENCY, isSupportedCurrency } from "@/content/currency";
import type { CouponType } from "@prisma/client";

export const COUPON_TYPES = ["PERCENT", "FIXED"] as const;

/** UPPERCASE code: letters/digits/hyphens, must start alphanumeric (e.g. SUMMER-2026). */
const code = z
  .string()
  .trim()
  .toUpperCase()
  .min(1, "Code is required.")
  .max(40)
  .regex(/^[A-Z0-9][A-Z0-9-]*$/, "Use letters, digits and hyphens (e.g. SUMMER-2026).");

/** Shared editable shape of a coupon (create + update). `value` already normalized. */
export const couponInputSchema = z
  .object({
    code,
    type: z.enum(COUPON_TYPES),
    // Whole percent (PERCENT) or integer cents (FIXED) — normalized by the caller.
    value: z
      .number()
      .int()
      .min(1, "Enter a discount amount greater than zero.")
      .max(1_000_000_00, "That discount amount is too large."),
    // A money-valued coupon must be in the currency the shop charges in, or
    // `evaluateCoupon` rejects it at checkout as a currency mismatch — which
    // would look like a broken code to the customer. `null` stays valid: a
    // percentage coupon with no currency applies to any total.
    currency: z
      .string()
      .trim()
      .toUpperCase()
      .refine(isSupportedCurrency, `Discount amounts are ${SITE_CURRENCY} only.`)
      .nullable(),
    minSpendCents: z.number().int().min(0, "Minimum spend cannot be negative.").max(1_000_000_00).nullable(),
    maxRedemptions: z.number().int().min(1, "Must allow at least one use.").max(1_000_000).nullable(),
    startsAt: z.date().nullable(),
    endsAt: z.date().nullable(),
    active: z.boolean(),
  })
  .refine((c) => c.type !== "PERCENT" || c.value <= 100, {
    message: "A percentage discount must be between 1 and 100.",
    path: ["value"],
  })
  .refine((c) => c.type !== "FIXED" || c.currency !== null, {
    message: "A fixed-amount discount needs a currency (e.g. USD).",
    path: ["currency"],
  })
  .refine((c) => c.minSpendCents == null || c.currency !== null, {
    message: "A minimum spend needs a currency (e.g. USD) so it can be compared to the order total.",
    path: ["currency"],
  })
  .refine((c) => c.startsAt === null || c.endsAt === null || c.endsAt >= c.startsAt, {
    message: "The end date must be on or after the start date.",
    path: ["endsAt"],
  });
export type CouponInput = z.infer<typeof couponInputSchema>;

// ── Pure parsing / render helpers (shared by the server action + editor) ─────────

/** Convert a major-unit money string ("10.50") to integer cents, or null if invalid. */
export function moneyToCents(raw: string): number | null {
  const cleaned = raw.replace(/[,\s]/g, "").trim();
  if (cleaned === "" || !/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  const [whole, frac = ""] = cleaned.split(".");
  const cents = Number(whole) * 100 + Number(frac.padEnd(2, "0"));
  return Number.isSafeInteger(cents) ? cents : null;
}

/** Render integer cents as a plain major-unit string ("10.50") for a form input. */
export function centsToMoney(cents: number): string {
  return (cents / 100).toFixed(2);
}

/**
 * Normalize the type-dependent `value` field from the form into the integer the
 * schema stores. PERCENT → whole number; FIXED → the money amount as cents.
 * Returns 0 on any unparseable input so the schema's `min(1)` surfaces a
 * friendly "enter a discount amount" error rather than a raw type error.
 */
export function parseCouponValue(type: string, raw: string): number {
  if (type === "FIXED") return moneyToCents(raw) ?? 0;
  const n = Number.parseInt(raw.trim(), 10);
  return Number.isFinite(n) ? n : 0;
}

/** "" → null; otherwise the whole-number value, or null when unparseable. */
export function parseIntOrNull(raw: string): number | null {
  const t = raw.trim();
  if (t === "") return null;
  const n = Number.parseInt(t, 10);
  return Number.isFinite(n) ? n : null;
}

/** "" → null; otherwise integer cents from a money string (null when invalid). */
export function parseMoneyOrNull(raw: string): number | null {
  const t = raw.trim();
  if (t === "") return null;
  return moneyToCents(t);
}

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

/** A calendar day at UTC midnight (coupon start), or null when blank/invalid. */
export function parseStartDate(raw: string): Date | null {
  const t = raw.trim();
  if (!ISO_DAY.test(t)) return null;
  return new Date(`${t}T00:00:00.000Z`);
}

/** A calendar day at the last UTC millisecond (inclusive coupon end), or null. */
export function parseEndDate(raw: string): Date | null {
  const t = raw.trim();
  if (!ISO_DAY.test(t)) return null;
  return new Date(`${t}T23:59:59.999Z`);
}

/** Render a stored Date back to the YYYY-MM-DD an <input type="date"> expects. */
export function toDateInput(d: Date | null): string {
  return d ? d.toISOString().slice(0, 10) : "";
}

// Compile-time guarantee the string union matches the Prisma enum.
const _couponTypeCheck: readonly CouponType[] = COUPON_TYPES;
void _couponTypeCheck;
