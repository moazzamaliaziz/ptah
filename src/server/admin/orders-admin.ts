/**
 * Admin orders (bookings) read + refund orchestration (Wave 2, SP1).
 *
 * server-only. Staff read every booking here (unlike src/server/booking-read.ts,
 * which is owner-scoped and masks PII for the public outcome pages — staff are
 * trusted and see full contact details). Mutations are thin: they dispatch the
 * gateway-side refund by payment method, then delegate the exactly-once DB
 * transition to the idempotent primitives in src/server/booking.ts.
 *
 * Refund coexistence with the webhook (design "Approach B"): the admin refund
 * calls the gateway AND runs the DB transition immediately for instant feedback;
 * the later provider webhook (`charge.refunded` / PayPal `PAYMENT.CAPTURE.REFUNDED`)
 * calls the same status-guarded `refundBooking`, which is then a no-op.
 */
import "server-only";
import type { BookingStatus, Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { getStripe } from "@/lib/stripe";
import { refundCapture } from "@/server/payments/paypal";
import { cancelAndReleaseBooking } from "@/server/booking";
import { parsePriceBreakdown, type PriceBreakdown } from "@/server/booking-core";
import { writeAudit } from "@/server/audit";

const ALL_STATUSES: readonly BookingStatus[] = [
  "PENDING_PAYMENT",
  "CONFIRMED",
  "CANCELLED",
  "REFUNDED",
  "FAILED",
];

/** Narrow an untrusted string to a BookingStatus, or undefined (= all). */
export function parseBookingStatus(value: string | undefined): BookingStatus | undefined {
  return value && (ALL_STATUSES as readonly string[]).includes(value)
    ? (value as BookingStatus)
    : undefined;
}

function contactField(
  contactInfo: unknown,
  key: "fullName" | "email" | "phone" | "notes",
): string | null {
  if (contactInfo && typeof contactInfo === "object" && key in contactInfo) {
    const v = (contactInfo as Record<string, unknown>)[key];
    return typeof v === "string" && v.length > 0 ? v : null;
  }
  return null;
}

/** Billing address captured at checkout, read out of the contactInfo JSON. */
export interface AdminBillingAddress {
  line1: string;
  line2: string | null;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

function billingFrom(contactInfo: unknown): AdminBillingAddress | null {
  if (!contactInfo || typeof contactInfo !== "object" || !("billing" in contactInfo)) return null;
  const b = (contactInfo as Record<string, unknown>).billing;
  if (!b || typeof b !== "object") return null;
  const rec = b as Record<string, unknown>;
  const s = (k: string): string => (typeof rec[k] === "string" ? (rec[k] as string) : "");
  const line1 = s("line1");
  if (!line1) return null; // nothing usable without at least a first line
  const line2 = s("line2");
  return {
    line1,
    line2: line2 || null,
    city: s("city"),
    region: s("region"),
    postalCode: s("postalCode"),
    country: s("country"),
  };
}

/**
 * A manually-entered payment reference (e.g. a bank-transfer confirmation code)
 * lives in the Payment.raw JSON — there is no dedicated column and offline
 * methods have no gateway id. See confirmBankTransferBooking in booking.ts.
 */
function paymentReference(raw: unknown): string | null {
  if (raw && typeof raw === "object" && "reference" in raw) {
    const v = (raw as Record<string, unknown>).reference;
    return typeof v === "string" && v.length > 0 ? v : null;
  }
  return null;
}

export interface AdminBookingListItem {
  id: string;
  status: BookingStatus;
  seats: number;
  totalCents: number;
  currency: string;
  createdAt: Date;
  tourTitle: string;
  tourSlug: string;
  startDate: Date;
  contactName: string | null;
  contactEmail: string | null;
  /** Method + status of the most relevant payment (succeeded, else latest). */
  paymentMethod: string | null;
  paymentStatus: string | null;
}

export interface ListBookingsFilter {
  status?: BookingStatus;
  /** Free-text match against booking id (reference) or guest email. */
  q?: string;
  take?: number;
  /** Rows to skip — server-side pagination (page N → skip = (N-1) × pageSize). */
  skip?: number;
}

/**
 * Shared WHERE for the list and its count, so the two always agree. Search is a
 * substring match on booking id (reference) or guest email.
 */
function bookingWhere(filter: { status?: BookingStatus; q?: string }): Prisma.BookingWhereInput {
  const q = filter.q?.trim();
  return {
    ...(filter.status ? { status: filter.status } : {}),
    ...(q ? { OR: [{ id: { contains: q } }, { guestEmail: { contains: q } }] } : {}),
  };
}

/** Every booking, newest first, with tour + primary-payment summary. Staff-only. */
export async function listBookingsForAdmin(
  filter: ListBookingsFilter = {},
): Promise<AdminBookingListItem[]> {
  const rows = await db.booking.findMany({
    where: bookingWhere(filter),
    orderBy: { createdAt: "desc" },
    take: filter.take ?? 200,
    skip: filter.skip ?? 0,
    select: {
      id: true,
      status: true,
      seats: true,
      totalCents: true,
      currency: true,
      guestEmail: true,
      contactInfo: true,
      createdAt: true,
      departure: { select: { startDate: true, tour: { select: { title: true, slug: true } } } },
      payments: {
        orderBy: { createdAt: "desc" },
        select: { method: true, status: true, createdAt: true },
      },
    },
  });

  return rows.map((b) => {
    const primary = b.payments.find((p) => p.status === "SUCCEEDED") ?? b.payments[0] ?? null;
    return {
      id: b.id,
      status: b.status,
      seats: b.seats,
      totalCents: b.totalCents,
      currency: b.currency,
      createdAt: b.createdAt,
      tourTitle: b.departure.tour.title,
      tourSlug: b.departure.tour.slug,
      startDate: b.departure.startDate,
      contactName: contactField(b.contactInfo, "fullName"),
      contactEmail: b.guestEmail ?? contactField(b.contactInfo, "email"),
      paymentMethod: primary?.method ?? null,
      paymentStatus: primary?.status ?? null,
    };
  });
}

/** Total bookings matching the same filter — powers list pagination. Staff-only. */
export async function countBookingsForAdmin(
  filter: { status?: BookingStatus; q?: string } = {},
): Promise<number> {
  return db.booking.count({ where: bookingWhere(filter) });
}

export interface AdminPaymentRow {
  id: string;
  method: string;
  status: string;
  amountCents: number;
  currency: string;
  sessionId: string | null;
  intentId: string | null;
  /** Manually-recorded reference (offline methods) — extracted from Payment.raw. */
  reference: string | null;
  createdAt: Date;
}

export interface AdminBookingDetail {
  id: string;
  status: BookingStatus;
  seats: number;
  totalCents: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  isGuest: boolean;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  contactNotes: string | null;
  billing: AdminBillingAddress | null;
  /** Frozen per-passenger-type price breakdown, or null for legacy bookings. */
  pricing: PriceBreakdown | null;
  /** P5: discount applied at checkout (minor units); 0 when no coupon. The
   *  breakdown lines sum to the GROSS; `totalCents` is already the NET charge. */
  discountCents: number;
  /** Coupon code applied, or null. */
  couponCode: string | null;
  /** ISO-3166 alpha-2 country the booking was made from (P7 reporting), or null. */
  originCountry: string | null;
  tourTitle: string;
  tourSlug: string;
  startDate: Date;
  endDate: Date;
  payments: AdminPaymentRow[];
  /** Whether each write action is offered, given the current status. */
  canRefund: boolean;
  canCancel: boolean;
  canMarkPaid: boolean;
}

/** One booking with full (unmasked) detail for staff. Null if not found. */
export async function getBookingForAdmin(id: string): Promise<AdminBookingDetail | null> {
  const b = await db.booking.findUnique({
    where: { id },
    select: {
      id: true,
      status: true,
      seats: true,
      totalCents: true,
      currency: true,
      userId: true,
      guestEmail: true,
      contactInfo: true,
      pricing: true,
      discountCents: true,
      couponCode: true,
      originCountry: true,
      createdAt: true,
      updatedAt: true,
      departure: {
        select: { startDate: true, endDate: true, tour: { select: { title: true, slug: true } } },
      },
      payments: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          method: true,
          status: true,
          amountCents: true,
          currency: true,
          sessionId: true,
          intentId: true,
          raw: true,
          createdAt: true,
        },
      },
    },
  });
  if (!b) return null;

  const pendingBankTransfer = b.payments.some(
    (p) => p.method === "bank_transfer" && p.status === "PENDING",
  );

  return {
    id: b.id,
    status: b.status,
    seats: b.seats,
    totalCents: b.totalCents,
    currency: b.currency,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
    isGuest: !b.userId,
    contactName: contactField(b.contactInfo, "fullName"),
    contactEmail: b.guestEmail ?? contactField(b.contactInfo, "email"),
    contactPhone: contactField(b.contactInfo, "phone"),
    contactNotes: contactField(b.contactInfo, "notes"),
    billing: billingFrom(b.contactInfo),
    pricing: parsePriceBreakdown(b.pricing),
    discountCents: b.discountCents,
    couponCode: b.couponCode,
    originCountry: b.originCountry,
    tourTitle: b.departure.tour.title,
    tourSlug: b.departure.tour.slug,
    startDate: b.departure.startDate,
    endDate: b.departure.endDate,
    payments: b.payments.map((p) => ({
      id: p.id,
      method: p.method,
      status: p.status,
      amountCents: p.amountCents,
      currency: p.currency,
      sessionId: p.sessionId,
      intentId: p.intentId,
      reference: paymentReference(p.raw),
      createdAt: p.createdAt,
    })),
    // A refund is offered whenever money was actually captured and not yet
    // returned — regardless of the current status label, so staff have full
    // authority to refund any paid order.
    canRefund: b.status !== "REFUNDED" && b.payments.some((p) => p.status === "SUCCEEDED"),
    // Cancel is offered on any live booking (i.e. not one already cancelled or
    // refunded), releasing its seats.
    canCancel: b.status !== "CANCELLED" && b.status !== "REFUNDED",
    canMarkPaid: b.status === "PENDING_PAYMENT" && pendingBankTransfer,
  };
}

