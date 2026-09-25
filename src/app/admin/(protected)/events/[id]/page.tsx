import type { JSX } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCapability } from "@/server/auth/rbac";
import { getAdminEvent } from "@/server/admin/events-admin";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";
import EventEditor from "../EventEditor";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import { setEventStatusAction, deleteEventAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function EventEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<JSX.Element> {
  await requireCapability("events.edit");
  const { id } = await params;
  const event = await getAdminEvent(id);
  if (!event) notFound();

  const dict = getAdminDict(await getAdminLocale());
  const t = dict.events;

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>{event.title}</h1>
            <p>
              <span className={`admin-badge ${event.status === "PUBLISHED" ? "admin-badge--gold" : "admin-badge--off"}`}>{t.statusLabels[event.status] ?? event.status}</span>
              {" "}/{event.slug}
            </p>
          </div>
          <div className="admin-row" style={{ gap: "0.5rem" }}>
            <Link className="admin-btn admin-btn--ghost" href="/admin/events">{t.backToList}</Link>
            {event.status === "PUBLISHED" ? (
              <Link className="admin-btn admin-btn--ghost" href={`/events/${event.slug}`} target="_blank">{t.viewLive}</Link>
            ) : null}
          </div>
        </div>
      </div>

      {/* Status controls */}
      <div className="admin-card">
        <div className="admin-row" style={{ gap: "0.5rem", flexWrap: "wrap" }}>
          {event.status !== "PUBLISHED" ? (
            <form action={setEventStatusAction}>
              <input type="hidden" name="id" value={event.id} />
              <input type="hidden" name="status" value="PUBLISHED" />
              <button className="admin-btn" type="submit">{t.publish}</button>
            </form>
          ) : (
            <form action={setEventStatusAction}>
              <input type="hidden" name="id" value={event.id} />
              <input type="hidden" name="status" value="DRAFT" />
              <button className="admin-btn admin-btn--ghost" type="submit">{t.unpublish}</button>
            </form>
          )}
          {event.status !== "ARCHIVED" ? (
            <form action={setEventStatusAction}>
              <input type="hidden" name="id" value={event.id} />
              <input type="hidden" name="status" value="ARCHIVED" />
              <button className="admin-btn admin-btn--ghost" type="submit">{t.archive}</button>
            </form>
          ) : null}
        </div>
        {event.status !== "PUBLISHED" ? (
          <p className="admin-card__meta" style={{ marginTop: "0.6rem" }}>
            {t.statusNotePre(t.statusLabels[event.status] ?? event.status)}
            <Link href="/events">/events</Link>
            {t.statusNotePost}
          </p>
        ) : null}
      </div>

      <EventEditor event={event} fields={t.fields} savedLabel={t.saved} savingLabel={dict.common.saving} saveLabel={dict.common.saveChanges} />

      {/* Danger zone */}
      <section className="admin-card" style={{ borderColor: "rgba(154,92,27,0.4)" }}>
        <h2>{t.deleteHeading}</h2>
        <p className="admin-card__meta">{t.deleteHint}</p>
        <form action={deleteEventAction} style={{ marginTop: "0.5rem" }}>
          <input type="hidden" name="id" value={event.id} />
          <ConfirmSubmitButton confirm={t.confirmDelete(event.title)} pendingLabel={dict.common.deleting}>
            {dict.common.deletePermanently}
          </ConfirmSubmitButton>
        </form>
      </section>
    </>
  );
}
