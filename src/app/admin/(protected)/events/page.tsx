import type { JSX } from "react";
import Link from "next/link";
import { requireCapability, can } from "@/server/auth/rbac";
import { listAdminEvents } from "@/server/admin/events-admin";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";

export const dynamic = "force-dynamic";

/**
 * /admin/events — list every event/festival (all statuses) with status + dates
 * and a link to edit. View gated by events.view; mutations by events.edit.
 */
export default async function EventsPage(): Promise<JSX.Element> {
  const user = await requireCapability("events.view");
  const editable = can(user, "events.edit");
  const events = await listAdminEvents();
  const dict = getAdminDict(await getAdminLocale());
  const t = dict.events;

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>
          {editable ? <Link className="admin-btn" href="/admin/events/new">{t.newEvent}</Link> : null}
        </div>
      </div>

      {!editable ? (
        <div className="admin-alert admin-alert--ok" role="status">{t.viewOnlyNote}</div>
      ) : null}

      {events.length === 0 ? (
        <div className="admin-card"><p className="admin-card__meta">{t.noEvents}{editable ? t.noEventsCreateHint : ""}</p></div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t.colTitle}</th>
              <th>{t.colDates}</th>
              <th>{t.colRecurring}</th>
              <th>{t.colStatus}</th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id}>
                <td><Link href={`/admin/events/${e.id}`}>{e.title}</Link></td>
                <td>{e.startDate}{e.endDate ? ` → ${e.endDate}` : ""}</td>
                <td>{e.recurring ? dict.common.yes : "—"}</td>
                <td>
                  <span className={`admin-badge ${e.status === "PUBLISHED" ? "admin-badge--gold" : "admin-badge--off"}`}>{t.statusLabels[e.status] ?? e.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