export type AdminActionResult =
  | { ok: true }
  | {
      ok: false;
      reason:
        | "NOT_FOUND"
        | "NOT_REFUNDABLE"
        | "NO_PAYMENT"
        | "GATEWAY_UNAVAILABLE"
        | "GATEWAY_ERROR"
        | "SEATS_UNAVAILABLE"
        | "STALE";
      message: string;
    };

/**
 * Admin-initiated full refund — offered on any booking that has a captured
 * (SUCCEEDED) payment and is not already refunded, whatever its status label
 * (full staff authority). Dispatches the gateway refund by the succeeded
 * payment's method (offline methods such as bank transfer have no gateway call —
 * the admin has refunded manually and this just records it), then runs the
 * seat-safe, idempotent DB transition. Safe against the refund webhook: both end
 * at a status-guarded REFUNDED flip, so the later one is a no-op.
 */
export async function adminRefundBooking(params: {
  bookingId: string;
  actorId: string;
}): Promise<AdminActionResult> {
  const { bookingId, actorId } = params;
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: {
      status: true,
      payments: {
        where: { status: "SUCCEEDED" },
        orderBy: { createdAt: "desc" },
        select: { method: true, intentId: true },
      },
    },
  });
  if (!booking) return { ok: false, reason: "NOT_FOUND", message: "Booking not found." };
  if (booking.status === "REFUNDED") {
    return { ok: false, reason: "NOT_REFUNDABLE", message: "This booking has already been refunded." };
  }
  const payment = booking.payments[0];
  if (!payment) {
    return { ok: false, reason: "NO_PAYMENT", message: "No captured payment was found to refund." };
  }

  switch (payment.method) {
    case "stripe": {
      if (!payment.intentId) {
        return { ok: false, reason: "NO_PAYMENT", message: "This payment has no Stripe intent to refund." };
      }
      const stripe = await getStripe();
      if (!stripe) {
        return { ok: false, reason: "GATEWAY_UNAVAILABLE", message: "Stripe is not configured." };
      }
      try {
        await stripe.refunds.create({ payment_intent: payment.intentId });
      } catch (error) {
        logger.error("admin stripe refund failed", { bookingId, error });
        return { ok: false, reason: "GATEWAY_ERROR", message: "Stripe refused the refund. Check the dashboard." };
      }
      break;
    }
    case "paypal": {
      // For PayPal the capture id lives in `intentId`.
      if (!payment.intentId) {
        return { ok: false, reason: "NO_PAYMENT", message: "This payment has no PayPal capture to refund." };
      }
      const refunded = await refundCapture(payment.intentId);
      if (!refunded) {
        return { ok: false, reason: "GATEWAY_ERROR", message: "PayPal refused the refund. Check the dashboard." };
      }
      break;
    }
    default:
      // Offline method (bank transfer): no gateway refund — the admin refunds
      // manually and the DB transition below records it.
      break;
  }

  await markRefundedFromAnyStatus({ bookingId, intentId: payment.intentId, actorId });
  return { ok: true };
}

