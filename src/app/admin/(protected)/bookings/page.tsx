import type { JSX } from "react";
import Link from "next/link";
import type { BookingStatus } from "@prisma/client";
import { requireCapability } from "@/server/auth/rbac";
import { formatPriceCents } from "@/lib/utils";
import { listBookingsForAdmin, parseBookingStatus } from "@/server/admin/orders-admin";

export const dynamic = "force-dynamic";

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
    // No Payment row exists yet. For a still-open order this means the guest
    // reserved seats but has not begun a payment method; label it plainly
    // instead of a bare "—" so staff can tell it apart from missing data.
    return status === "PENDING_PAYMENT" ? "Awaiting payment" : "—";
  }
  if (method === "bank_transfer") return "Bank transfer";
  return method.charAt(0).toUpperCase() + method.slice(1);
}

/**
 * /admin/bookings — every order across all payment methods. View gated by
 * bookings.view (all staff); refund/cancel are bookings.edit (enforced in
 * actions + on the detail page).
 */
export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}): Promise<JSX.Element> {
  await requireCapability("bookings.view");
  const { status: rawStatus, q } = await searchParams;
  const status = parseBookingStatus(rawStatus);
  const bookings = await listBookingsForAdmin({ status, q });

  const qs = (value: string) => {
    const params = new URLSearchParams();
    if (value) params.set("status", value);
    if (q) params.set("q", q);
    const s = params.toString();
    return s ? `/admin/bookings?${s}` : "/admin/bookings";
  };

  return (
    <>
      <div className="admin-head">
        <h1>Orders</h1>
        <p>Every booking and its payment status. {bookings.length} shown.</p>
      </div>

      <div className="admin-row admin-row--between" style={{ marginBottom: "1rem" }}>
        <div className="admin-row" role="tablist" aria-label="Filter by status">
          {FILTERS.map((f) => {
            const active = (rawStatus ?? "") === f.value || (!rawStatus && f.value === "");
            return (
              <Link
                key={f.value}
                href={qs(f.value)}
                className={`admin-btn ${active ? "" : "admin-btn--ghost"}`}
                aria-current={active ? "true" : undefined}
              >
                {f.label}
              </Link>
            );
          })}
        </div>
        <form method="get" className="admin-row">
          {status ? <input type="hidden" name="status" value={status} /> : null}
          <input
            className="admin-input"
            type="search"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search reference or email"
            style={{ width: "16rem" }}
          />
          <button className="admin-btn admin-btn--ghost" type="submit">Search</button>
        </form>
      </div>

      {bookings.length === 0 ? (
        <div className="admin-card">
          <p className="admin-card__meta">No bookings match. Orders appear here as customers book.</p>
        </div>
      ) : (
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
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}
