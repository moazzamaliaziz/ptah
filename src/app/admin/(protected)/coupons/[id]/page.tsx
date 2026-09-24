import type { JSX } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCapability, can } from "@/server/auth/rbac";
import { getAdminCoupon } from "@/server/admin/coupons-admin";
import CouponEditor from "../CouponEditor";
import { deleteCouponAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function CouponEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element> {
  const user = await requireCapability("coupons.view");
  const editable = can(user, "coupons.edit");
  const { id } = await params;
  const coupon = await getAdminCoupon(id);
  if (!coupon) notFound();

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>{coupon.code}</h1>
            <p>
              Used {coupon.redemptions}
              {coupon.maxRedemptions != null ? ` of ${coupon.maxRedemptions}` : ""}
              {coupon.redemptions === 1 ? " time" : " times"}.
            </p>
          </div>
          <Link className="admin-btn admin-btn--ghost" href="/admin/coupons">← All coupons</Link>
        </div>
      </div>

      <CouponEditor coupon={coupon} readOnly={!editable} />

      {editable ? (
        <section className="admin-card" style={{ borderColor: "rgba(154,92,27,0.4)" }}>
          <h2>Delete coupon</h2>
          <p className="admin-card__meta">
            Removes this code so it can no longer be used at checkout. Bookings that already used it keep their
            discount — nothing already charged is changed. To stop a code without losing its history, untick
            &ldquo;Active&rdquo; above instead.
          </p>
          <form action={deleteCouponAction} style={{ marginTop: "0.5rem" }}>
            <input type="hidden" name="id" value={coupon.id} />
            <button className="admin-btn admin-btn--danger" type="submit">Delete permanently</button>
          </form>
        </section>
      ) : null}
    </>
  );
}
