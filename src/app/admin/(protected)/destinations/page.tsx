import type { JSX } from "react";
import Link from "next/link";
import { requireCapability, can } from "@/server/auth/rbac";
import { listAdminDestinations } from "@/server/admin/catalog-admin";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";

export const dynamic = "force-dynamic";

export default async function AdminDestinationsPage(): Promise<JSX.Element> {
  const user = await requireCapability("catalog.view");
  const destinations = await listAdminDestinations();
  const editable = can(user, "catalog.edit");
  const dict = getAdminDict(await getAdminLocale());
  const t = dict.destinations;

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>
          {editable ? (
            <Link className="admin-btn" href="/admin/destinations/new">{t.newDestination}</Link>
          ) : null}
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th scope="col">{t.colName}</th>
              <th scope="col">{t.colRegion}</th>
              <th scope="col">{t.colTours}</th>
              <th scope="col" style={{ textAlign: "end" }}>{dict.common.edit}</th>
            </tr>
          </thead>
          <tbody>
            {destinations.length === 0 ? (
              <tr>
                <td colSpan={4}><span className="admin-card__meta">{t.noDestinations}</span></td>
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
                  <td style={{ textAlign: "end" }}>
                    <Link className="admin-btn admin-btn--ghost" href={`/admin/destinations/${d.id}`}>
                      {editable ? dict.common.edit : dict.common.view}
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
