import type { JSX } from "react";
import Link from "next/link";
import type { BookingStatus } from "@prisma/client";
import { requireCapability } from "@/server/auth/rbac";
import { formatPriceCents } from "@/lib/utils";
import {
  parseReportRange,
  REPORT_RANGES,
  getMoneyReport,
  getTopTours,
  getBookingsByCountry,
  type ReportRangeKey,
  type MoneyReport,
  type TourRevenue,
  type CountryCount,
} from "@/server/admin/reports";
import { getGa4CountryTraffic, type Ga4TrafficResult } from "@/server/admin/analytics-ga4";
import AdminHint from "@/components/admin/AdminHint";

export const dynamic = "force-dynamic";

const RANGE_TAB_LABEL: Record<ReportRangeKey, string> = {
  "30d": "30 days",
  "90d": "90 days",
  "12m": "12 months",
  all: "All time",
};

const STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING_PAYMENT: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
  FAILED: "Failed",
};

/** Never let one flaky read blank the whole page (mirrors the dashboard). */
async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

/** Join a per-currency revenue list into one line — kept separate, never summed. */
function currencyLine(revenue: { currency: string; netCents: number }[]): string {
  if (revenue.length === 0) return "—";
  return revenue.map((r) => formatPriceCents(r.netCents, r.currency)).join(" · ");
}

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}): Promise<JSX.Element> {
  await requireCapability("reports.view");
  const { range: rawRange } = await searchParams;
  const range = parseReportRange(rawRange);

  const emptyMoney: MoneyReport = { revenue: [], refunds: [], statusCounts: [] };
  const [money, topTours, byCountry, ga4] = await Promise.all([
    safe<MoneyReport>(() => getMoneyReport(range.since), emptyMoney),
    safe<TourRevenue[]>(() => getTopTours(range.since), []),
    safe<CountryCount[]>(() => getBookingsByCountry(range.since), []),
    safe<Ga4TrafficResult>(() => getGa4CountryTraffic(range.since), {
      ok: false,
      reason: "error",
      message: "Analytics unavailable right now.",
    }),
  ]);

  const rangeHref = (k: ReportRangeKey) => (k === "30d" ? "/admin/reports" : `/admin/reports?range=${k}`);
  const totalBookings = money.statusCounts.reduce((sum, s) => sum + s.count, 0);

  return (
    <>
      <div className="admin-head">
        <h1>Reports</h1>
        <p>Revenue and bookings for the selected period. Money is shown per currency and never mixed.</p>
      </div>

      <nav className="admin-row" aria-label="Report period" style={{ marginBottom: "1rem" }}>
        {REPORT_RANGES.map((k) => {
          const active = k === range.key;
          return (
            <Link
              key={k}
              href={rangeHref(k)}
              className={`admin-btn ${active ? "" : "admin-btn--ghost"}`}
              aria-current={active ? "page" : undefined}
            >
              {RANGE_TAB_LABEL[k]}
            </Link>
          );
        })}
      </nav>

      <section style={{ marginBottom: "1.5rem" }}>
        <div className="admin-row admin-row--between" style={{ marginBottom: "0.5rem" }}>
          <h2 style={{ margin: 0 }}>
            Revenue (confirmed)
            <AdminHint text="Money actually taken from paid (confirmed) bookings, after any coupon discounts. Each currency is shown on its own — EGP and USD are never added together." />
          </h2>
          <span className="admin-badge admin-badge--gold">{range.label}</span>
        </div>
        {money.revenue.length === 0 ? (
          <div className="admin-card">
            <p className="admin-card__meta">No confirmed revenue in this period.</p>
          </div>
        ) : (
          <div className="admin-grid">
            {money.revenue.map((r) => (
              <div key={r.currency} className="admin-card">
                <div className="admin-row admin-row--between">
                  <strong>{r.currency}</strong>
                  <span className="admin-badge admin-badge--on">{r.confirmedBookings} bookings</span>
                </div>
                <p style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0.35rem 0" }}>
                  {formatPriceCents(r.netCents, r.currency)}
                </p>
                <p className="admin-card__meta">Net taken (after discounts)</p>
                {r.discountCents > 0 && (
                  <p className="admin-card__meta">
                    Gross {formatPriceCents(r.grossCents, r.currency)} · discounts −
                    {formatPriceCents(r.discountCents, r.currency)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {money.refunds.length > 0 && (
        <section style={{ marginBottom: "1.5rem" }}>
          <h2>
            Refunds
            <AdminHint text="Money paid back to customers on refunded bookings, shown per currency." />
          </h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Currency</th>
                <th>Refunded bookings</th>
                <th>Amount refunded</th>
              </tr>
            </thead>
            <tbody>
              {money.refunds.map((r) => (
                <tr key={r.currency}>
                  <td>{r.currency}</td>
                  <td>{r.refundedBookings}</td>
                  <td>{formatPriceCents(r.netCents, r.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>
          Bookings by status
          <AdminHint text="How many bookings fall into each stage — pending payment, confirmed, cancelled, refunded or failed. This counts bookings, not money, so all currencies are included together." />
        </h2>
        {money.statusCounts.length === 0 ? (
          <div className="admin-card">
            <p className="admin-card__meta">No bookings in this period.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Bookings</th>
              </tr>
            </thead>
            <tbody>
              {money.statusCounts.map((s) => (
                <tr key={s.status}>
                  <td>{STATUS_LABEL[s.status]}</td>
                  <td>{s.count}</td>
                </tr>
              ))}
              <tr>
                <td>
                  <strong>Total</strong>
                </td>
                <td>
                  <strong>{totalBookings}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>
          Top tours (confirmed)
          <AdminHint text="Your best-selling tours in this period, ordered by number of confirmed bookings. Revenue is listed per currency for each tour." />
        </h2>
        {topTours.length === 0 ? (
          <div className="admin-card">
            <p className="admin-card__meta">No confirmed tour bookings in this period.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tour</th>
                <th>Bookings</th>
                <th>Seats</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topTours.map((t) => (
                <tr key={t.tourSlug}>
                  <td>{t.tourTitle}</td>
                  <td>{t.confirmedBookings}</td>
                  <td>{t.seats}</td>
                  <td>{currencyLine(t.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>
          Bookings by country
          <AdminHint text="Where your paying customers are — grouped by the country they entered at checkout. This is buyers only, not general website visitors." />
        </h2>
        <p className="admin-card__meta" style={{ marginTop: "-0.35rem" }}>
          From the customer&apos;s country at checkout (confirmed bookings).
        </p>
        {byCountry.length === 0 ? (
          <div className="admin-card">
            <p className="admin-card__meta">No confirmed bookings in this period.</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Country</th>
                <th>Bookings</th>
              </tr>
            </thead>
            <tbody>
              {byCountry.map((c) => (
                <tr key={c.code ?? "unknown"}>
                  <td>{c.name}</td>
                  <td>{c.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>
          Website traffic by country
          <AdminHint text="Everyone who visited the site, from Google Analytics — not just buyers. Sessions = visits; active users = distinct people. Needs Google Analytics set up in Integrations." />
        </h2>
        <p className="admin-card__meta" style={{ marginTop: "-0.35rem" }}>
          Visitor sessions from Google Analytics (all site traffic, not only buyers).
        </p>
        {ga4.ok ? (
          ga4.rows.length === 0 ? (
            <div className="admin-card">
              <p className="admin-card__meta">No visitor data reported for this period yet.</p>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Sessions</th>
                  <th>Active users</th>
                </tr>
              </thead>
              <tbody>
                {ga4.rows.map((r) => (
                  <tr key={r.country}>
                    <td>{r.country}</td>
                    <td>{r.sessions.toLocaleString("en-US")}</td>
                    <td>{r.activeUsers.toLocaleString("en-US")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        ) : (
          <div className="admin-card">
            <p className="admin-card__meta">{ga4.message}</p>
            {ga4.reason === "not_configured" && (
              <Link href="/admin/integrations" className="admin-btn admin-btn--ghost" style={{ marginTop: "0.5rem" }}>
                Set up Google Analytics →
              </Link>
            )}
          </div>
        )}
      </section>
    </>
  );
}
