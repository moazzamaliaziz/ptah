import type { JSX } from "react";
import Link from "next/link";
import type { BookingStatus } from "@prisma/client";
import { requireStaff, can } from "@/server/auth/rbac";
import { db } from "@/lib/db";
import { formatPriceCents } from "@/lib/utils";
import {
  listBookingsForAdmin,
  countBookingsNeedingAttention,
  type AdminBookingListItem,
} from "@/server/admin/orders-admin";
import AdminHint from "@/components/admin/AdminHint";

export const dynamic = "force-dynamic";

async function safeCount(fn: () => Promise<number>): Promise<number | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

async function safeList(fn: () => Promise<AdminBookingListItem[]>): Promise<AdminBookingListItem[]> {
  try {
    return await fn();
  } catch {
    return [];
  }
}

const STATUS_BADGE: Record<BookingStatus, string> = {
  PENDING_PAYMENT: "admin-badge--gold",
  CONFIRMED: "admin-badge--on",
  CANCELLED: "admin-badge--off",
  REFUNDED: "admin-badge--off",
  FAILED: "admin-badge--off",
};

function fmtWhen(d: Date): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(d);
}

export default async function AdminDashboard(): Promise<JSX.Element> {
  const user = await requireStaff();

  const [tours, bookings, integrationsOn, overrides, needsAttention] = await Promise.all([
    safeCount(() => db.tour.count()),
    safeCount(() => db.booking.count()),
    safeCount(() => db.integration.count({ where: { enabled: true } })),
    safeCount(() => db.contentSection.count({ where: { type: "PAGE_SECTION", enabled: true } })),
    safeCount(() => countBookingsNeedingAttention()),
  ]);

  const latestOrders = await safeList(() => listBookingsForAdmin({ take: 8 }));

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
          {can(user, "catalog.view") ? (
            <Link className="admin-btn admin-btn--ghost" href="/admin/tours">
              Manage tours
            </Link>
          ) : (
            <p className="admin-card__meta">Read-only for your role.</p>
          )}
        </div>
        <div className="admin-card">
          <h2>Bookings</h2>
          <p style={{ fontSize: "2rem", margin: "0.25rem 0" }}>{fmt(bookings)}</p>
          {needsAttention && needsAttention > 0 ? (
            <p className="admin-card__meta" style={{ color: "#8a1c1c", fontWeight: 600 }}>
              {needsAttention} awaiting bank-transfer confirmation
            </p>
          ) : (
            <p className="admin-card__meta">Nothing awaiting confirmation.</p>
          )}
          <Link className="admin-btn admin-btn--ghost" href="/admin/bookings">
            View orders
          </Link>
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
          <h2>
            Landing overrides
            <AdminHint text="How many parts of the public home page you have customized here in the admin (instead of showing the built-in default text). Edit them under Content." />
          </h2>
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

      <div className="admin-card" style={{ marginTop: "1rem" }}>
        <div className="admin-row" style={{ justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Latest orders</h2>
          <Link href="/admin/bookings">View all →</Link>
        </div>
        {latestOrders.length === 0 ? (
          <p className="admin-card__meta" style={{ marginTop: "0.75rem" }}>
            No orders yet.
          </p>
        ) : (
          <table className="admin-table" style={{ marginTop: "0.75rem" }}>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Tour</th>
                <th>Customer</th>
                <th>Status</th>
                <th>Amount</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {latestOrders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <Link href={`/admin/bookings/${o.id}`}>
                      <code className="admin-card__meta">{o.id.slice(0, 8)}</code>
                    </Link>
                  </td>
                  <td>{o.tourTitle}</td>
                  <td>{o.contactName ?? o.contactEmail ?? "—"}</td>
                  <td>
                    <span className={`admin-badge ${STATUS_BADGE[o.status]}`}>{o.status}</span>
                  </td>
                  <td>{formatPriceCents(o.totalCents, o.currency)}</td>
                  <td>{fmtWhen(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
