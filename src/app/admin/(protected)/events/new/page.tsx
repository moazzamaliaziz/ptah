import type { JSX } from "react";
import Link from "next/link";
import { requireCapability } from "@/server/auth/rbac";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";
import NewEventForm from "./NewEventForm";

export const dynamic = "force-dynamic";

export default async function NewEventPage(): Promise<JSX.Element> {
  await requireCapability("events.edit");
  const dict = getAdminDict(await getAdminLocale());
  const t = dict.events;

  return (
    <>
      <div className="admin-head">
        <Link className="admin-btn admin-btn--ghost" href="/admin/events">{t.backToList}</Link>
        <h1>{t.newEvent}</h1>
        <p>{t.newSubtitle}</p>
      </div>
      <NewEventForm fields={t.fields} creatingLabel={dict.common.creating} createLabel={t.createDraft} />
    </>
  );
}
