import type { JSX } from "react";
import Link from "next/link";
import { requireCapability, can } from "@/server/auth/rbac";
import { listAdminCoupons, type AdminCouponRow } from "@/server/admin/coupons-admin";
import { centsToMoney } from "@/content/coupon-admin-schema";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict, type CouponsDict } from "@/i18n/admin/dictionary";

export const dynamic = "force-dynamic";

/** "10% off" or "25.00 USD off" — the human summary of a coupon's discount. */
function describeDiscount(c: AdminCouponRow, t: CouponsDict): string {
  return c.type === "PERCENT" ? t.percentOff(c.value) : t.fixedOff(centsToMoney(c.value), c.currency ?? "");
}

function describeUses(c: AdminCouponRow): string {
  return c.maxRedemptions != null ? `${c.redemptions} / ${c.maxRedemptions}` : `${c.redemptions}`;
}

export default async function AdminCouponsPage(): Promise<JSX.Element> {
  const user = await requireCapability("coupons.view");
  const dict = getAdminDict(await getAdminLocale());
  const t = dict.coupons;
  const coupons = await listAdminCoupons();
  const editable = can(user, "coupons.edit");

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>
          {editable ? (
            <Link className="admin-btn" href="/admin/coupons/new">{t.newCoupon}</Link>
          ) : null}
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th scope="col">{t.colCode}</th>
              <th scope="col">{t.colDiscount}</th>
              <th scope="col">{t.colUses}</th>
              <th scope="col">{t.colStatus}</th>
              <th scope="col" style={{ textAlign: "end" }}>{editable ? dict.common.edit : dict.common.view}</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={5}><span className="admin-card__meta">{t.noCoupons}</span></td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.code}</strong></td>
                  <td>{describeDiscount(c, t)}</td>
                  <td>{describeUses(c)}</td>
                  <td>{c.active ? dict.common.active : <span className="admin-card__meta">{dict.common.inactive}</span>}</td>
                  <td style={{ textAlign: "end" }}>
                    <Link className="admin-btn admin-btn--ghost" href={`/admin/coupons/${c.id}`}>
                      {editable ? dict.common.edit : dict.common.view}
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
