import type { JSX } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { BookingStatus } from "@prisma/client";
import { requireCapability, can } from "@/server/auth/rbac";
import { formatPriceCents } from "@/lib/utils";
import { getBookingForAdmin } from "@/server/admin/orders-admin";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import { refundBookingAction, cancelBookingAction, markBankTransferPaidAction } from "../actions";

export const dynamic = "force-dynamic";

const STATUS_BADGE: Record<BookingStatus, string> = {
  PENDING_PAYMENT: "admin-badge--gold",
  CONFIRMED: "admin-badge--on",
  CANCELLED: "admin-badge--off",
  REFUNDED: "admin-badge--off",
  FAILED: "admin-badge--off",
};

const OK_MESSAGES: Record<string, string> = {
  refunded: "Booking refunded and seats released.",
  cancelled: "Booking cancelled and seats released.",
  paid: "Payment recorded — booking confirmed and the customer emailed.",
};

const ERR_MESSAGES: Record<string, string> = {
  NOT_FOUND: "Booking not found.",
  NOT_REFUNDABLE: "That action is not allowed for this booking's current status.",
  NO_PAYMENT: "No matching payment was found to act on.",
  GATEWAY_UNAVAILABLE: "The payment gateway is not configured.",
  GATEWAY_ERROR: "The payment gateway refused the request — check its dashboard.",
};

function fmt(d: Date): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(d);
}
function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(d);
}
function methodLabel(method: string): string {
  if (method === "bank_transfer") return "Bank transfer";
  return method.charAt(0).toUpperCase() + method.slice(1);
}

export default async function AdminBookingDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ msg?: string; err?: string }>;
}): Promise<JSX.Element> {
  const user = await requireCapability("bookings.view");
  const { id } = await params;
  const { msg, err } = await searchParams;
  const booking = await getBookingForAdmin(id);
  if (!booking) notFound();

  const editor = can(user, "bookings.edit");

  return (
    <>
      <div className="admin-head">
        <p style={{ margin: 0 }}>
          <Link href="/admin/bookings">← Orders</Link>
        </p>
        <h1>{booking.tourTitle}</h1>
        <p>
          Reference <code>{booking.id}</code> ·{" "}
          <span className={`admin-badge ${STATUS_BADGE[booking.status]}`}>{booking.status}</span>
        </p>
      </div>

      {msg && OK_MESSAGES[msg] ? <div className="admin-alert admin-alert--ok">{OK_MESSAGES[msg]}</div> : null}
      {err ? (
        <div className="admin-alert admin-alert--error">{ERR_MESSAGES[err] ?? "Action failed."}</div>
      ) : null}

      <div className="admin-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        <div className="admin-card">
          <h2>Trip</h2>
          <table className="admin-table">
            <tbody>
              <tr><th>Tour</th><td>{booking.tourTitle}</td></tr>
              <tr><th>Departure</th><td>{fmtDate(booking.startDate)}</td></tr>
              <tr><th>Returns</th><td>{fmtDate(booking.endDate)}</td></tr>
              <tr><th>Travelers</th><td>{booking.seats}</td></tr>
              <tr><th>Total</th><td>{formatPriceCents(booking.totalCents, booking.currency)}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="admin-card">
          <h2>Customer</h2>
          <table className="admin-table">
            <tbody>
              <tr><th>Name</th><td>{booking.contactName ?? "—"}</td></tr>
              <tr><th>Email</th><td>{booking.contactEmail ?? "—"}</td></tr>
              <tr><th>Phone</th><td>{booking.contactPhone ?? "—"}</td></tr>
              <tr><th>Account</th><td>{booking.isGuest ? "Guest checkout" : "Registered user"}</td></tr>
              <tr><th>Booked</th><td>{fmt(booking.createdAt)}</td></tr>
            </tbody>
          </table>
          {booking.contactNotes ? (
            <p className="admin-card__meta" style={{ marginTop: "0.75rem", whiteSpace: "pre-line" }}>
              <strong>Notes:</strong> {booking.contactNotes}
            </p>
          ) : null}
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: "1rem" }}>
        <h2>Payments</h2>
        {booking.payments.length === 0 ? (
          <p className="admin-card__meta">No payment attempts recorded.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th>Method</th><th>Status</th><th>Amount</th><th>Gateway ref</th><th>When</th></tr>
            </thead>
            <tbody>
              {booking.payments.map((p) => (
                <tr key={p.id}>
                  <td>{methodLabel(p.method)}</td>
                  <td>{p.status}</td>
                  <td>{formatPriceCents(p.amountCents, p.currency)}</td>
                  <td><code className="admin-card__meta">{p.intentId ?? p.sessionId ?? "—"}</code></td>
                  <td>{fmt(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editor && (booking.canRefund || booking.canCancel || booking.canMarkPaid) ? (
        <div className="admin-card" style={{ marginTop: "1rem" }}>
          <h2>Actions</h2>
          <div className="admin-row" style={{ marginTop: "0.5rem" }}>
            {booking.canMarkPaid ? (
              <form action={markBankTransferPaidAction}>
                <input type="hidden" name="id" value={booking.id} />
                <ConfirmSubmitButton
                  className="admin-btn"
                  confirm="Confirm you have received the bank transfer for this booking? The customer will be emailed a confirmation."
                  pendingLabel="Confirming…"
                >
                  Mark as paid
                </ConfirmSubmitButton>
              </form>
            ) : null}
            {booking.canCancel ? (
              <form action={cancelBookingAction}>
                <input type="hidden" name="id" value={booking.id} />
                <ConfirmSubmitButton
                  className="admin-btn admin-btn--danger"
                  confirm="Cancel this pending booking and release its seats? This cannot be undone."
                  pendingLabel="Cancelling…"
                >
                  Cancel &amp; release
                </ConfirmSubmitButton>
              </form>
            ) : null}
            {booking.canRefund ? (
              <form action={refundBookingAction}>
                <input type="hidden" name="id" value={booking.id} />
                <ConfirmSubmitButton
                  className="admin-btn admin-btn--danger"
                  confirm="Refund this booking in full and release its seats? The refund is sent through the original payment method."
                  pendingLabel="Refunding…"
                >
                  Refund in full
                </ConfirmSubmitButton>
              </form>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
