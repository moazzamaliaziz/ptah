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
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";
import { formatAdminDate } from "@/i18n/admin/format";
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

// The order the status filter tabs appear in; labels come from the shared
// `status` dictionary so list, detail and dashboard stay in lockstep.
const FILTER_STATUSES: BookingStatus[] = [
  "PENDING_PAYMENT",
  "CONFIRMED",
  "CANCELLED",
  "REFUNDED",
  "FAILED",
];

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
  const locale = await getAdminLocale();
  const dict = getAdminDict(locale);
  const t = dict.orders;

  const methodLabel = (method: string | null, status: BookingStatus): string => {
    if (!method) {
      return status === "PENDING_PAYMENT" ? t.awaitingPayment : "—";
    }
    if (method === "bank_transfer") return t.bankTransfer;
    return method.charAt(0).toUpperCase() + method.slice(1);
  };

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
        <h1>{t.title}</h1>
        <p>
          {t.subtitle}{" "}
          {total === 0 ? t.noneYet : t.totalShowing(total, start, end)}
        </p>
      </div>

      <div
        className="admin-row admin-row--between"
        style={{ marginBottom: "1rem", alignItems: "flex-start" }}
      >
        <div className="admin-row" role="tablist" aria-label={t.filterByStatus}>
          {[{ label: t.filterAll, value: "" }, ...FILTER_STATUSES.map((s) => ({ label: dict.status[s], value: s }))].map((f) => {
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
        <BookingsSearch
          status={status}
          defaultValue={query ?? ""}
          hiddenLabel={t.searchHiddenLabel}
          placeholder={t.searchPlaceholder}
          ariaLabel={t.searchAriaLabel}
          buttonLabel={t.searchButton}
        />
      </div>
      {total === 0 ? (
        <div className="admin-card">
          <p className="admin-card__meta">{t.emptyState}</p>
        </div>
      ) : (
        <>
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t.colCustomer}</th>
                <th>{t.colTour}</th>
                <th>{t.colDeparture}</th>
                <th>{t.colSeats}</th>
                <th>{t.colTotal}</th>
                <th>{t.colMethod}</th>
                <th>{t.colStatus}</th>
                <th>{t.colBooked}</th>
                <th>{t.colActions}</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>
                    <Link href={`/admin/bookings/${b.id}`}>{b.contactName ?? t.noName}</Link>
                    <div className="admin-card__meta">{b.contactEmail ?? "—"}</div>
                  </td>
                  <td>{b.tourTitle}</td>
                  <td>{formatAdminDate(b.startDate, locale)}</td>
                  <td>{b.seats}</td>
                  <td>{formatPriceCents(b.totalCents, b.currency)}</td>
                  <td>{methodLabel(b.paymentMethod, b.status)}</td>
                  <td>
                    <span className={`admin-badge ${STATUS_BADGE[b.status]}`}>{dict.status[b.status]}</span>
                  </td>
                  <td>{formatAdminDate(b.createdAt, locale)}</td>
                  <td>
                    <div className="admin-actions">
                      <Link
                        className="admin-btn admin-btn--ghost admin-btn--sm"
                        href={`/admin/bookings/${b.id}`}
                      >
                        {t.edit}
                      </Link>
                      <a
                        className="admin-btn admin-btn--ghost admin-btn--sm"
                        href={`/en/booking/success?booking=${b.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t.viewExternal}
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <nav className="admin-pagination" aria-label={t.paginationLabel}>
            <span className="admin-card__meta">
              {t.showingRange(start, end, total)}
            </span>
            <div className="admin-row">
              {page > 1 ? (
                <Link className="admin-btn admin-btn--ghost admin-btn--sm" href={pageHref(page - 1)}>
                  {t.prev}
                </Link>
              ) : (
                <span className="admin-btn admin-btn--ghost admin-btn--sm" aria-disabled="true" data-disabled>
                  {t.prev}
                </span>
              )}
              <span className="admin-card__meta">
                {t.pageOf(page, totalPages)}
              </span>
              {page < totalPages ? (
                <Link className="admin-btn admin-btn--ghost admin-btn--sm" href={pageHref(page + 1)}>
                  {t.next}
                </Link>
              ) : (
                <span className="admin-btn admin-btn--ghost admin-btn--sm" aria-disabled="true" data-disabled>
                  {t.next}
                </span>
              )}
            </div>
          </nav>
        </>
      )}
    </>
  );
}
