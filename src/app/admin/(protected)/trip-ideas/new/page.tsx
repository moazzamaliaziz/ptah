import type { JSX } from "react";
import Link from "next/link";
import { requireCapability } from "@/server/auth/rbac";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";
import NewTripIdeaForm from "./NewTripIdeaForm";

export const dynamic = "force-dynamic";

export default async function NewTripIdeaPage(): Promise<JSX.Element> {
  await requireCapability("tripideas.edit");
  const dict = getAdminDict(await getAdminLocale());
  const t = dict.tripIdeas;

  return (
    <>
      <div className="admin-head">
        <Link className="admin-btn admin-btn--ghost" href="/admin/trip-ideas">{t.backToList}</Link>
        <h1>{t.newTitle}</h1>
        <p>{t.newSubtitle}</p>
      </div>
      <NewTripIdeaForm fields={t.fields} creatingLabel={dict.common.creating} createLabel={t.createDraft} />
    </>
  );
}
