import type { JSX } from "react";
import Link from "next/link";
import { requireCapability, can } from "@/server/auth/rbac";
import { listAdminTours } from "@/server/admin/catalog-admin";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";
import { formatPriceCents } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_BADGE: Record<string, string> = {
  PUBLISHED: "admin-badge--gold",
  DRAFT: "admin-badge--off",
  ARCHIVED: "admin-badge--off",
};

export default async function AdminToursPage(): Promise<JSX.Element> {
  const user = await requireCapability("catalog.view");
  const tours = await listAdminTours();
  const editable = can(user, "catalog.edit");
  const dict = getAdminDict(await getAdminLocale());
  const t = dict.tours;

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>
          {editable ? (
            <Link className="admin-btn" href="/admin/tours/new">
              {t.newTour}
            </Link>
          ) : null}
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th scope="col">{t.colTitle}</th>
              <th scope="col">{t.colStatus}</th>
              <th scope="col">{t.colFrom}</th>
              <th scope="col">{t.colDays}</th>
              <th scope="col">{t.colDepartures}</th>
              <th scope="col">{t.colDestinations}</th>
              <th scope="col" style={{ textAlign: "end" }}>{t.colEdit}</th>
            </tr>
          </thead>
          <tbody>
            {tours.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <span className="admin-card__meta">{t.noTours}</span>
                </td>
              </tr>
            ) : (
              tours.map((tour) => (
                <tr key={tour.id}>
                  <td>
                    <strong>{tour.title}</strong>
                    <div className="admin-card__meta">/{tour.slug}</div>
                  </td>
                  <td>
                    <span className={`admin-badge ${STATUS_BADGE[tour.status] ?? "admin-badge--off"}`}>
                      {t.statusLabels[tour.status] ?? tour.status}
                    </span>
                  </td>
                  <td>{formatPriceCents(tour.basePriceCents, tour.currency)}</td>
                  <td>{tour.durationDays}</td>
                  <td>{tour.departureCount}</td>
                  <td>
                    <span className="admin-card__meta">
                      {tour.destinationNames.length > 0 ? tour.destinationNames.join(", ") : "—"}
                    </span>
                  </td>
                  <td style={{ textAlign: "end" }}>
                    <Link className="admin-btn admin-btn--ghost" href={`/admin/tours/${tour.id}`}>
                      {editable ? t.colEdit : dict.common.view}
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
