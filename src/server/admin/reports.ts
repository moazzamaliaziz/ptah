/**
 * Admin reports & analytics — read-only money + booking aggregations (P7).
 *
 * server-only. THE money rule for this whole module: figures are ALWAYS grouped
 * PER CURRENCY and never summed across currencies. The shop takes both EGP and
 * USD (and possibly more); "total revenue = 1000" is meaningless when it mixes
 * currencies, so every money shape here is an array keyed by `currency` and
 * there is deliberately no cross-currency grand total anywhere.
 *
 * `booking.totalCents` is the authoritative NET amount actually charged (P5
 * discounts already subtracted inside the reservation txn); `discountCents` is
 * what a coupon took off, so GROSS = net + discount. Revenue = CONFIRMED
 * bookings only; refunds are reported separately from REFUNDED bookings.
 */
import "server-only";
import type { Prisma, BookingStatus } from "@prisma/client";
import { db } from "@/lib/db";

export type ReportRangeKey = "7d" | "30d" | "90d" | "12m" | "ytd" | "all";

export interface ReportRange {
  key: ReportRangeKey;
  /** Inclusive lower bound on `createdAt`, or null for all-time. */
  since: Date | null;
  label: string;
}

/** Fixed-length day windows. `ytd` (year-to-date) and `all` are special-cased. */
const RANGE_DAYS: Record<"7d" | "30d" | "90d" | "12m", number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "12m": 365,
};

const RANGE_LABEL: Record<ReportRangeKey, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  "12m": "Last 12 months",
  ytd: "Year to date",
  all: "All time",
};

export const REPORT_RANGES: readonly ReportRangeKey[] = ["7d", "30d", "90d", "12m", "ytd", "all"];

/** Narrow an untrusted `?range=` param to a ReportRange (defaults to 30 days). */
export function parseReportRange(value: string | undefined): ReportRange {
  const key: ReportRangeKey =
    value === "7d" || value === "90d" || value === "12m" || value === "ytd" || value === "all"
      ? value
      : "30d";
  let since: Date | null = null;
  if (key === "ytd") {
    // Since Jan 1 of the current year (UTC), so the window follows the calendar.
    since = new Date(Date.UTC(new Date().getUTCFullYear(), 0, 1));
  } else if (key !== "all") {
    since = new Date();
    since.setUTCDate(since.getUTCDate() - RANGE_DAYS[key]);
  }
  return { key, since, label: RANGE_LABEL[key] };
}

/** Revenue for one currency — CONFIRMED bookings only. Never merged with others. */
export interface CurrencyRevenue {
  currency: string;
  confirmedBookings: number;
  /** Σ totalCents — the authoritative NET actually charged. */
  netCents: number;
  /** Σ discountCents applied by coupons. */
  discountCents: number;
  /** net + discount — what the price would have been before discounts. */
  grossCents: number;
}

/** Money refunded, per currency — from REFUNDED bookings. */
export interface CurrencyRefund {
  currency: string;
  refundedBookings: number;
  netCents: number;
}

export interface StatusCount {
  status: BookingStatus;
  count: number;
}

export interface MoneyReport {
  revenue: CurrencyRevenue[];
  refunds: CurrencyRefund[];
  statusCounts: StatusCount[];
}

const ALL_STATUSES: readonly BookingStatus[] = [
  "PENDING_PAYMENT",
  "CONFIRMED",
  "CANCELLED",
  "REFUNDED",
  "FAILED",
];

/**
 * One grouped pass over bookings in range → revenue (CONFIRMED) and refunds
 * (REFUNDED) per currency, plus booking counts per status. Counting bookings
 * across currencies is fine (a count is not money); only the *money* stays
 * partitioned by currency.
 */
export async function getMoneyReport(since: Date | null): Promise<MoneyReport> {
  const where = {
    ...(since ? { createdAt: { gte: since } } : {}),
  } satisfies Prisma.BookingWhereInput;

  const rows = await db.booking.groupBy({
    by: ["status", "currency"],
    where,
    _sum: { totalCents: true, discountCents: true },
    _count: { _all: true },
  });

  const revenue: CurrencyRevenue[] = [];
  const refunds: CurrencyRefund[] = [];
  const statusTotals = new Map<BookingStatus, number>(ALL_STATUSES.map((s) => [s, 0]));

  for (const r of rows) {
    const count = r._count._all;
    statusTotals.set(r.status, (statusTotals.get(r.status) ?? 0) + count);
    const net = r._sum.totalCents ?? 0;
    const discount = r._sum.discountCents ?? 0;
    if (r.status === "CONFIRMED") {
      revenue.push({
        currency: r.currency,
        confirmedBookings: count,
        netCents: net,
        discountCents: discount,
        grossCents: net + discount,
      });
    } else if (r.status === "REFUNDED") {
      refunds.push({ currency: r.currency, refundedBookings: count, netCents: net });
    }
  }

  // Highest-earning currency first; refunds by size too.
  revenue.sort((a, b) => b.netCents - a.netCents);
  refunds.sort((a, b) => b.netCents - a.netCents);

  const statusCounts: StatusCount[] = ALL_STATUSES.map((status) => ({
    status,
    count: statusTotals.get(status) ?? 0,
  }));

  return { revenue, refunds, statusCounts };
}

