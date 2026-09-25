import type { BookingStatus } from "@prisma/client";
import { requireCapability } from "@/server/auth/rbac";
import {
  parseReportRange,
  getMoneyReport,
  getTopTours,
  getBookingsByCountry,
} from "@/server/admin/reports";

/**
 * Staff-only CSV export of the reports page (Wave 3). Same period + same
 * aggregations the page renders, minus GA4 (that panel is best-effort visitor
 * analytics, not part of the money/booking record). Gated by reports.view —
 * route handlers get no layout, so the capability guard is repeated here.
 *
 * Money follows the module rule: every amount stays with its own currency in a
 * dedicated column and is never summed across currencies. Amounts are written
 * as major-unit decimals (cents / 100, 2 dp — every currency the shop takes,
 * EGP and USD, has 2 minor digits) so spreadsheets read them as numbers.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING_PAYMENT: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
  FAILED: "Failed",
};

/**
 * Escape one CSV cell. Two jobs:
 *  1. Formula-injection safety — a value starting with = + - @ (or a control
 *     char) can be run as a formula by Excel/Sheets; prefix it with a quote.
 *  2. RFC-4180 quoting — wrap in double quotes and double any embedded quotes
 *     when the value contains a comma, quote, or newline.
 */
function csvCell(value: string | number): string {
  let s = String(value ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  if (/[",\n\r]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** cents → "1234.00" major-unit string (2 dp; not currency-formatted). */
function amount(cents: number): string {
  return (cents / 100).toFixed(2);
}

function row(cells: (string | number)[]): string {
  return cells.map(csvCell).join(",");
}

export async function GET(req: Request): Promise<Response> {
  await requireCapability("reports.view");

  const url = new URL(req.url);
  const range = parseReportRange(url.searchParams.get("range") ?? undefined);

  const [money, topTours, byCountry] = await Promise.all([
    getMoneyReport(range.since),
    getTopTours(range.since),
    getBookingsByCountry(range.since),
  ]);

  const lines: string[] = [];
  lines.push(row(["Ptah Tours — Reports export"]));
  lines.push(row(["Period", range.label]));
  lines.push(row(["Generated", new Date().toISOString()]));
  lines.push("");

  lines.push(row(["Revenue (confirmed) — per currency"]));
  lines.push(row(["Currency", "Confirmed bookings", "Net", "Discount", "Gross"]));
  if (money.revenue.length === 0) {
    lines.push(row(["No confirmed revenue in this period"]));
  } else {
    for (const r of money.revenue) {
      lines.push(
        row([r.currency, r.confirmedBookings, amount(r.netCents), amount(r.discountCents), amount(r.grossCents)]),
      );
    }
  }
  lines.push("");

  lines.push(row(["Refunds — per currency"]));
  lines.push(row(["Currency", "Refunded bookings", "Amount refunded"]));
  if (money.refunds.length === 0) {
    lines.push(row(["No refunds in this period"]));
  } else {
    for (const r of money.refunds) {
      lines.push(row([r.currency, r.refundedBookings, amount(r.netCents)]));
    }
  }
  lines.push("");

  lines.push(row(["Bookings by status"]));
  lines.push(row(["Status", "Bookings"]));
  let total = 0;
  for (const s of money.statusCounts) {
    total += s.count;
    lines.push(row([STATUS_LABEL[s.status], s.count]));
  }
  lines.push(row(["Total", total]));
  lines.push("");

  lines.push(row(["Top tours (confirmed)"]));
  lines.push(row(["Tour", "Bookings", "Seats", "Revenue (per currency)"]));
  if (topTours.length === 0) {
    lines.push(row(["No confirmed tour bookings in this period"]));
  } else {
    for (const t of topTours) {
      const rev = t.revenue.map((r) => `${r.currency} ${amount(r.netCents)}`).join(" · ") || "—";
      lines.push(row([t.tourTitle, t.confirmedBookings, t.seats, rev]));
    }
  }
  lines.push("");

  lines.push(row(["Bookings by country"]));
  lines.push(row(["Country", "Bookings"]));
  if (byCountry.length === 0) {
    lines.push(row(["No confirmed bookings in this period"]));
  } else {
    for (const c of byCountry) {
      lines.push(row([c.name, c.count]));
    }
  }

  // Prepend a UTF-8 BOM so Excel opens accented country names correctly.
  const csv = "﻿" + lines.join("\r\n") + "\r\n";
  const filename = `ptah-reports-${range.key}.csv`;
  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
