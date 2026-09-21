/**
 * Booking + payment orchestration (Phase 3, Q8/Q9).
 *
 * This is the `server-only` boundary over booking-core.ts. It owns:
 *   - input validation (zod) and session resolution,
 *   - the atomic seat-claim (delegated to reserveSeatsWith),
 *   - Stripe Checkout Session creation (hosted checkout — redirect to Stripe,
 *     no client SDK / publishable key needed), full prepay,
 *   - the webhook state machine: idempotent PENDING_PAYMENT → CONFIRMED /
 *     FAILED / REFUNDED transitions with race-safe seat release.
 *
 * Money is integer cents throughout. Every state transition that must happen
 * exactly once uses a status-guarded `updateMany` (count === 1 means "I won
 * the transition") so redelivered webhooks and double submits never
 * double-release seats or double-confirm.
 */
import "server-only";
import { z } from "zod";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { getStripe } from "@/lib/stripe";
import { getSessionUser } from "@/server/auth/session";
import { getToggle } from "@/server/toggles";
import { writeAudit } from "@/server/audit";
import { sendEmail } from "@/server/email/mailer";
import { bookingConfirmationEmail } from "@/server/email/templates";
import { formatPriceCents } from "@/lib/utils";
import {
  MAX_SEATS,
  MIN_SEATS,
  ReserveError,
  reserveSeatsWith,
  type ReserveFailureReason,
} from "@/server/booking-core";

export { MAX_SEATS, MIN_SEATS, ReserveError, type ReserveFailureReason };

// ── Validation ────────────────────────────────────────────────────────────

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(160),
  email: z.email("Enter a valid email address").max(255),
  phone: z.string().trim().min(5, "Enter a contact phone number").max(40),
  notes: z.string().trim().max(2000).optional(),
});
export type ContactInfo = z.infer<typeof contactSchema>;

export const createBookingSchema = z.object({
  departureId: z.uuid("Choose a departure date"),
  seats: z.coerce.number().int().min(MIN_SEATS).max(MAX_SEATS),
  contact: contactSchema,
});
export type CreateBookingInput = z.infer<typeof createBookingSchema>;

// ── Result types ──────────────────────────────────────────────────────────

export type BookingResult =
  | { ok: true; bookingId: string; totalCents: number; currency: string }
  | { ok: false; reason: ReserveFailureReason | "INVALID_INPUT"; message: string };

export type CheckoutResult =
  | { ok: true; url: string }
  | { ok: false; reason: "PAYMENTS_UNAVAILABLE" | "BOOKING_NOT_PAYABLE" | "STRIPE_ERROR"; message: string };

const RESERVE_MESSAGES: Record<ReserveFailureReason, string> = {
  DEPARTURE_NOT_FOUND: "That departure could not be found.",
  DEPARTURE_NOT_OPEN: "That departure is no longer open for booking.",
  INVALID_SEATS: "The number of travelers is invalid.",
  SOLD_OUT: "Not enough seats remain on that departure.",
};

// ── Create a pending booking (atomic seat claim) ────────────────────────────

/**
 * Validate input, resolve the (optional) logged-in user, and atomically claim
 * seats. Returns a discriminated result — never throws for expected failures
 * (sold out, closed) so the caller renders a clean message.
 */
export async function createPendingBooking(raw: unknown): Promise<BookingResult> {
  const parsed = createBookingSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, reason: "INVALID_INPUT", message: first?.message ?? "Invalid booking details." };
  }
  const { departureId, seats, contact } = parsed.data;

  const user = await getSessionUser();
  const userId = user?.id ?? null;
  // Guest email drives confirmation for anonymous bookings; a logged-in booking
  // still records the contact email in contactInfo.
  const guestEmail = userId ? null : contact.email.toLowerCase();

  try {
    const reserved = await reserveSeatsWith(db, {
      departureId,
      seats,
      userId,
      guestEmail,
      contactInfo: contact as unknown as Prisma.InputJsonValue,
    });

    await writeAudit({
      actorId: userId,
      action: "booking.create",
      entity: "Booking",
      entityId: reserved.bookingId,
      meta: { departureId, seats, totalCents: reserved.totalCents, guest: !userId },
    });

    return {
      ok: true,
      bookingId: reserved.bookingId,
      totalCents: reserved.totalCents,
      currency: reserved.currency,
    };
  } catch (error) {
    if (error instanceof ReserveError) {
      return { ok: false, reason: error.reason, message: RESERVE_MESSAGES[error.reason] };
    }
    logger.error("createPendingBooking failed", { error });
    throw error;
  }
}

// ── Start Stripe Checkout for a pending booking ─────────────────────────────