/**
 * Admin cancel — releases the booking's seats and marks it CANCELLED. Works on
 * any live booking (full authority): a stuck PENDING_PAYMENT one goes through
 * the dedicated primitive (which also voids its pending payment), while a
 * CONFIRMED (or other) booking is moved through the seat-safe status transition.
 * Cancelling does NOT move money — use adminRefundBooking to return a payment.
 */
export async function adminCancelBooking(params: {
  bookingId: string;
  actorId: string;
}): Promise<AdminActionResult> {
  const { bookingId, actorId } = params;
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: { status: true },
  });
  if (!booking) return { ok: false, reason: "NOT_FOUND", message: "Booking not found." };
  if (booking.status === "CANCELLED") return { ok: true }; // already cancelled — idempotent

  if (booking.status === "PENDING_PAYMENT") {
    const res = await cancelAndReleaseBooking({ bookingId, actorId });
    return res.ok
      ? { ok: true }
      : { ok: false, reason: "STALE", message: "The booking changed just now — reload and try again." };
  }

  // CONFIRMED / REFUNDED / FAILED → seat-safe flip to CANCELLED (releases the
  // seat only when the booking currently holds one, so seats never double-release).
  return setBookingStatus({ bookingId, target: "CANCELLED", actorId });
}

/** Statuses that hold a departure seat (claimed at reserve time, freed on exit). */
const SEAT_HOLDING: readonly BookingStatus[] = ["PENDING_PAYMENT", "CONFIRMED"];
const holdsSeats = (s: BookingStatus): boolean => SEAT_HOLDING.includes(s);

