import type { JSX } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { BookingStatus } from "@prisma/client";
import { requireCapability, can } from "@/server/auth/rbac";
import { formatPriceCents } from "@/lib/utils";
import { PAX_TYPE_LABEL } from "@/server/booking-core";
import { getBookingForAdmin, getBookingAuditTrail, type AdminAuditEntry } from "@/server/admin/orders-admin";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import {
  refundBookingAction,
  cancelBookingAction,
  markBankTransferPaidAction,
  setBookingStatusAction,
} from "../actions";

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

const STATUS_OPTIONS: readonly BookingStatus[] = [
  "PENDING_PAYMENT",
  "CONFIRMED",
  "CANCELLED",
  "REFUNDED",
  "FAILED",
];

const OK_MESSAGES: Record<string, string> = {
  refunded: "Booking refunded and seats released.",
  cancelled: "Booking cancelled and seats released.",
  paid: "Payment recorded — booking confirmed and the customer emailed.",
  status: "Booking status updated.",
};

const ERR_MESSAGES: Record<string, string> = {
  NOT_FOUND: "Booking not found.",
  NOT_REFUNDABLE: "That action is not allowed for this booking's current status.",
  NO_PAYMENT: "No matching payment was found to act on.",
  GATEWAY_UNAVAILABLE: "The payment gateway is not configured.",
  GATEWAY_ERROR: "The payment gateway refused the request — check its dashboard.",
  SEATS_UNAVAILABLE: "Not enough seats remain on this departure to re-activate the booking.",
  STALE: "The booking changed status just now — reload and try again.",
  INVALID_STATUS: "That is not a valid booking status.",
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

/** ISO-3166 alpha-2 → English country name (built-in, no dependency); the raw
 *  code is a safe fallback if the runtime can't resolve it. Null passes through. */
function regionName(code: string | null): string | null {
  if (!code) return null;
  const trimmed = code.trim().toUpperCase();
  if (!trimmed) return null;
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(trimmed) ?? trimmed;
  } catch {
    return trimmed;
  }
}

const STATUS_WORD: Record<string, string> = {
  PENDING_PAYMENT: "Pending",
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  REFUNDED: "Refunded",
  FAILED: "Failed",
};

/** Turn one audit row into a plain-English sentence for the timeline. */
function auditLabel(e: AdminAuditEntry): string {
  switch (e.action) {
    case "booking.create":
      return "Booking created";
    case "booking.confirm":
      if (e.via === "admin.bank_transfer") return "Payment confirmed (bank transfer)";
      if (e.via === "stripe.webhook") return "Payment confirmed (card / Stripe)";
      if (e.via === "paypal") return "Payment confirmed (PayPal)";
      return "Payment confirmed";
    case "booking.fail":
      return "Payment failed";
    case "booking.cancel":
      return "Booking cancelled — seats released";
    case "booking.refund":
      return "Booking refunded — seats released";
    case "booking.status.override": {
      const from = e.from ? (STATUS_WORD[e.from] ?? e.from) : null;
      const to = e.to ? (STATUS_WORD[e.to] ?? e.to) : null;
      if (from && to) return `Status changed manually: ${from} → ${to}`;
      return "Status changed manually";
    }
    default:
      return e.action;
  }
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

  const history = await getBookingAuditTrail(booking.id);
  const editor = can(user, "bookings.edit");
  const originName = regionName(booking.originCountry);

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
        <p style={{ marginTop: "0.5rem" }}>
          <a
            className="admin-btn admin-btn--ghost"
            href={`/admin/bookings/${booking.id}/invoice`}
            style={{ display: "inline-block", textDecoration: "none" }}
          >
            Download invoice (PDF)
          </a>
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
              {booking.pricing
                ? booking.pricing.items.map((line) => (
                    <tr key={line.type}>
                      <th>{PAX_TYPE_LABEL[line.type]}</th>
                      <td>{`${line.count} × ${formatPriceCents(line.unitCents, booking.currency)}`}</td>
                    </tr>
                  ))
                : null}
              {booking.discountCents > 0 ? (
                <tr>
                  <th>Discount{booking.couponCode ? ` (${booking.couponCode})` : ""}</th>
                  <td>{`−${formatPriceCents(booking.discountCents, booking.currency)}`}</td>
                </tr>
              ) : null}
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
              {originName ? <tr><th>Booked from</th><td>{originName}</td></tr> : null}
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
                  <td><code className="admin-card__meta">{p.intentId ?? p.sessionId ?? p.reference ?? "—"}</code></td>
                  <td>{fmt(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-card" style={{ marginTop: "1rem" }}>
        <h2>History</h2>
        {history.length === 0 ? (
          <p className="admin-card__meta">No history recorded yet.</p>
        ) : (
          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {history.map((e) => (
              <li
                key={e.id}
                style={{
                  paddingLeft: "0.9rem",
                  borderLeft: "2px solid var(--color-border, #d8d2c0)",
                  paddingBottom: "0.85rem",
                }}
              >
                <div style={{ fontWeight: 600 }}>{auditLabel(e)}</div>
                <div className="admin-card__meta">
                  {fmt(e.createdAt)} · {e.actorName ?? "System"}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      {editor && (booking.canRefund || booking.canCancel || booking.canMarkPaid) ? (
        <div className="admin-card" style={{ marginTop: "1rem" }}>
          <h2>Actions</h2>
          <div className="admin-row" style={{ marginTop: "0.5rem" }}>
            {booking.canMarkPaid ? (
              <form
                action={markBankTransferPaidAction}
                style={{ display: "flex", flexDirection: "column", gap: "0.5rem", minWidth: "240px" }}
              >
                <input type="hidden" name="id" value={booking.id} />
                <label className="admin-field" style={{ margin: 0 }}>
                  <span>Payment reference (optional)</span>
                  <input
                    type="text"
                    name="reference"
                    className="admin-input"
                    placeholder="e.g. bank transfer confirmation code"
                    maxLength={200}
                    autoComplete="off"
                  />
                </label>
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

      {editor ? (
        <div className="admin-card" style={{ marginTop: "1rem" }}>
          <h2>Set status manually</h2>
          <p className="admin-card__meta" style={{ marginTop: "0.35rem" }}>
            Corrects the record and its seat count only. This does <strong>not</strong> refund or
            charge a card and does <strong>not</strong> email the customer — use the buttons above
            for those. Reactivating a cancelled/refunded booking re-claims seats and is refused if
            the departure is full.
          </p>
          <form action={setBookingStatusAction} className="admin-row" style={{ marginTop: "0.75rem", alignItems: "flex-end" }}>
            <input type="hidden" name="id" value={booking.id} />
            <label className="admin-field" style={{ margin: 0 }}>
              <span>Status</span>
              <select name="status" defaultValue={booking.status} className="admin-input">
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </label>
            <ConfirmSubmitButton
              className="admin-btn"
              confirm="Change this booking's status? This only corrects the record and its seat count — no refund, charge, or email is sent."
              pendingLabel="Saving…"
            >
              Apply status
            </ConfirmSubmitButton>
          </form>
        </div>
      ) : null}
    </>
  );
}
