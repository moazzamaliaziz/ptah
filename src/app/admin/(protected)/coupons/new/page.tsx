import type { JSX } from "react";
import Link from "next/link";
import { requireCapability } from "@/server/auth/rbac";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";
import CouponEditor from "../CouponEditor";

export const dynamic = "force-dynamic";

export default async function NewCouponPage(): Promise<JSX.Element> {
  await requireCapability("coupons.edit");
  const dict = getAdminDict(await getAdminLocale());
  const t = dict.coupons;
  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>{t.newTitle}</h1>
            <p>{t.newSubtitle}</p>
          </div>
          <Link className="admin-btn admin-btn--ghost" href="/admin/coupons">{t.backToList}</Link>
        </div>
      </div>
      <CouponEditor labels={t.form} savingLabel={dict.common.saving} />
    </>
  );
}