/**
 * Create a hosted Stripe Checkout Session for a PENDING_PAYMENT booking and
 * persist a Payment row keyed by the session id. Returns the redirect URL.
 * Payments-unavailable (no Stripe configured) is a clean, non-throwing result.
 */
export async function startStripeCheckout(bookingId: string): Promise<CheckoutResult> {
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      status: true,
      seats: true,
      totalCents: true,
      currency: true,
      guestEmail: true,
      contactInfo: true,
      departure: { select: { startDate: true, tour: { select: { title: true, slug: true } } } },
    },
  });
  if (!booking) {
    return { ok: false, reason: "BOOKING_NOT_PAYABLE", message: "Booking not found." };
  }
  if (booking.status !== "PENDING_PAYMENT") {
    return { ok: false, reason: "BOOKING_NOT_PAYABLE", message: "This booking is no longer awaiting payment." };
  }

  // The admin PAYMENTS_STRIPE_ENABLED toggle is authoritative: even with Stripe
  // credentials configured, an admin can turn online payment off at runtime.
  // Off → the same clean PAYMENTS_UNAVAILABLE path (booking held, manual follow-up).
  const paymentsEnabled = await getToggle("PAYMENTS_STRIPE_ENABLED");
  const stripe = paymentsEnabled ? await getStripe() : null;
  if (!stripe) {
    return {
      ok: false,
      reason: "PAYMENTS_UNAVAILABLE",
      message: "Online payment is not available right now. Please contact us to complete your booking.",
    };
  }

  const unitAmount = Math.round(booking.totalCents / booking.seats);
  const contactEmail =
    booking.guestEmail ??
    (booking.contactInfo && typeof booking.contactInfo === "object" && "email" in booking.contactInfo
      ? String((booking.contactInfo as Record<string, unknown>).email)
      : undefined);
  const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const departureLabel = booking.departure.startDate.toISOString().slice(0, 10);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: booking.id,
      customer_email: contactEmail,
      line_items: [
        {
          quantity: booking.seats,
          price_data: {
            currency: booking.currency.toLowerCase(),
            unit_amount: unitAmount,
            product_data: {
              name: booking.departure.tour.title,
              description: `Departure ${departureLabel} · ${booking.seats} traveler(s)`,
            },
          },
        },
      ],
      metadata: {
        bookingId: booking.id,
        tourSlug: booking.departure.tour.slug,
        seats: String(booking.seats),
      },
      success_url: `${baseUrl}/booking/success?booking=${booking.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/booking/cancelled?booking=${booking.id}`,
      // Expire abandoned sessions in 30 min so seats can be released by the
      // checkout.session.expired webhook.
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    if (!session.url) {
      return { ok: false, reason: "STRIPE_ERROR", message: "Could not start checkout. Please try again." };
    }

    await db.payment.create({
      data: {
        bookingId: booking.id,
        sessionId: session.id,
        method: "stripe",
        amountCents: booking.totalCents,
        currency: booking.currency,
        status: "PENDING",
      },
    });

    return { ok: true, url: session.url };
  } catch (error) {
    logger.error("startStripeCheckout failed", { bookingId, error });
    return { ok: false, reason: "STRIPE_ERROR", message: "Could not start checkout. Please try again." };
  }
}

// ── Webhook state machine (idempotent) ──────────────────────────────────────

/**
 * Confirm a booking after a successful Checkout Session. Idempotent: the
 * status-guarded updateMany means only the FIRST delivery flips
 * PENDING_PAYMENT → CONFIRMED; redeliveries are no-ops. Seats were already
 * claimed at reserve time, so confirmation changes no capacity.
 */
export async function confirmBookingPaid(params: {
  bookingId: string;
  sessionId: string | null;
  intentId: string | null;
  amountCents: number | null;
  raw: Prisma.InputJsonValue;
}): Promise<void> {
  const { bookingId, sessionId, intentId, amountCents, raw } = params;
  const confirmed = await db.$transaction(async (tx) => {
    const flip = await tx.booking.updateMany({
      where: { id: bookingId, status: "PENDING_PAYMENT" },
      data: { status: "CONFIRMED" },
    });

    // Update (or create) the payment row for this session as SUCCEEDED.
    const existing = sessionId
      ? await tx.payment.findUnique({ where: { sessionId }, select: { id: true } })
      : null;
    if (existing) {
      await tx.payment.update({
        where: { id: existing.id },
        data: { status: "SUCCEEDED", intentId: intentId ?? undefined, raw },
      });
    } else {
      await tx.payment.create({
        data: {
          bookingId,
          sessionId: sessionId ?? undefined,
          intentId: intentId ?? undefined,
          method: "stripe",
          amountCents: amountCents ?? 0,
          currency: "USD",
          status: "SUCCEEDED",
          raw,
        },
      });
    }

    if (flip.count === 1) {
      await writeAudit({
        actorId: null,
        action: "booking.confirm",
        entity: "Booking",
        entityId: bookingId,
        meta: { via: "stripe.webhook", intentId },
      });
    }
    return flip.count === 1;
  });

  // Send the confirmation email exactly once — only on the winning transition,
  // and OUTSIDE the transaction (a slow SMTP/HTTP call must never hold a DB
  // transaction open). Email failure is non-fatal: the booking is already
  // confirmed and the customer sees the success page regardless.
  if (confirmed) {
    await sendBookingConfirmationEmail(bookingId);
  }
}

