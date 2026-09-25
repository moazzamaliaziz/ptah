import type { JSX } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { BookingStatus } from "@prisma/client";
import { requireCapability, can } from "@/server/auth/rbac";
import { formatPriceCents } from "@/lib/utils";
import { PAX_TYPE_LABEL } from "@/server/booking-core";
import { getBookingForAdmin, getBookingAuditTrail, type AdminAuditEntry } from "@/server/admin/orders-admin";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict, type OrdersDict, type StatusDict } from "@/i18n/admin/dictionary";
import type { AdminLocale } from "@/i18n/admin/config";
import { formatAdminDate } from "@/i18n/admin/format";
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
  FAILED: "admin-badge--danger",
};

const STATUS_OPTIONS: readonly BookingStatus[] = [
  "PENDING_PAYMENT",
  "CONFIRMED",
  "CANCELLED",
  "REFUNDED",
  "FAILED",
];

/** Date + time (medium date, short time) in the viewer's local zone. */
function fmt(d: Date, locale: AdminLocale): string {
  return formatAdminDate(d, locale, { dateStyle: "medium", timeStyle: "short" });
}
/** Calendar day only, pinned to UTC (departure/return dates are date-only). */
function fmtDate(d: Date, locale: AdminLocale): string {
  return formatAdminDate(d, locale, { dateStyle: "long", timeZone: "UTC" });
}

/** ISO-3166 alpha-2 → localized country name (built-in, no dependency); the raw
 *  code is a safe fallback if the runtime can't resolve it. Null passes through. */
function regionName(code: string | null, locale: AdminLocale): string | null {
  if (!code) return null;
  const trimmed = code.trim().toUpperCase();
  if (!trimmed) return null;
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(trimmed) ?? trimmed;
  } catch {
    return trimmed;
  }
}