/**
 * Seat-safe, idempotent transition of a booking to REFUNDED from ANY current
 * status — the DB half of adminRefundBooking (the gateway refund runs first).
 * Releases the seat only when the booking currently holds one (so refunding an
 * already-cancelled booking never double-releases), marks its succeeded
 * payment(s) refunded, and records a `booking.refund` audit entry. Status-guarded
 * so a race with the provider refund webhook resolves to a single winner.
 */
async function markRefundedFromAnyStatus(params: {
  bookingId: string;
  intentId: string | null;
  actorId: string;
}): Promise<void> {
  const { bookingId, intentId, actorId } = params;
  await db.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      select: { status: true, seats: true, departureId: true },
    });
    if (!booking || booking.status === "REFUNDED") return; // gone or already refunded

    const wasHeld = holdsSeats(booking.status);
    const flip = await tx.booking.updateMany({
      where: { id: bookingId, status: booking.status },
      data: { status: "REFUNDED" },
    });
    if (flip.count !== 1) return; // raced with another transition — let the winner stand

    if (wasHeld) {
      await tx.tourDeparture.update({
        where: { id: booking.departureId },
        data: { remainingCapacity: { increment: booking.seats } },
      });
    }

    await tx.payment.updateMany({
      where: { bookingId, status: "SUCCEEDED", ...(intentId ? { intentId } : {}) },
      data: { status: "REFUNDED" },
    });

    await writeAudit({
      actorId,
      action: "booking.refund",
      entity: "Booking",
      entityId: bookingId,
      meta: { intentId, seatsReleased: wasHeld ? booking.seats : 0 },
    });
  });
}

/**
 * Manual status correction (item #6). Moves a booking to any of the five
 * statuses while keeping seat accounting correct: releasing seats when leaving a
 * seat-holding status, and re-claiming them (with an over-sell guard) when
 * returning to one. This is a bookkeeping tool ONLY — unlike adminRefundBooking /
 * adminCancelBooking it never calls a payment gateway and never sends email, so
 * it corrects records, it does not move money. Status-guarded against races.
 */
