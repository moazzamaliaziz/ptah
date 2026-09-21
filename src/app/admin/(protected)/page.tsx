import type { JSX } from "react";
import Link from "next/link";
import { requireStaff, can } from "@/server/auth/rbac";
import { db } from "@/lib/db";

async function safeCount(fn: () => Promise<number>): Promise<number | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

export default async function AdminDashboard(): Promise<JSX.Element> {
  const user = await requireStaff();

  const [tours, bookings, integrationsOn, overrides] = await Promise.all([
    safeCount(() => db.tour.count()),
    safeCount(() => db.booking.count()),
    safeCount(() => db.integration.count({ where: { enabled: true } })),
    safeCount(() => db.contentSection.count({ where: { type: "PAGE_SECTION", enabled: true } })),
  ]);

  const fmt = (n: number | null) => (n === null ? "—" : String(n));

  return (
    <>
      <div className="admin-head">
        <h1>Welcome, {user.name.split(" ")[0]}</h1>
        <p>
          Signed in as {user.email} · role <strong>{user.role}</strong>
        </p>
      </div>

      <div className="admin-grid">
        <div className="admin-card">
          <h2>Tours</h2>
          <p style={{ fontSize: "2rem", margin: "0.25rem 0" }}>{fmt(tours)}</p>
          <p className="admin-card__meta">Catalog managed in Phase 3 (commerce).</p>
        </div>
        <div className="admin-card">
          <h2>Bookings</h2>
          <p style={{ fontSize: "2rem", margin: "0.25rem 0" }}>{fmt(bookings)}</p>
          <p className="admin-card__meta">Booking engine lands in Phase 3.</p>
        </div>
        <div className="admin-card">
          <h2>Integrations enabled</h2>
          <p style={{ fontSize: "2rem", margin: "0.25rem 0" }}>{fmt(integrationsOn)} / 20</p>
          {can(user, "integrations.view") ? (
            <Link className="admin-btn admin-btn--ghost" href="/admin/integrations">
              Manage integrations
            </Link>
          ) : (
            <p className="admin-card__meta">Requires admin role.</p>
          )}
        </div>
        <div className="admin-card">
          <h2>Landing overrides</h2>
          <p style={{ fontSize: "2rem", margin: "0.25rem 0" }}>{fmt(overrides)}</p>
          {can(user, "content.view") ? (
            <Link className="admin-btn admin-btn--ghost" href="/admin/content">
              Edit content
            </Link>
          ) : (
            <p className="admin-card__meta">Read-only for your role.</p>
          )}
        </div>
      </div>
    </>
  );
}
