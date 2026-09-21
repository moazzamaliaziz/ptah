import type { JSX } from "react";
import Link from "next/link";
import { requireCapability, can } from "@/server/auth/rbac";
import { listAdminEvents } from "@/server/admin/events-admin";

export const dynamic = "force-dynamic";

/**
 * /admin/events — list every event/festival (all statuses) with status + dates
 * and a link to edit. View gated by events.view; mutations by events.edit.
 */
export default async function EventsPage(): Promise<JSX.Element> {
  const user = await requireCapability("events.view");
  const editable = can(user, "events.edit");
  const events = await listAdminEvents();

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>Events &amp; festivals</h1>
            <p>Cultural events and festivals shown at /events. Only published events appear on the public site.</p>
          </div>
          {editable ? <Link className="admin-btn" href="/admin/events/new">New event</Link> : null}
        </div>
      </div>

      {!editable ? (
        <div className="admin-alert admin-alert--ok" role="status">Your role can view events but not change them.</div>
      ) : null}

      {events.length === 0 ? (
        <div className="admin-card"><p className="admin-card__meta">No events yet.{editable ? " Create one to populate the Events page." : ""}</p></div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Dates</th>
              <th>Recurring</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td><Link href={`/admin/events/${e.id}`}>{e.title}</Link></td>
                <td>{e.startDate}{e.endDate ? ` → ${e.endDate}` : ""}</td>
                <td>{e.recurring ? "Yes" : "—"}</td>
                <td>
                  <span className={`admin-badge ${e.status === "PUBLISHED" ? "admin-badge--gold" : "admin-badge--off"}`}>{e.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