export async function setBookingStatus(params: {
  bookingId: string;
  target: BookingStatus;
  actorId: string;
}): Promise<AdminActionResult> {
  const { bookingId, target, actorId } = params;

  return db.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      select: { status: true, seats: true, departureId: true },
    });
    if (!booking) {
      return { ok: false, reason: "NOT_FOUND", message: "Booking not found." } as const;
    }

    const current = booking.status;
    if (current === target) return { ok: true } as const;

    const wasHeld = holdsSeats(current);
    const willHold = holdsSeats(target);

    // Re-claiming a released seat: refuse if the departure is now full.
    if (!wasHeld && willHold) {
      const dep = await tx.tourDeparture.findUnique({
        where: { id: booking.departureId },
        select: { remainingCapacity: true },
      });
      if (!dep || dep.remainingCapacity < booking.seats) {
        return {
          ok: false,
          reason: "SEATS_UNAVAILABLE",
          message: "Not enough seats remain on this departure to re-activate the booking.",
        } as const;
      }
    }

    // Status-guarded flip: only win the transition if still in the status we read.
    const flip = await tx.booking.updateMany({
      where: { id: bookingId, status: current },
      data: { status: target },
    });
    if (flip.count !== 1) {
      return {
        ok: false,
        reason: "STALE",
        message: "The booking changed status just now — reload and try again.",
      } as const;
    }

    if (wasHeld && !willHold) {
      await tx.tourDeparture.update({
        where: { id: booking.departureId },
        data: { remainingCapacity: { increment: booking.seats } },
      });
    } else if (!wasHeld && willHold) {
      await tx.tourDeparture.update({
        where: { id: booking.departureId },
        data: { remainingCapacity: { decrement: booking.seats } },
      });
    }

    await writeAudit({
      actorId,
      action: "booking.status.override",
      entity: "Booking",
      entityId: bookingId,
      meta: { from: current, to: target, manual: true },
    });
    return { ok: true } as const;
  });
}

// ── Booking history + live-orders read models (Wave "item 11", Phase 2) ──────

/** One entry in a booking's status history, resolved from the AuditLog. */
export interface AdminAuditEntry {
  id: string;
  action: string;
  /** Staff member who performed it, or null for system/customer/webhook events. */
  actorName: string | null;
  /** meta.via when present ("stripe.webhook", "paypal", "admin.bank_transfer"). */
  via: string | null;
  /** Status override endpoints (meta.from / meta.to), else null. */
  from: string | null;
  to: string | null;
  createdAt: Date;
}

function metaString(meta: unknown, key: string): string | null {
  if (meta && typeof meta === "object" && !Array.isArray(meta) && key in meta) {
    const v = (meta as Record<string, unknown>)[key];
    return typeof v === "string" && v.length > 0 ? v : null;
  }
  return null;
}

/**
 * The append-only AuditLog rows for one booking, oldest first — the source for
 * the status-history timeline on the detail page. Booking audit rows were
 * historically written under both "Booking" and (briefly) "booking" entity
 * casings, so match both; the entityId (a UUID) is what actually scopes them.
 */
export async function getBookingAuditTrail(bookingId: string): Promise<AdminAuditEntry[]> {
  const rows = await db.auditLog.findMany({
    where: { entityId: bookingId, entity: { in: ["Booking", "booking"] } },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      action: true,
      meta: true,
      createdAt: true,
      actor: { select: { name: true } },
    },
  });
  return rows.map((r) => ({
    id: r.id,
    action: r.action,
    actorName: r.actor?.name ?? null,
    via: metaString(r.meta, "via"),
    from: metaString(r.meta, "from"),
    to: metaString(r.meta, "to"),
    createdAt: r.createdAt,
  }));
}

/**
 * Bookings that need a human decision now: PENDING_PAYMENT holding an
 * unconfirmed offline bank transfer (the admin must confirm receipt). Powers the
 * dashboard "needs attention" indicator.
 */
export async function countBookingsNeedingAttention(): Promise<number> {
  return db.booking.count({
    where: {
      status: "PENDING_PAYMENT",
      payments: { some: { method: "bank_transfer", status: "PENDING" } },
    },
  });
}