/** Turn one audit row into a localized sentence for the timeline. */
function auditLabel(e: AdminAuditEntry, t: OrdersDict, statuses: StatusDict): string {
  switch (e.action) {
    case "booking.create":
      return t.auditCreated;
    case "booking.confirm":
      if (e.via === "admin.bank_transfer") return t.auditConfirmedBankTransfer;
      if (e.via === "stripe.webhook") return t.auditConfirmedCard;
      if (e.via === "paypal") return t.auditConfirmedPaypal;
      return t.auditConfirmed;
    case "booking.fail":
      return t.auditFailed;
    case "booking.cancel":
      return t.auditCancelled;
    case "booking.refund":
      return t.auditRefunded;
    case "booking.status.override": {
      const from = e.from ? (statuses[e.from as BookingStatus] ?? e.from) : null;
      const to = e.to ? (statuses[e.to as BookingStatus] ?? e.to) : null;
      if (from && to) return t.auditStatusChanged(from, to);
      return t.auditStatusChangedPlain;
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
  const locale = await getAdminLocale();
  const dict = getAdminDict(locale);
  const t = dict.orders;
  const { id } = await params;
  const { msg, err } = await searchParams;
  const booking = await getBookingForAdmin(id);
  if (!booking) notFound();

  const history = await getBookingAuditTrail(booking.id);
  const editor = can(user, "bookings.edit");
  const originName = regionName(booking.originCountry, locale);

  const methodLabel = (method: string): string => {
    if (method === "bank_transfer") return t.bankTransfer;
    return method.charAt(0).toUpperCase() + method.slice(1);
  };

  return (
    <>
      <div className="admin-head">
        <p style={{ margin: 0 }}>
          <Link href="/admin/bookings">{t.backToOrders}</Link>
        </p>
        <h1>{booking.tourTitle}</h1>
        <p>
          {t.reference} <code>{booking.id}</code> ·{" "}
          <span className={`admin-badge ${STATUS_BADGE[booking.status]}`}>{dict.status[booking.status]}</span>
        </p>
        <p style={{ marginTop: "0.5rem" }}>
          <a
            className="admin-btn admin-btn--ghost"
            href={`/admin/bookings/${booking.id}/invoice`}
            style={{ display: "inline-block", textDecoration: "none" }}
          >
            {t.downloadInvoice}
          </a>
        </p>
      </div>

      {msg && t.okMessages[msg] ? <div className="admin-alert admin-alert--ok">{t.okMessages[msg]}</div> : null}
      {err ? (
        <div className="admin-alert admin-alert--error">{t.errMessages[err] ?? t.actionFailed}</div>
      ) : null}

      <div className="admin-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
        <div className="admin-card">
          <h2>{t.tripHeading}</h2>
          <table className="admin-table">
            <tbody>
              <tr><th scope="row">{t.tripTour}</th><td>{booking.tourTitle}</td></tr>
              <tr><th scope="row">{t.tripDeparture}</th><td>{fmtDate(booking.startDate, locale)}</td></tr>
              <tr><th scope="row">{t.tripReturns}</th><td>{fmtDate(booking.endDate, locale)}</td></tr>
              <tr><th scope="row">{t.tripTravelers}</th><td>{booking.seats}</td></tr>
              {booking.pricing
                ? booking.pricing.items.map((line) => (
                    <tr key={line.type}>
                      <th scope="row">{PAX_TYPE_LABEL[line.type]}</th>
                      <td>{`${line.count} × ${formatPriceCents(line.unitCents, booking.currency)}`}</td>
                    </tr>
                  ))
                : null}
              {booking.discountCents > 0 ? (
                <tr>
                  <th scope="row">{t.discount}{booking.couponCode ? t.discountWithCode(booking.couponCode) : ""}</th>
                  <td>{`−${formatPriceCents(booking.discountCents, booking.currency)}`}</td>
                </tr>
              ) : null}
              <tr><th scope="row">{t.tripTotal}</th><td>{formatPriceCents(booking.totalCents, booking.currency)}</td></tr>
            </tbody>
          </table>
        </div>

        <div className="admin-card">
          <h2>{t.customerHeading}</h2>
          <table className="admin-table">
            <tbody>
              <tr><th scope="row">{t.custName}</th><td>{booking.contactName ?? "—"}</td></tr>
              <tr><th scope="row">{t.custEmail}</th><td>{booking.contactEmail ?? "—"}</td></tr>
              <tr><th scope="row">{t.custPhone}</th><td>{booking.contactPhone ?? "—"}</td></tr>
              <tr><th scope="row">{t.custAccount}</th><td>{booking.isGuest ? t.guestCheckout : t.registeredUser}</td></tr>
              {originName ? <tr><th scope="row">{t.bookedFrom}</th><td>{originName}</td></tr> : null}
              <tr><th scope="row">{t.bookedAt}</th><td>{fmt(booking.createdAt, locale)}</td></tr>
            </tbody>
          </table>
          {booking.contactNotes ? (
            <p className="admin-card__meta" style={{ marginTop: "0.75rem", whiteSpace: "pre-line" }}>
              <strong>{t.notes}</strong> {booking.contactNotes}
            </p>
          ) : null}
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: "1rem" }}>
        <h2>{t.paymentsHeading}</h2>
        {booking.payments.length === 0 ? (
          <p className="admin-card__meta">{t.noPayments}</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr><th scope="col">{t.payColMethod}</th><th scope="col">{t.payColStatus}</th><th scope="col">{t.payColAmount}</th><th scope="col">{t.payColGatewayRef}</th><th scope="col">{t.payColWhen}</th></tr>
            </thead>
            <tbody>
              {booking.payments.map((p) => (
                <tr key={p.id}>
                  <td>{methodLabel(p.method)}</td>
                  <td>{p.status}</td>
                  <td>{formatPriceCents(p.amountCents, p.currency)}</td>
                  <td><code className="admin-card__meta">{p.intentId ?? p.sessionId ?? p.reference ?? "—"}</code></td>
                  <td>{fmt(p.createdAt, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="admin-card" style={{ marginTop: "1rem" }}>
        <h2>{t.historyHeading}</h2>
        {history.length === 0 ? (
          <p className="admin-card__meta">{t.noHistory}</p>
        ) : (
          <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {history.map((e) => (
              <li
                key={e.id}
                style={{
                  paddingInlineStart: "0.9rem",
                  borderInlineStart: "2px solid var(--color-border, #d8d2c0)",
                  paddingBottom: "0.85rem",
                }}
              >
                <div style={{ fontWeight: 600 }}>{auditLabel(e, t, dict.status)}</div>
                <div className="admin-card__meta">
                  {fmt(e.createdAt, locale)} · {e.actorName ?? t.systemActor}
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>

      {editor && (booking.canRefund || booking.canCancel || booking.canMarkPaid) ? (
        <div className="admin-card" style={{ marginTop: "1rem" }}>
          <h2>{t.actionsHeading}</h2>
          <div className="admin-row" style={{ marginTop: "0.5rem" }}>
            {booking.canMarkPaid ? (
              <form
                action={markBankTransferPaidAction}
                style={{ display: "flex", flexDirection: "column", gap: "0.5rem", minWidth: "240px" }}
              >
                <input type="hidden" name="id" value={booking.id} />
                <label className="admin-field" style={{ margin: 0 }}>
                  <span>{t.paymentReferenceLabel}</span>
                  <input
                    type="text"
                    name="reference"
                    className="admin-input"
                    placeholder={t.paymentReferencePlaceholder}
                    maxLength={200}
                    autoComplete="off"
                  />
                </label>
                <ConfirmSubmitButton
                  className="admin-btn"
                  confirm={t.markPaidConfirm}
                  pendingLabel={t.markPaidPending}
                >
                  {t.markPaid}
                </ConfirmSubmitButton>
              </form>
            ) : null}
            {booking.canCancel ? (
              <form action={cancelBookingAction}>
                <input type="hidden" name="id" value={booking.id} />
                <ConfirmSubmitButton
                  className="admin-btn admin-btn--danger"
                  confirm={t.cancelConfirm}
                  pendingLabel={t.cancelPending}
                >
                  {t.cancelRelease}
                </ConfirmSubmitButton>
              </form>
            ) : null}
            {booking.canRefund ? (
              <form action={refundBookingAction}>
                <input type="hidden" name="id" value={booking.id} />
                <ConfirmSubmitButton
                  className="admin-btn admin-btn--danger"
                  confirm={t.refundConfirm}
                  pendingLabel={t.refundPending}
                >
                  {t.refundInFull}
                </ConfirmSubmitButton>
              </form>
            ) : null}
          </div>
        </div>
      ) : null}

      {editor ? (
        <div className="admin-card" style={{ marginTop: "1rem" }}>
          <h2>{t.setStatusHeading}</h2>
          <p className="admin-card__meta" style={{ marginTop: "0.35rem" }}>
            {t.setStatusHelp}
          </p>
          <form action={setBookingStatusAction} className="admin-row" style={{ marginTop: "0.75rem", alignItems: "flex-end" }}>
            <input type="hidden" name="id" value={booking.id} />
            <label className="admin-field" style={{ margin: 0 }}>
              <span>{t.statusLabel}</span>
              <select name="status" defaultValue={booking.status} className="admin-input">
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {dict.status[s]}
                  </option>
                ))}
              </select>
            </label>
            <ConfirmSubmitButton
              className="admin-btn"
              confirm={t.applyStatusConfirm}
              pendingLabel={t.applyStatusPending}
            >
              {t.applyStatus}
            </ConfirmSubmitButton>
          </form>
        </div>
      ) : null}
    </>
  );
}
