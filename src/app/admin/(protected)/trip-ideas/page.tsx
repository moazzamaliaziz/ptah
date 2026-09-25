import type { JSX } from "react";
import Link from "next/link";
import { requireCapability, can } from "@/server/auth/rbac";
import { listAdminTripIdeas } from "@/server/admin/events-admin";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";

export const dynamic = "force-dynamic";

/**
 * /admin/trip-ideas — editorial collections that curate real catalog tours.
 * View gated by tripideas.view; mutations by tripideas.edit.
 */
export default async function TripIdeasPage(): Promise<JSX.Element> {
  const user = await requireCapability("tripideas.view");
  const editable = can(user, "tripideas.edit");
  const ideas = await listAdminTripIdeas();
  const dict = getAdminDict(await getAdminLocale());
  const t = dict.tripIdeas;

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>
          {editable ? <Link className="admin-btn" href="/admin/trip-ideas/new">{t.newTripIdea}</Link> : null}
        </div>
      </div>

      {!editable ? (
        <div className="admin-alert admin-alert--ok" role="status">{t.viewOnlyNote}</div>
      ) : null}

      {ideas.length === 0 ? (
        <div className="admin-card"><p className="admin-card__meta">{t.noTripIdeas}{editable ? t.noTripIdeasCreateHint : ""}</p></div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t.colTitle}</th>
              <th>{t.colCuratedTours}</th>
              <th>{t.colStatus}</th>
            </tr>
          </thead>
          <tbody>
            {ideas.map((idea) => (
              <tr key={idea.id}>
                <td><Link href={`/admin/trip-ideas/${idea.id}`}>{idea.title}</Link></td>
                <td>{idea.tourCount}</td>
                <td>
                  <span className={`admin-badge ${idea.status === "PUBLISHED" ? "admin-badge--gold" : "admin-badge--off"}`}>{t.statusLabels[idea.status] ?? idea.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
