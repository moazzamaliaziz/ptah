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

export type ReportRangeKey = "30d" | "90d" | "12m" | "all";

export interface ReportRange {
  key: ReportRangeKey;
  /** Inclusive lower bound on `createdAt`, or null for all-time. */
  since: Date | null;
  label: string;
}

const RANGE_DAYS: Record<Exclude<ReportRangeKey, "all">, number> = {
  "30d": 30,
  "90d": 90,
  "12m": 365,
};

const RANGE_LABEL: Record<ReportRangeKey, string> = {
  "30d": "Last 30 days",
  "90d": "Last 90 days",
  "12m": "Last 12 months",
  all: "All time",
};

export const REPORT_RANGES: readonly ReportRangeKey[] = ["30d", "90d", "12m", "all"];

/** Narrow an untrusted `?range=` param to a ReportRange (defaults to 30 days). */
export function parseReportRange(value: string | undefined): ReportRange {
  const key: ReportRangeKey =
    value === "90d" || value === "12m" || value === "all" ? value : "30d";
  let since: Date | null = null;
  if (key !== "all") {
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
 * Top tours by confirmed-booking count in range. Aggregated in memory (a tour
 * has many departures, so a DB groupBy by departureId would still need a second
 * join to reach the tour) — reporting volumes are modest and each row is tiny.
 */
export async function getTopTours(since: Date | null, limit = 10): Promise<TourRevenue[]> {
  const where = {
    status: "CONFIRMED",
    ...(since ? { createdAt: { gte: since } } : {}),
  } satisfies Prisma.BookingWhereInput;

  const rows = await db.booking.findMany({
    where,
    select: {
      seats: true,
      totalCents: true,
      currency: true,
      departure: { select: { tour: { select: { title: true, slug: true } } } },
    },
  });

  const byTour = new Map<
    string,
    { title: string; slug: string; bookings: number; seats: number; revenue: Map<string, number> }
  >();
  for (const b of rows) {
    const { title, slug } = b.departure.tour;
    let agg = byTour.get(slug);
    if (!agg) {
      agg = { title, slug, bookings: 0, seats: 0, revenue: new Map() };
      byTour.set(slug, agg);
    }
    agg.bookings += 1;
    agg.seats += b.seats;
    agg.revenue.set(b.currency, (agg.revenue.get(b.currency) ?? 0) + b.totalCents);
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
