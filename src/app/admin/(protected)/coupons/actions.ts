"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireCapability } from "@/server/auth/rbac";
import { writeAudit } from "@/server/audit";
import { createCoupon, updateCoupon, deleteCoupon } from "@/server/admin/coupons-admin";
import {
  parseCouponValue,
  parseMoneyOrNull,
  parseIntOrNull,
  parseStartDate,
  parseEndDate,
} from "@/content/coupon-admin-schema";
import { emptyToNull } from "@/content/catalog-admin-schema";

export type CouponFormState = { ok?: boolean; error?: string };

const str = (fd: FormData, key: string): string => String(fd.get(key) ?? "");

/**
 * Read the coupon form into the shape couponInputSchema validates. The `value`
 * field is type-dependent — a whole percentage for PERCENT, a money amount for
 * FIXED — so it is normalized to an integer here (percent stays as-is, money
 * becomes cents). Dates arrive as YYYY-MM-DD; the checkbox posts only when on.
 */
function readCouponInput(fd: FormData): Record<string, unknown> {
  const type = str(fd, "type");
  return {
    code: str(fd, "code"),
    type,
    value: parseCouponValue(type, str(fd, "value")),
    currency: emptyToNull(str(fd, "currency")),
    minSpendCents: parseMoneyOrNull(str(fd, "minSpend")),
    maxRedemptions: parseIntOrNull(str(fd, "maxRedemptions")),
    startsAt: parseStartDate(str(fd, "startsAt")),
    endsAt: parseEndDate(str(fd, "endsAt")),
    active: fd.get("active") != null,
  };
}

function revalidateCoupon(id?: string): void {
  revalidatePath("/admin/coupons");
  if (id) revalidatePath(`/admin/coupons/${id}`);
}

export async function createCouponAction(_prev: CouponFormState, fd: FormData): Promise<CouponFormState> {
  const user = await requireCapability("coupons.edit");
  const result = await createCoupon(readCouponInput(fd));
  if (!result.ok) return { error: result.error };
  await writeAudit({ actorId: user.id, action: "coupon.create", entity: "coupon", entityId: result.value });
  revalidateCoupon(result.value);
  redirect(`/admin/coupons/${result.value}`);
}

export async function updateCouponAction(_prev: CouponFormState, fd: FormData): Promise<CouponFormState> {
  const user = await requireCapability("coupons.edit");
  const id = str(fd, "id");
  const result = await updateCoupon(id, readCouponInput(fd));
  if (!result.ok) return { error: result.error };
  await writeAudit({ actorId: user.id, action: "coupon.update", entity: "coupon", entityId: id });
  revalidateCoupon(id);
  return { ok: true };
}

export async function deleteCouponAction(fd: FormData): Promise<void> {
  const user = await requireCapability("coupons.edit");
  const id = str(fd, "id");
  const result = await deleteCoupon(id);
  await writeAudit({
    actorId: user.id,
    action: "coupon.delete",
    entity: "coupon",
    entityId: id,
    meta: { ok: result.ok },
  });
  revalidateCoupon();
  if (result.ok) redirect("/admin/coupons");
}
