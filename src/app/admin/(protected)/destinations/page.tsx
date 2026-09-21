import type { JSX } from "react";
import Link from "next/link";
import { requireCapability, can } from "@/server/auth/rbac";
import { listAdminDestinations } from "@/server/admin/catalog-admin";

export const dynamic = "force-dynamic";

export default async function AdminDestinationsPage(): Promise<JSX.Element> {
  const user = await requireCapability("catalog.view");
  const destinations = await listAdminDestinations();
  const editable = can(user, "catalog.edit");

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>Destinations</h1>
            <p>Cities and regions tours are grouped under.</p>
          </div>
          {editable ? (
            <Link className="admin-btn" href="/admin/destinations/new">+ New destination</Link>
          ) : null}
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Region</th>
              <th>Tours</th>
              <th style={{ textAlign: "right" }}>Edit</th>
            </tr>
          </thead>
          <tbody>
            {destinations.length === 0 ? (
              <tr>
                <td colSpan={4}><span className="admin-card__meta">No destinations yet.</span></td>
              </tr>
            ) : (
              destinations.map((d) => (
                <tr key={d.id}>
                  <td>
                    <strong>{d.name}</strong>
                    <div className="admin-card__meta">/{d.slug}</div>
                  </td>
                  <td>{d.region ?? "—"}</td>
                  <td>{d.tourCount}</td>
                  <td style={{ textAlign: "right" }}>
                    <Link className="admin-btn admin-btn--ghost" href={`/admin/destinations/${d.id}`}>
                      {editable ? "Edit" : "View"}
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
