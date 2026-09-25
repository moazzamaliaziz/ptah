import type { JSX } from "react";
import Link from "next/link";
import { requireCapability } from "@/server/auth/rbac";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";
import DestinationEditor from "../DestinationEditor";

export const dynamic = "force-dynamic";

export default async function NewDestinationPage(): Promise<JSX.Element> {
  await requireCapability("catalog.edit");
  const dict = getAdminDict(await getAdminLocale());
  const t = dict.destinations;
  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>{t.newTitle}</h1>
            <p>{t.newSubtitle}</p>
          </div>
          <Link className="admin-btn admin-btn--ghost" href="/admin/destinations">{t.backToList}</Link>
        </div>
      </div>
      <DestinationEditor labels={t.form} savingLabel={dict.common.saving} />
    </>
  );
}
