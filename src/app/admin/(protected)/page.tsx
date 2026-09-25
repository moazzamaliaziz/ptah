import type { JSX } from "react";
import Link from "next/link";
import type { BookingStatus } from "@prisma/client";
import { requireStaff, can, type Capability } from "@/server/auth/rbac";
import { db } from "@/lib/db";
import { formatPriceCents } from "@/lib/utils";
import {
  listBookingsForAdmin,
  countBookingsNeedingAttention,
  type AdminBookingListItem,
} from "@/server/admin/orders-admin";
import { getMoneyReport, type MoneyReport } from "@/server/admin/reports";
import { countNewContactMessages } from "@/server/contact";
import AdminHint from "@/components/admin/AdminHint";

export const dynamic = "force-dynamic";

const emptyReport: MoneyReport = { revenue: [], refunds: [], statusCounts: [] };

/** Wrap one read so a single slow/failing query can't blank the whole page. */
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

const STATUS_BADGE: Record<BookingStatus, string> = {
  PENDING_PAYMENT: "admin-badge--gold",
  CONFIRMED: "admin-badge--on",
  CANCELLED: "admin-badge--off",
  REFUNDED: "admin-badge--off",
  FAILED: "admin-badge--off",
};

const STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING_PAYMENT: "Awaiting payment",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
  FAILED: "Failed",
};

function fmtWhen(d: Date): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(d);
}

interface QuickAction {
  href: string;
  label: string;
  cap: Capability;
}