/**
 * Load a confirmed booking's contact + trip details and send the confirmation
 * email. Best-effort: any failure is logged and swallowed (the booking stands).
 * Reads the contact email from guestEmail (guest) or contactInfo (logged-in).
 */
async function sendBookingConfirmationEmail(bookingId: string): Promise<void> {
  try {
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        seats: true,
        totalCents: true,
        currency: true,
        guestEmail: true,
        contactInfo: true,
        departure: {
          select: { startDate: true, tour: { select: { title: true, slug: true } } },
        },
      },
    });
    if (!booking) return;

    const contactEmail =
      booking.guestEmail ??
      (booking.contactInfo && typeof booking.contactInfo === "object" && "email" in booking.contactInfo
        ? String((booking.contactInfo as Record<string, unknown>).email)
        : null);
    if (!contactEmail) return;

    const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
    const departureLabel = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }).format(booking.departure.startDate);

    const email = bookingConfirmationEmail({
      bookingId: booking.id,
      tourTitle: booking.departure.tour.title,
      tourSlug: booking.departure.tour.slug,
      departureLabel,
      seats: booking.seats,
      totalFormatted: formatPriceCents(booking.totalCents, booking.currency),
      manageUrl: `${baseUrl}/booking/success?booking=${booking.id}`,
    });
    await sendEmail({ to: contactEmail, subject: email.subject, text: email.text, html: email.html });
  } catch (error) {
    logger.error("booking confirmation email failed", { bookingId, error });
  }
}

/**
 * Fail a pending booking (checkout expired / async payment failed) and release
 * its seats — exactly once, guarded by the status transition.
 */
export async function failAndReleaseBooking(params: {
  bookingId: string;
  sessionId: string | null;
  reason: string;
}): Promise<void> {
  const { bookingId, sessionId, reason } = params;
  await db.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      select: { status: true, seats: true, departureId: true },
    });
    if (!booking) return;

    const flip = await tx.booking.updateMany({
      where: { id: bookingId, status: "PENDING_PAYMENT" },
      data: { status: "FAILED" },
    });
    if (flip.count !== 1) return; // already terminal — do not double-release

    await tx.tourDeparture.update({
      where: { id: booking.departureId },
      data: { remainingCapacity: { increment: booking.seats } },
    });

    if (sessionId) {
      await tx.payment.updateMany({ where: { sessionId }, data: { status: "FAILED" } });
    }

    await writeAudit({
      actorId: null,
      action: "booking.fail",
      entity: "Booking",
      entityId: bookingId,
      meta: { via: "stripe.webhook", reason, seatsReleased: booking.seats },
    });
  });
}

/**
 * Refund a confirmed booking and release its seats — exactly once. Called from
 * the refund webhook (`charge.refunded`) and reusable by an admin refund action.
 */
export async function refundBooking(params: {
  bookingId: string;
  intentId: string | null;
  actorId?: string | null;
  raw?: Prisma.InputJsonValue;
}): Promise<void> {
  const { bookingId, intentId, actorId = null, raw } = params;
  await db.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      select: { status: true, seats: true, departureId: true },
    });
    if (!booking) return;

    const flip = await tx.booking.updateMany({
      where: { id: bookingId, status: "CONFIRMED" },
      data: { status: "REFUNDED" },
    });
    if (flip.count !== 1) return; // not confirmed (or already refunded) — no-op

    await tx.tourDeparture.update({
      where: { id: booking.departureId },
      data: { remainingCapacity: { increment: booking.seats } },
    });

    await tx.payment.updateMany({
      where: { bookingId, status: "SUCCEEDED", ...(intentId ? { intentId } : {}) },
      data: { status: "REFUNDED", ...(raw ? { raw } : {}) },
    });

    await writeAudit({
      actorId,
      action: "booking.refund",
      entity: "Booking",
      entityId: bookingId,
      meta: { intentId, seatsReleased: booking.seats },
    });
  });
}

/** Find a booking id from a Stripe intent id (refund events carry the intent). */
export async function findBookingIdByIntent(intentId: string): Promise<string | null> {
  const payment = await db.payment.findUnique({
    where: { intentId },
    select: { bookingId: true },
  });
  return payment?.bookingId ?? null;
}
