import type { JSX } from "react";
import Link from "next/link";
import { requireCapability } from "@/server/auth/rbac";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";
import NewTourForm from "./NewTourForm";

export const dynamic = "force-dynamic";

export default async function NewTourPage(): Promise<JSX.Element> {
  await requireCapability("catalog.edit");
  const dict = getAdminDict(await getAdminLocale());
  const t = dict.tours;
  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>{t.newTitle}</h1>
            <p>{t.newSubtitle}</p>
          </div>
          <Link className="admin-btn admin-btn--ghost" href="/admin/tours">{t.backToList}</Link>
        </div>
      </div>
      <NewTourForm fields={t.fields} faqLabels={t.faq} creatingLabel={dict.common.creating} createLabel={t.createDraft} createHint={t.createDraftHint} />
    </>
  );
}
