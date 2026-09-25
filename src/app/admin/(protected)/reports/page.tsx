import { Suspense, type JSX } from "react";
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
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict, type ReportsDict } from "@/i18n/admin/dictionary";
import AdminHint from "@/components/admin/AdminHint";
import { ReportsCharts } from "@/components/admin/ReportsCharts";

export const dynamic = "force-dynamic";

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

/**
 * Website-traffic panel (Google Analytics). Split into its own async component
 * so its slow fetch (token exchange + runReport, ~16s worst case) streams in
 * under <Suspense> instead of blocking the whole report. Never throws — the
 * GA4 service returns a typed ok/err result, wrapped in safe() as a last resort.
 */
async function Ga4Panel({ since, t }: { since: Date | null; t: ReportsDict }): Promise<JSX.Element> {
  const ga4 = await safe<Ga4TrafficResult>(() => getGa4CountryTraffic(since), {
    ok: false,
    reason: "error",
    message: "",
  });
  if (!ga4.ok) {
    // Copy is chosen by machine-readable reason, not the server's English message,
    // so the panel is fully localized (and the message prop can stay untranslated).
    const msg = ga4.reason === "not_configured" ? t.ga4NotConfigured : t.ga4Error;
    return (
      <div className="admin-card">
        <p className="admin-card__meta">{msg}</p>
        {ga4.reason === "not_configured" && (
          <Link href="/admin/integrations" className="admin-btn admin-btn--ghost" style={{ marginTop: "0.5rem" }}>
            {t.ga4Setup}
          </Link>
        )}
      </div>
    );
  }
  if (ga4.rows.length === 0) {
    return (
      <div className="admin-card">
        <p className="admin-card__meta">{t.ga4NoData}</p>
      </div>
    );
  }
  return (
    <table className="admin-table">
      <thead>
        <tr>
          <th>{t.colCountry}</th>
          <th>{t.colSessions}</th>
          <th>{t.colActiveUsers}</th>
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
  );
}

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}): Promise<JSX.Element> {
  await requireCapability("reports.view");
  const locale = await getAdminLocale();
  const dict = getAdminDict(locale);
  const t = dict.reports;
  const { range: rawRange } = await searchParams;
  const range = parseReportRange(rawRange);

  const emptyMoney: MoneyReport = { revenue: [], refunds: [], statusCounts: [] };
  // GA4 is deliberately NOT awaited here — it can take ~16s. It streams in
  // separately via <Suspense> + <Ga4Panel> below, so the rest of the report
  // (money, tours, countries — all fast DB reads) renders immediately.
  const [money, topTours, byCountry] = await Promise.all([
    safe<MoneyReport>(() => getMoneyReport(range.since), emptyMoney),
    safe<TourRevenue[]>(() => getTopTours(range.since), []),
    safe<CountryCount[]>(() => getBookingsByCountry(range.since), []),
  ]);

  const rangeHref = (k: ReportRangeKey) => (k === "30d" ? "/admin/reports" : `/admin/reports?range=${k}`);
  const csvHref = `/admin/reports/export?range=${range.key}`;
  const countOf = (s: BookingStatus) => money.statusCounts.find((x) => x.status === s)?.count ?? 0;
  const totalBookings = money.statusCounts.reduce((sum, s) => sum + s.count, 0);

  // Chart inputs — COUNTS only (currency-agnostic); money is never charted.
  const statusChart = money.statusCounts
    .filter((s) => s.count > 0)
    .map((s) => ({ key: s.status, name: dict.status[s.status], value: s.count }));
  const toursChart = topTours.slice(0, 8).map((t) => ({ name: t.tourTitle, bookings: t.confirmedBookings }));
  const countriesChart = byCountry.slice(0, 8).map((c) => ({ name: c.name, bookings: c.count }));

  return (
    <>
      <div className="admin-head">
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </div>

      <div className="admin-row admin-row--between" style={{ marginBottom: "1rem", gap: "1rem" }}>
        <nav className="admin-row" aria-label={t.rangeAria}>
          {REPORT_RANGES.map((k) => {
            const active = k === range.key;
            return (
              <Link
                key={k}
                href={rangeHref(k)}
                className={`admin-btn ${active ? "" : "admin-btn--ghost"}`}
                aria-current={active ? "page" : undefined}
              >
                {t.rangeTab[k]}
              </Link>
            );
          })}
        </nav>
        <a href={csvHref} className="admin-btn admin-btn--ghost admin-btn--sm" download>
          {t.downloadCsv}
        </a>
      </div>

      <section className="admin-kpis" aria-label={t.kpiAria}>
        <div className="admin-kpi">
          <span className="admin-kpi__label">{t.kpiTotalBookings}</span>
          <strong className="admin-kpi__value">{totalBookings.toLocaleString("en-US")}</strong>
        </div>
        <div className="admin-kpi">
          <span className="admin-kpi__label">{t.kpiConfirmed}</span>
          <strong className="admin-kpi__value">{countOf("CONFIRMED").toLocaleString("en-US")}</strong>
        </div>
        <div className="admin-kpi">
          <span className="admin-kpi__label">{t.kpiAwaitingPayment}</span>
          <strong className="admin-kpi__value">{countOf("PENDING_PAYMENT").toLocaleString("en-US")}</strong>
        </div>
        <div className="admin-kpi">
          <span className="admin-kpi__label">{t.kpiRefunded}</span>
          <strong className="admin-kpi__value">{countOf("REFUNDED").toLocaleString("en-US")}</strong>
        </div>
      </section>

      {totalBookings > 0 && (
        <ReportsCharts status={statusChart} topTours={toursChart} countries={countriesChart} labels={t.charts} />
      )}

      <section style={{ marginBottom: "1.5rem" }}>
        <div className="admin-row admin-row--between" style={{ marginBottom: "0.5rem" }}>
          <h2 style={{ margin: 0 }}>
            {t.revenueHeading}
            <AdminHint text={t.revenueHint} helpLabel={dict.common.help} />
          </h2>
          <span className="admin-badge admin-badge--gold">{t.rangeLabel[range.key]}</span>
        </div>
        {money.revenue.length === 0 ? (
          <div className="admin-card">
            <p className="admin-card__meta">{t.noRevenue}</p>
          </div>
        ) : (
          <div className="admin-grid">
            {money.revenue.map((r) => (
              <div key={r.currency} className="admin-card">
                <div className="admin-row admin-row--between">
                  <strong>{r.currency}</strong>
                  <span className="admin-badge admin-badge--on">{t.bookingsCount(r.confirmedBookings)}</span>
                </div>
                <p style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0.35rem 0" }}>
                  {formatPriceCents(r.netCents, r.currency)}
                </p>
                <p className="admin-card__meta">{t.netTaken}</p>
                {r.discountCents > 0 && (
                  <p className="admin-card__meta">
                    {t.grossLine(
                      formatPriceCents(r.grossCents, r.currency),
                      formatPriceCents(r.discountCents, r.currency),
                    )}
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
            {t.refundsHeading}
            <AdminHint text={t.refundsHint} helpLabel={dict.common.help} />
          </h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t.refundColCurrency}</th>
                <th>{t.refundColBookings}</th>
                <th>{t.refundColAmount}</th>
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
          {t.byStatusHeading}
          <AdminHint text={t.byStatusHint} helpLabel={dict.common.help} />
        </h2>
        {money.statusCounts.length === 0 ? (
          <div className="admin-card">
            <p className="admin-card__meta">{t.noBookings}</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t.colStatus}</th>
                <th>{t.colBookings}</th>
              </tr>
            </thead>
            <tbody>
              {money.statusCounts.map((s) => (
                <tr key={s.status}>
                  <td>{dict.status[s.status]}</td>
                  <td>{s.count}</td>
                </tr>
              ))}
              <tr>
                <td>
                  <strong>{t.totalRow}</strong>
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
          {t.topToursHeading}
          <AdminHint text={t.topToursHint} helpLabel={dict.common.help} />
        </h2>
        {topTours.length === 0 ? (
          <div className="admin-card">
            <p className="admin-card__meta">{t.noTourBookings}</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t.colTour}</th>
                <th>{t.colBookings}</th>
                <th>{t.colSeats}</th>
                <th>{t.colRevenue}</th>
              </tr>
            </thead>
            <tbody>
              {topTours.map((tour) => (
                <tr key={tour.tourSlug}>
                  <td>{tour.tourTitle}</td>
                  <td>{tour.confirmedBookings}</td>
                  <td>{tour.seats}</td>
                  <td>{currencyLine(tour.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2>
          {t.byCountryHeading}
          <AdminHint text={t.byCountryHint} helpLabel={dict.common.help} />
        </h2>
        <p className="admin-card__meta" style={{ marginTop: "-0.35rem" }}>
          {t.byCountryNote}
        </p>
        {byCountry.length === 0 ? (
          <div className="admin-card">
            <p className="admin-card__meta">{t.noConfirmedBookings}</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t.colCountry}</th>
                <th>{t.colBookings}</th>
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
          {t.trafficHeading}
          <AdminHint text={t.trafficHint} helpLabel={dict.common.help} />
        </h2>
        <p className="admin-card__meta" style={{ marginTop: "-0.35rem" }}>
          {t.trafficNote}
        </p>
        <Suspense
          fallback={
            <div className="admin-card">
              <p className="admin-card__meta">{t.ga4Loading}</p>
            </div>
          }
        >
          <Ga4Panel since={range.since} t={t} />
        </Suspense>
      </section>
    </>
  );
}
