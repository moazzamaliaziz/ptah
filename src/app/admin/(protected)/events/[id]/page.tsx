import type { JSX } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireCapability } from "@/server/auth/rbac";
import { getAdminEvent } from "@/server/admin/events-admin";
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

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>{event.title}</h1>
            <p>
              <span className={`admin-badge ${event.status === "PUBLISHED" ? "admin-badge--gold" : "admin-badge--off"}`}>{event.status}</span>
              {" "}/{event.slug}
            </p>
          </div>
          <div className="admin-row" style={{ gap: "0.5rem" }}>
            <Link className="admin-btn admin-btn--ghost" href="/admin/events">← All events</Link>
            {event.status === "PUBLISHED" ? (
              <Link className="admin-btn admin-btn--ghost" href={`/events/${event.slug}`} target="_blank">View live ↗</Link>
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
              <button className="admin-btn" type="submit">Publish</button>
            </form>
          ) : (
            <form action={setEventStatusAction}>
              <input type="hidden" name="id" value={event.id} />
              <input type="hidden" name="status" value="DRAFT" />
              <button className="admin-btn admin-btn--ghost" type="submit">Unpublish (→ draft)</button>
            </form>
          )}
          {event.status !== "ARCHIVED" ? (
            <form action={setEventStatusAction}>
              <input type="hidden" name="id" value={event.id} />
              <input type="hidden" name="status" value="ARCHIVED" />
              <button className="admin-btn admin-btn--ghost" type="submit">Archive</button>
            </form>
          ) : null}
        </div>
        {event.status !== "PUBLISHED" ? (
          <p className="admin-card__meta" style={{ marginTop: "0.6rem" }}>
            This event is <strong>{event.status.toLowerCase()}</strong> — its content is saved but only appears
            on the public <Link href="/events">/events</Link> page once you <strong>Publish</strong>.
          </p>
        ) : null}
      </div>

      <EventEditor event={event} />

      {/* Danger zone */}
      <section className="admin-card" style={{ borderColor: "rgba(154,92,27,0.4)" }}>
        <h2>Delete event</h2>
        <p className="admin-card__meta">Permanently removes this event. This cannot be undone.</p>
        <form action={deleteEventAction} style={{ marginTop: "0.5rem" }}>
          <input type="hidden" name="id" value={event.id} />
          <ConfirmSubmitButton confirm={`Delete "${event.title}" permanently? This cannot be undone.`} pendingLabel="Deleting…">
            Delete permanently
          </ConfirmSubmitButton>
        </form>
      </section>
    </>
  );
}
