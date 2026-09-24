import type { JSX } from "react";
import Link from "next/link";
import { requireCapability } from "@/server/auth/rbac";
import CouponEditor from "../CouponEditor";

export const dynamic = "force-dynamic";

export default async function NewCouponPage(): Promise<JSX.Element> {
  await requireCapability("coupons.edit");
  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>New coupon</h1>
            <p>Create a discount code customers can enter at checkout.</p>
          </div>
          <Link className="admin-btn admin-btn--ghost" href="/admin/coupons">← All coupons</Link>
        </div>
      </div>
      <CouponEditor />
    </>
  );
}