/** Per-tour performance. `revenue` stays an array keyed by currency. */
export interface TourRevenue {
  tourTitle: string;
  tourSlug: string;
  confirmedBookings: number;
  seats: number;
  revenue: { currency: string; netCents: number }[];
}

/**
 * Top tours by confirmed-booking count in range. Bounded: aggregated with a DB
 * `groupBy` on (departureId, currency), so the rows returned are capped by the
 * finite departure catalog rather than the (unbounded) booking volume. The
 * handful of referenced departures are then resolved to their tour title/slug
 * and folded together per tour. `revenue` stays an array keyed by currency
 * (money is never summed across currencies).
 */
export async function getTopTours(since: Date | null, limit = 10): Promise<TourRevenue[]> {
  const where = {
    status: "CONFIRMED",
    ...(since ? { createdAt: { gte: since } } : {}),
  } satisfies Prisma.BookingWhereInput;

  const grouped = await db.booking.groupBy({
    by: ["departureId", "currency"],
    where,
    _count: { _all: true },
    _sum: { seats: true, totalCents: true },
  });
  if (grouped.length === 0) return [];

  // Resolve only the departures that actually had confirmed bookings → tour.
  const departureIds = [...new Set(grouped.map((g) => g.departureId))];
  const departures = await db.tourDeparture.findMany({
    where: { id: { in: departureIds } },
    select: { id: true, tour: { select: { title: true, slug: true } } },
  });
  const tourOf = new Map(departures.map((d) => [d.id, d.tour]));

  const byTour = new Map<
    string,
    { title: string; slug: string; bookings: number; seats: number; revenue: Map<string, number> }
  >();
  for (const g of grouped) {
    const tour = tourOf.get(g.departureId);
    if (!tour) continue; // departure gone (Restrict makes this unreachable) — skip defensively
    let agg = byTour.get(tour.slug);
    if (!agg) {
      agg = { title: tour.title, slug: tour.slug, bookings: 0, seats: 0, revenue: new Map() };
      byTour.set(tour.slug, agg);
    }
    agg.bookings += g._count._all;
    agg.seats += g._sum.seats ?? 0;
    agg.revenue.set(g.currency, (agg.revenue.get(g.currency) ?? 0) + (g._sum.totalCents ?? 0));
  }

  return [...byTour.values()]
    .map((t) => ({
      tourTitle: t.title,
      tourSlug: t.slug,
      confirmedBookings: t.bookings,
      seats: t.seats,
      revenue: [...t.revenue.entries()]
        .map(([currency, netCents]) => ({ currency, netCents }))
        .sort((a, b) => b.netCents - a.netCents),
    }))
    .sort((a, b) => b.confirmedBookings - a.confirmedBookings)
    .slice(0, limit);
}

export interface CountryCount {
  /** ISO-3166 alpha-2, or null when the origin was never captured. */
  code: string | null;
  name: string;
  count: number;
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

/** Resolve an alpha-2 code to an English country name, tolerating junk. */
function countryName(code: string | null): string {
  if (!code) return "Unknown";
  try {
    return regionNames.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

/**
 * Confirmed bookings grouped by the origin country captured at checkout
 * (locked decision 3: booking-by-country comes from the billing address, not
 * from GA4). Null origins are surfaced as "Unknown" rather than dropped.
 */
export async function getBookingsByCountry(since: Date | null): Promise<CountryCount[]> {
  const where = {
    status: "CONFIRMED",
    ...(since ? { createdAt: { gte: since } } : {}),
  } satisfies Prisma.BookingWhereInput;

  const rows = await db.booking.groupBy({
    by: ["originCountry"],
    where,
    _count: { _all: true },
  });

  return rows
    .map((r) => ({
      code: r.originCountry,
      name: countryName(r.originCountry),
      count: r._count._all,
    }))
    .sort((a, b) => b.count - a.count);
}
