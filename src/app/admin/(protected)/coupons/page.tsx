import type { JSX } from "react";
import Link from "next/link";
import { requireCapability, can } from "@/server/auth/rbac";
import { listAdminCoupons, type AdminCouponRow } from "@/server/admin/coupons-admin";
import { centsToMoney } from "@/content/coupon-admin-schema";

export const dynamic = "force-dynamic";

/** "10% off" or "25.00 USD off" — the human summary of a coupon's discount. */
function describeDiscount(c: AdminCouponRow): string {
  return c.type === "PERCENT" ? `${c.value}% off` : `${centsToMoney(c.value)} ${c.currency ?? ""} off`.trim();
}

function describeUses(c: AdminCouponRow): string {
  return c.maxRedemptions != null ? `${c.redemptions} / ${c.maxRedemptions}` : `${c.redemptions}`;
}

export default async function AdminCouponsPage(): Promise<JSX.Element> {
  const user = await requireCapability("coupons.view");
  const coupons = await listAdminCoupons();
  const editable = can(user, "coupons.edit");

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>Coupons</h1>
            <p>Discount codes customers can enter at checkout.</p>
          </div>
          {editable ? (
            <Link className="admin-btn" href="/admin/coupons/new">+ New coupon</Link>
          ) : null}
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Discount</th>
              <th>Uses</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>{editable ? "Edit" : "View"}</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={5}><span className="admin-card__meta">No coupons yet.</span></td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.code}</strong></td>
                  <td>{describeDiscount(c)}</td>
                  <td>{describeUses(c)}</td>
                  <td>{c.active ? "Active" : <span className="admin-card__meta">Inactive</span>}</td>
                  <td style={{ textAlign: "right" }}>
                    <Link className="admin-btn admin-btn--ghost" href={`/admin/coupons/${c.id}`}>
                      {editable ? "Edit" : "View"}
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
