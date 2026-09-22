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
import type { BookingStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { getStripe } from "@/lib/stripe";
import { refundCapture } from "@/server/payments/paypal";
import { refundBooking, cancelAndReleaseBooking } from "@/server/booking";

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
}

/** Every booking, newest first, with tour + primary-payment summary. Staff-only. */
export async function listBookingsForAdmin(
  filter: ListBookingsFilter = {},
): Promise<AdminBookingListItem[]> {
  const q = filter.q?.trim();
  const rows = await db.booking.findMany({
    where: {
      ...(filter.status ? { status: filter.status } : {}),
      ...(q
        ? { OR: [{ id: { contains: q } }, { guestEmail: { contains: q } }] }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: filter.take ?? 200,
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

export interface AdminPaymentRow {
  id: string;
  method: string;
  status: string;
  amountCents: number;
  currency: string;
  sessionId: string | null;
  intentId: string | null;
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
    tourTitle: b.departure.tour.title,
    tourSlug: b.departure.tour.slug,
    startDate: b.departure.startDate,
    endDate: b.departure.endDate,
    payments: b.payments,
    canRefund: b.status === "CONFIRMED",
    canCancel: b.status === "PENDING_PAYMENT",
    canMarkPaid: b.status === "PENDING_PAYMENT" && pendingBankTransfer,
  };
}

export type AdminActionResult =
  | { ok: true }
  | {
      ok: false;
      reason: "NOT_FOUND" | "NOT_REFUNDABLE" | "NO_PAYMENT" | "GATEWAY_UNAVAILABLE" | "GATEWAY_ERROR";
      message: string;
    };

/**
 * Admin-initiated full refund. Dispatches the gateway refund by the succeeded
 * payment's method, then runs the idempotent DB transition. Offline methods
 * (bank transfer) have no gateway call — the admin has refunded manually and
 * this records it. Safe against the refund webhook (both call `refundBooking`,
 * which is status-guarded).
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
  if (booking.status !== "CONFIRMED") {
    return { ok: false, reason: "NOT_REFUNDABLE", message: "Only a confirmed booking can be refunded." };
  }
  const payment = booking.payments[0];
  if (!payment) {
    return { ok: false, reason: "NO_PAYMENT", message: "No succeeded payment found to refund." };
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
      await refundBooking({ bookingId, intentId: payment.intentId, actorId });
      return { ok: true };
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
      await refundBooking({ bookingId, intentId: payment.intentId, actorId });
      return { ok: true };
    }
    default: {
      // Offline method (bank transfer): no gateway refund — the admin refunds
      // manually and this records the status transition + seat release.
      await refundBooking({ bookingId, intentId: payment.intentId, actorId });
      return { ok: true };
    }
  }
}

/** Admin cancel of a stuck PENDING_PAYMENT booking (delegates to booking.ts). */
export async function adminCancelBooking(params: {
  bookingId: string;
  actorId: string;
}): Promise<AdminActionResult> {
  const res = await cancelAndReleaseBooking(params);
  return res.ok
    ? { ok: true }
    : { ok: false, reason: "NOT_REFUNDABLE", message: "Only a pending booking can be cancelled." };
}
