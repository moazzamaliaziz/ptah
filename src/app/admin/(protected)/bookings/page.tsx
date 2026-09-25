import type { JSX } from "react";
import Link from "next/link";
import type { BookingStatus } from "@prisma/client";
import { requireCapability } from "@/server/auth/rbac";
import { formatPriceCents } from "@/lib/utils";
import {
  listBookingsForAdmin,
  countBookingsForAdmin,
  parseBookingStatus,
} from "@/server/admin/orders-admin";
import BookingsSearch from "./BookingsSearch";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

const STATUS_BADGE: Record<BookingStatus, string> = {
  PENDING_PAYMENT: "admin-badge--gold",
  CONFIRMED: "admin-badge--on",
  CANCELLED: "admin-badge--off",
  REFUNDED: "admin-badge--off",
  FAILED: "admin-badge--off",
};

const STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING_PAYMENT: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
  FAILED: "Failed",
};

const FILTERS: { label: string; value: string }[] = [
  { label: "All", value: "" },
  { label: "Pending", value: "PENDING_PAYMENT" },
  { label: "Confirmed", value: "CONFIRMED" },
  { label: "Cancelled", value: "CANCELLED" },
  { label: "Refunded", value: "REFUNDED" },
  { label: "Failed", value: "FAILED" },
];
function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(d);
}

function methodLabel(method: string | null, status: BookingStatus): string {
  if (!method) {
    return status === "PENDING_PAYMENT" ? "Awaiting payment" : "—";
  }
  if (method === "bank_transfer") return "Bank transfer";
  return method.charAt(0).toUpperCase() + method.slice(1);
}

/**
 * /admin/bookings — every order across all payment methods. View gated by
 * bookings.view (all staff); refund/cancel are bookings.edit (enforced in
 * actions + on the detail page). Server-side paginated (25/page).
 */
export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; page?: string }>;
}): Promise<JSX.Element> {
  await requireCapability("bookings.view");
  const { status: rawStatus, q, page: rawPage } = await searchParams;
  const status = parseBookingStatus(rawStatus);
  const query = q?.trim() || undefined;

  const total = await countBookingsForAdmin({ status, q: query });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number.parseInt(rawPage ?? "1", 10) || 1), totalPages);
  const bookings = await listBookingsForAdmin({
    status,
    q: query,
    take: PAGE_SIZE,
    skip: (page - 1) * PAGE_SIZE,
  });

  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);
  const filterHref = (value: string) => {
    const params = new URLSearchParams();
    if (value) params.set("status", value);
    if (query) params.set("q", query);
    const s = params.toString();
    return s ? `/admin/bookings?${s}` : "/admin/bookings";
  };
  const pageHref = (p: number) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (query) params.set("q", query);
    if (p > 1) params.set("page", String(p));
    const s = params.toString();
    return s ? `/admin/bookings?${s}` : "/admin/bookings";
  };

  return (
    <>
      <div className="admin-head">
        <h1>Orders</h1>
        <p>
          Every booking and its payment status.{" "}
          {total === 0 ? "None yet." : `${total} total — showing ${start}–${end}.`}
        </p>
      </div>

      <div
        className="admin-row admin-row--between"
        style={{ marginBottom: "1rem", alignItems: "flex-start" }}
      >
        <div className="admin-row" role="tablist" aria-label="Filter by status">
          {FILTERS.map((f) => {
            const active = (status ?? "") === f.value;
            return (
              <Link
                key={f.value}
                href={filterHref(f.value)}
                className={`admin-btn ${active ? "" : "admin-btn--ghost"}`}
                aria-current={active ? "true" : undefined}
              >
                {f.label}
              </Link>
            );
          })}
        </div>
        <BookingsSearch status={status} defaultValue={query ?? ""} />
      </div>
      {total === 0 ? (
        <div className="admin-card">
          <p className="admin-card__meta">No bookings match. Orders appear here as customers book.</p>
        </div>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Tour</th>
                <th>Departure</th>
                <th>Seats</th>
                <th>Total</th>
                <th>Method</th>
                <th>Status</th>
                <th>Booked</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <Link href={`/admin/bookings/${b.id}`}>{b.contactName ?? "(no name)"}</Link>
                    <div className="admin-card__meta">{b.contactEmail ?? "—"}</div>
                  </td>
                  <td>{b.tourTitle}</td>
                  <td>{formatDate(b.startDate)}</td>
                  <td>{b.seats}</td>
                  <td>{formatPriceCents(b.totalCents, b.currency)}</td>
                  <td>{methodLabel(b.paymentMethod, b.status)}</td>
                  <td>
                    <span className={`admin-badge ${STATUS_BADGE[b.status]}`}>{STATUS_LABEL[b.status]}</span>
                  </td>
                  <td>{formatDate(b.createdAt)}</td>
                  <td>
                    <div className="admin-actions">
                      <Link
                        className="admin-btn admin-btn--ghost admin-btn--sm"
                        href={`/admin/bookings/${b.id}`}
                      >
                        Edit
                      </Link>
                      <a
                        className="admin-btn admin-btn--ghost admin-btn--sm"
                        href={`/en/booking/success?booking=${b.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View ↗
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav className="admin-pagination" aria-label="Orders pagination">
            <span className="admin-card__meta">
              Showing {start}–{end} of {total}
            </span>
            <div className="admin-row">
              {page > 1 ? (
                <Link className="admin-btn admin-btn--ghost admin-btn--sm" href={pageHref(page - 1)}>
                  ← Prev
                </Link>
              ) : (
                <span className="admin-btn admin-btn--ghost admin-btn--sm" aria-disabled="true" data-disabled>
                  ← Prev
                </span>
              )}
              <span className="admin-card__meta">
                Page {page} of {totalPages}
              </span>
              {page < totalPages ? (
                <Link className="admin-btn admin-btn--ghost admin-btn--sm" href={pageHref(page + 1)}>
                  Next →
                </Link>
              ) : (
                <span className="admin-btn admin-btn--ghost admin-btn--sm" aria-disabled="true" data-disabled>
                  Next →
                </span>
              )}
            </div>
          </nav>
        </>
      )}
    </>
  );
}
