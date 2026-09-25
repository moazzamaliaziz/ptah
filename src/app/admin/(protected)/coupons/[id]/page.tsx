import type { JSX } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCapability, can } from "@/server/auth/rbac";
import { getAdminCoupon } from "@/server/admin/coupons-admin";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";
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

  const dict = getAdminDict(await getAdminLocale());
  const t = dict.coupons;

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>{coupon.code}</h1>
            <p>{t.usedLine(coupon.redemptions, coupon.maxRedemptions)}</p>
          </div>
          <Link className="admin-btn admin-btn--ghost" href="/admin/coupons">{t.backToList}</Link>
        </div>
      </div>

      <CouponEditor coupon={coupon} readOnly={!editable} labels={t.form} savingLabel={dict.common.saving} />

      {editable ? (
        <section className="admin-card" style={{ borderColor: "rgba(154,92,27,0.4)" }}>
          <h2>{t.deleteHeading}</h2>
          <p className="admin-card__meta">{t.deleteHint}</p>
          <form action={deleteCouponAction} style={{ marginTop: "0.5rem" }}>
            <input type="hidden" name="id" value={coupon.id} />
            <button className="admin-btn admin-btn--danger" type="submit">{dict.common.deletePermanently}</button>
          </form>
        </section>
      ) : null}
    </>
  );
}
