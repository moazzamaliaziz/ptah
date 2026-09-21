import type { JSX } from "react";
import Link from "next/link";
import { requireCapability, can } from "@/server/auth/rbac";
import { listAdminTripIdeas } from "@/server/admin/events-admin";

export const dynamic = "force-dynamic";

/**
 * /admin/trip-ideas — editorial collections that curate real catalog tours.
 * View gated by tripideas.view; mutations by tripideas.edit.
 */
export default async function TripIdeasPage(): Promise<JSX.Element> {
  const user = await requireCapability("tripideas.view");
  const editable = can(user, "tripideas.edit");
  const ideas = await listAdminTripIdeas();

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>Trip ideas</h1>
            <p>Editorial collections shown at /trip-ideas. Each pairs an intro with hand-picked tours. Only published ideas appear on the public site.</p>
          </div>
          {editable ? <Link className="admin-btn" href="/admin/trip-ideas/new">New trip idea</Link> : null}
        </div>
      </div>

      {!editable ? (
        <div className="admin-alert admin-alert--ok" role="status">Your role can view trip ideas but not change them.</div>
      ) : null}

      {ideas.length === 0 ? (
        <div className="admin-card"><p className="admin-card__meta">No trip ideas yet.{editable ? " Create one to curate tours by theme." : ""}</p></div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Curated tours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {ideas.map((t) => (
              <tr key={t.id}>
                <td><Link href={`/admin/trip-ideas/${t.id}`}>{t.title}</Link></td>
                <td>{t.tourCount}</td>
                <td>
                  <span className={`admin-badge ${t.status === "PUBLISHED" ? "admin-badge--gold" : "admin-badge--off"}`}>{t.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
