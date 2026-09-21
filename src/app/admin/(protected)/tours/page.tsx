import type { JSX } from "react";
import Link from "next/link";
import { requireCapability, can } from "@/server/auth/rbac";
import { listAdminTours } from "@/server/admin/catalog-admin";
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

  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>Tours</h1>
            <p>Every tour, all statuses. Only PUBLISHED tours appear on the public site.</p>
          </div>
          {editable ? (
            <Link className="admin-btn" href="/admin/tours/new">
              + New tour
            </Link>
          ) : null}
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>From</th>
              <th>Days</th>
              <th>Departures</th>
              <th>Destinations</th>
              <th style={{ textAlign: "right" }}>Edit</th>
            </tr>
          </thead>
          <tbody>
            {tours.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <span className="admin-card__meta">No tours yet.</span>
                </td>
              </tr>
            ) : (
              tours.map((t) => (
                <tr key={t.id}>
                  <td>
                    <strong>{t.title}</strong>
                    <div className="admin-card__meta">/{t.slug}</div>
                  </td>
                  <td>
                    <span className={`admin-badge ${STATUS_BADGE[t.status] ?? "admin-badge--off"}`}>
                      {t.status}
                    </span>
                  </td>
                  <td>{formatPriceCents(t.basePriceCents, t.currency)}</td>
                  <td>{t.durationDays}</td>
                  <td>{t.departureCount}</td>
                  <td>
                    <span className="admin-card__meta">
                      {t.destinationNames.length > 0 ? t.destinationNames.join(", ") : "—"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <Link className="admin-btn admin-btn--ghost" href={`/admin/tours/${t.id}`}>
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