export default async function AdminDashboard(): Promise<JSX.Element> {
  const user = await requireStaff();
  const canEnquiries = can(user, "enquiries.view");

  // Everything the dashboard needs, in ONE parallel batch — no "load A then B"
  // waterfall (the recent-orders list used to await *after* the counts). Each
  // read is guarded individually. getMoneyReport(null) is a single grouped
  // query that yields all-time status counts AND revenue per currency, so it
  // replaces what were separate booking counts.
  const [report, tours, integrationsOn, overrides, needsAttention, newEnquiries, latestOrders] =
    await Promise.all([
      safe<MoneyReport>(() => getMoneyReport(null), emptyReport),
      safe<number | null>(() => db.tour.count(), null),
      safe<number | null>(() => db.integration.count({ where: { enabled: true } }), null),
      safe<number | null>(
        () => db.contentSection.count({ where: { type: "PAGE_SECTION", enabled: true } }),
        null,
      ),
      safe<number>(() => countBookingsNeedingAttention(), 0),
      canEnquiries ? safe<number>(() => countNewContactMessages(), 0) : Promise.resolve(0),
      safe<AdminBookingListItem[]>(() => listBookingsForAdmin({ take: 8 }), []),
    ]);

  const countOf = (s: BookingStatus) => report.statusCounts.find((x) => x.status === s)?.count ?? 0;
  const totalBookings = report.statusCounts.reduce((sum, s) => sum + s.count, 0);
  const awaiting = countOf("PENDING_PAYMENT");
  const fmt = (n: number | null) => (n === null ? "—" : n.toLocaleString("en-US"));

  const quickActions: QuickAction[] = (
    [
      { href: "/admin/bookings", label: "Orders", cap: "bookings.view" },
      { href: "/admin/reports", label: "Reports", cap: "reports.view" },
      { href: "/admin/tours", label: "Tours", cap: "catalog.view" },
      { href: "/admin/content", label: "Content", cap: "content.view" },
      { href: "/admin/coupons", label: "Coupons", cap: "coupons.view" },
      { href: "/admin/media", label: "Media", cap: "media.view" },
    ] satisfies QuickAction[]
  ).filter((a) => can(user, a.cap));

  const hasAlerts = needsAttention > 0 || (canEnquiries && newEnquiries > 0);
  return (
    <>
      <div className="admin-head">
        <h1>Welcome, {user.name.split(" ")[0]}</h1>
        <p>
          Signed in as {user.email} · role <strong>{user.role}</strong>
        </p>
      </div>

      {hasAlerts && (
        <section aria-label="Needs attention" style={{ marginBottom: "1.5rem" }}>
          {needsAttention > 0 && (
            <div className="admin-alert admin-alert--warn">
              <div className="admin-row admin-row--between">
                <span>
                  <strong>{needsAttention}</strong> booking{needsAttention === 1 ? "" : "s"} awaiting
                  bank-transfer confirmation.
                </span>
                <Link className="admin-btn admin-btn--sm" href="/admin/bookings?status=PENDING_PAYMENT">
                  Review →
                </Link>
              </div>
            </div>
          )}
          {canEnquiries && newEnquiries > 0 && (
            <div className="admin-alert admin-alert--info">
              <div className="admin-row admin-row--between">
                <span>
                  <strong>{newEnquiries}</strong> new enquir{newEnquiries === 1 ? "y" : "ies"} to read.
                </span>
                <Link className="admin-btn admin-btn--sm" href="/admin/enquiries">
                  Open enquiries →
                </Link>
              </div>
            </div>
          )}
        </section>
      )}
      <section className="admin-kpis" aria-label="Booking totals">
        <div className="admin-kpi">
          <span className="admin-kpi__label">Total bookings</span>
          <strong className="admin-kpi__value">{totalBookings.toLocaleString("en-US")}</strong>
        </div>
        <div className="admin-kpi">
          <span className="admin-kpi__label">Confirmed</span>
          <strong className="admin-kpi__value">{countOf("CONFIRMED").toLocaleString("en-US")}</strong>
        </div>
        <div className="admin-kpi">
          <span className="admin-kpi__label">Awaiting payment</span>
          <strong className="admin-kpi__value" style={awaiting > 0 ? { color: "#8a4b12" } : undefined}>
            {awaiting.toLocaleString("en-US")}
          </strong>
        </div>
        <div className="admin-kpi">
          <span className="admin-kpi__label">Refunded</span>
          <strong className="admin-kpi__value">{countOf("REFUNDED").toLocaleString("en-US")}</strong>
        </div>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <div className="admin-row admin-row--between" style={{ marginBottom: "0.5rem" }}>
          <h2 style={{ margin: 0 }}>
            Revenue to date
            <AdminHint text="Money actually taken from confirmed bookings, after any discounts. Each currency is shown on its own — EGP and USD are never added together." />
          </h2>
          {can(user, "reports.view") && <Link href="/admin/reports">Full reports →</Link>}
        </div>
        {report.revenue.length === 0 ? (
          <div className="admin-card">
            <p className="admin-card__meta">No confirmed revenue yet.</p>
          </div>
        ) : (
          <div className="admin-grid">
            {report.revenue.map((r) => (
              <div key={r.currency} className="admin-card">
                <div className="admin-row admin-row--between">
                  <strong>{r.currency}</strong>
                  <span className="admin-badge admin-badge--on">{r.confirmedBookings} confirmed</span>
                </div>
                <p style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0.35rem 0" }}>
                  {formatPriceCents(r.netCents, r.currency)}
                </p>
                <p className="admin-card__meta">Net taken (after discounts)</p>
              </div>
            ))}
          </div>
        )}
      </section>
      {quickActions.length > 0 && (
        <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ marginTop: 0 }}>Quick actions</h2>
          <div className="admin-row">
            {quickActions.map((a) => (
              <Link key={a.href} className="admin-btn admin-btn--ghost" href={a.href}>
                {a.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="admin-card" style={{ marginBottom: "1.5rem" }}>
        <div className="admin-row admin-row--between" style={{ alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Recent orders</h2>
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
                    <span className={`admin-badge ${STATUS_BADGE[o.status]}`}>{STATUS_LABEL[o.status]}</span>
                  </td>
                  <td>{formatPriceCents(o.totalCents, o.currency)}</td>
                  <td>{fmtWhen(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <section aria-label="System overview">
        <h2>System</h2>
        <div className="admin-grid">
          <div className="admin-card">
            <div className="admin-row admin-row--between">
              <h3 style={{ margin: 0 }}>Tours</h3>
              {can(user, "catalog.view") && (
                <Link href="/admin/tours" className="admin-card__meta">
                  Manage →
                </Link>
              )}
            </div>
            <p style={{ fontSize: "1.6rem", fontWeight: 700, margin: "0.25rem 0 0" }}>{fmt(tours)}</p>
          </div>
          <div className="admin-card">
            <div className="admin-row admin-row--between">
              <h3 style={{ margin: 0 }}>Integrations enabled</h3>
              {can(user, "integrations.view") && (
                <Link href="/admin/integrations" className="admin-card__meta">
                  Manage →
                </Link>
              )}
            </div>
            <p style={{ fontSize: "1.6rem", fontWeight: 700, margin: "0.25rem 0 0" }}>{fmt(integrationsOn)} / 20</p>
          </div>
          <div className="admin-card">
            <div className="admin-row admin-row--between">
              <h3 style={{ margin: 0 }}>
                Landing overrides
                <AdminHint text="How many parts of the public home page you have customized here in the admin (instead of the built-in default text)." />
              </h3>
              {can(user, "content.view") && (
                <Link href="/admin/content" className="admin-card__meta">
                  Edit →
                </Link>
              )}
            </div>
            <p style={{ fontSize: "1.6rem", fontWeight: 700, margin: "0.25rem 0 0" }}>{fmt(overrides)}</p>
          </div>
        </div>
      </section>



    </>
  );
}

