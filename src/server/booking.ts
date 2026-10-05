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
import * as paypal from "@/server/payments/paypal";
import { getSessionUser } from "@/server/auth/session";
import { getToggle } from "@/server/toggles";
import { writeAudit } from "@/server/audit";
import { sendEmail } from "@/server/email/mailer";
import { bookingConfirmationEmail } from "@/server/email/templates";
import { formatPriceCents } from "@/lib/utils";
import { localizePath } from "@/i18n/routing";
import type { Locale } from "@/i18n/config";
import {
  MAX_SEATS,
  MIN_SEATS,
  PASSENGER_TYPES,
  ReserveError,
  assertSelectableDate,
  assertValidCounts,
  evaluateCoupon,
  parseBlackoutDates,
  priceBooking,
  reserveSeatsWith,
  resolveRequestDepartureWith,
  type CouponRejectionReason,
  type DateWindow,
  type PassengerCounts,
  type PassengerType,
  type PriceBreakdown,
  type PriceLine,
  type ReserveFailureReason,
  type TourPricing,
} from "@/server/booking-core";

export { MAX_SEATS, MIN_SEATS, ReserveError, type ReserveFailureReason };

/** Gateway-facing (Stripe/PayPal) English labels for passenger types. The
 *  customer-facing UI uses the localized labels from the page dictionary; these
 *  only appear on the payment provider's checkout/line items. */
const PAX_LABEL: Record<PassengerType, string> = {
  adult: "Adult",
  child: "Child",
  infant: "Infant",
};

// ── Validation ────────────────────────────────────────────────────────────

/**
 * Billing address captured at checkout and stored inside the existing
 * Booking.contactInfo JSON (no schema column). Country is an ISO 3166-1 alpha-2
 * code (the <select> value), normalised to upper-case; the rest are free text
 * with sane length caps. line2 is optional.
 */
export const billingAddressSchema = z.object({
  line1: z.string().trim().min(1, "Enter your billing address").max(200),
  line2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(1, "Enter your city").max(120),
  region: z.string().trim().min(1, "Enter your state or region").max(120),
  postalCode: z.string().trim().min(1, "Enter your postal or ZIP code").max(32),
  country: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{2}$/, "Select your country")
    .transform((c) => c.toUpperCase()),
});
export type BillingAddress = z.infer<typeof billingAddressSchema>;

export const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(160),
  email: z.email("Enter a valid email address").max(255),
  phone: z.string().trim().min(5, "Enter a contact phone number").max(40),
  notes: z.string().trim().max(2000).optional(),
  /** P4 optional free-text pickup point/hotel. Stored in contactInfo, no column. */
  pickup: z.string().trim().max(200).optional(),
  billing: billingAddressSchema,
});
export type ContactInfo = z.infer<typeof contactSchema>;

/**
 * How the traveler told us WHEN they want to go (P8). Two shapes:
 *   • `date` — they picked a day in the calendar, which is the funnel's default.
 *     We carry the tour slug with it because a date on its own does not say
 *     which tour, and the departure row for that day may not exist yet.
 *   • `departure` — they picked one of the admin-scheduled departures, the
 *     pre-P8 behaviour, still used by tours with `onRequestDates` off and by
 *     any `?departure=<id>` deep link.
 *
 * Both resolve to a departure id before any seats are claimed, so there is
 * exactly one reserve path and one oversell guarantee below this point.
 */
export type DateSelection =
  | { kind: "departure"; departureId: string }
  | { kind: "date"; tourSlug: string; isoDate: string };

const tourSlugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1)
  .max(191)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Choose a tour");

/** The `YYYY-MM-DD` value an <input type="date"> / the calendar posts. */
const isoDateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Choose your travel date");

/**
 * The three date fields the funnel posts, narrowed to a DateSelection.
 *
 * `nullish`, not `optional`, and that distinction is load-bearing: only ONE of
 * the two shapes is ever rendered, so the other's inputs are absent from the
 * form, and `formData.get()` returns **null** — not undefined — for a field
 * that is not there. A plain `.optional()` rejects null outright ("expected
 * string, received null") and fails every single booking. Absent, null and ""
 * all mean the same thing here: not supplied.
 */
const dateSelectionFields = {
  departureId: z.string().trim().nullish(),
  tourSlug: z.string().trim().nullish(),
  departureDate: z.string().trim().nullish(),
};

function narrowDateSelection(
  data: {
    departureId?: string | null;
    tourSlug?: string | null;
    departureDate?: string | null;
  },
  ctx: z.RefinementCtx,
): DateSelection | undefined {
  if (data.departureDate) {
    const date = isoDateSchema.safeParse(data.departureDate);
    const slug = tourSlugSchema.safeParse(data.tourSlug);
    if (!date.success || !slug.success) {
      ctx.addIssue({
        code: "custom",
        message: date.success ? "Choose a tour" : "Choose your travel date",
        path: ["departureDate"],
      });
      return undefined;
    }
    return { kind: "date", tourSlug: slug.data, isoDate: date.data };
  }
  const id = z.uuid().safeParse(data.departureId);
  if (!id.success) {
    ctx.addIssue({ code: "custom", message: "Choose your travel date", path: ["departureDate"] });
    return undefined;
  }
  return { kind: "departure", departureId: id.data };
}

export const createBookingSchema = z
  .object({
    ...dateSelectionFields,
    // P4 per-passenger-type counts. At least one adult; the total is bounded by
    // MAX_SEATS via the refine below (booking-core re-validates as the SSOT).
    adults: z.coerce.number().int().min(1, "At least one adult is required").max(MAX_SEATS),
    children: z.coerce.number().int().min(0).max(MAX_SEATS),
    infants: z.coerce.number().int().min(0).max(MAX_SEATS),
    // P5 optional discount code. Empty/whitespace → no coupon; otherwise
    // normalised (trim + upper) so lookups are case-insensitive. Re-validated
    // atomically at reserve time — this only shapes the input.
    coupon: z
      .string()
      .trim()
      .max(40)
      .optional()
      .transform((c) => (c ? c.toUpperCase() : undefined)),
    contact: contactSchema,
  })
  .refine((d) => d.adults + d.children + d.infants <= MAX_SEATS, {
    message: `Up to ${MAX_SEATS} travelers per booking.`,
    path: ["adults"],
  })
  .transform((d, ctx) => ({ ...d, selection: narrowDateSelection(d, ctx) }));
export type CreateBookingInput = z.infer<typeof createBookingSchema>;

// ── Result types ──────────────────────────────────────────────────────────

export type BookingResult =
  | {
      ok: true;
      bookingId: string;
      totalCents: number;
      currency: string;
      discountCents: number;
      couponCode: string | null;
    }
  | { ok: false; reason: ReserveFailureReason | "INVALID_INPUT"; message: string };

export type CheckoutResult =
  | { ok: true; url: string }
  | {
      ok: false;
      reason: "PAYMENTS_UNAVAILABLE" | "BOOKING_NOT_PAYABLE" | "STRIPE_ERROR" | "GATEWAY_ERROR";
      message: string;
    };

const RESERVE_MESSAGES: Record<ReserveFailureReason, string> = {
  DEPARTURE_NOT_FOUND: "That departure could not be found.",
  DEPARTURE_NOT_OPEN: "That departure is no longer open for booking.",
  INVALID_SEATS: "The number of travelers is invalid.",
  SOLD_OUT: "Not enough seats remain on that departure.",
  BOOKING_CLOSED: "This tour is not accepting online bookings right now. Please contact us to arrange your trip.",
  PRICE_UNAVAILABLE: "One of the selected traveler types is not available on this tour.",
  COUPON_INVALID: "That discount code is not valid for this booking. Remove it or enter a different code.",
  DATE_UNAVAILABLE:
    "That travel date isn’t available. Please pick another date on the calendar, or contact us to arrange it.",
};

// ── Resolving a customer-chosen date to a departure ─────────────────────────

/** The tour fields the date-selection path needs. */
const requestTourSelect = {
  id: true,
  durationDays: true,
  bookingClosed: true,
  onRequestDates: true,
  requestLeadDays: true,
  requestWindowDays: true,
  requestCapacity: true,
  blackoutDates: true,
} as const;

type RequestTourRow = {
  id: string;
  durationDays: number;
  bookingClosed: boolean;
  onRequestDates: boolean;
  requestLeadDays: number;
  requestWindowDays: number;
  requestCapacity: number;
  blackoutDates: unknown;
};

function windowOf(tour: RequestTourRow): DateWindow {
  return {
    leadDays: tour.requestLeadDays,
    windowDays: tour.requestWindowDays,
    blackoutDates: parseBlackoutDates(tour.blackoutDates),
  };
}

/**
 * Load the tour behind a customer-chosen date and check it may be booked on a
 * chosen date at all. Throws ReserveError, so it reads the same as every other
 * reserve guard. Only PUBLISHED tours resolve — a draft or archived tour is
 * "not found" to the public funnel, exactly as elsewhere in the catalog.
 */
async function loadRequestTour(client: Prisma.TransactionClient | typeof db, tourSlug: string) {
  const tour = await client.tour.findFirst({
    where: { slug: tourSlug, status: "PUBLISHED" },
    select: requestTourSelect,
  });
  if (!tour) throw new ReserveError("DEPARTURE_NOT_FOUND");
  if (tour.bookingClosed) throw new ReserveError("BOOKING_CLOSED");
  // A tour whose dates are not on request has no calendar; accepting an
  // arbitrary date for it would invent inventory the operator never offered.
  if (!tour.onRequestDates) throw new ReserveError("DATE_UNAVAILABLE");
  return tour;
}

/**
 * Does this error mean "someone else created the departure for this date while
 * we were creating it"?
 *
 * Prisma's `upsert` is find-then-write, not atomic, so two first-bookings of the
 * same new date can both find nothing and both insert. The
 * (tourId, startDate) UNIQUE index is what stops that becoming two capacity
 * pools — it lets exactly one insert through and raises P2002 on the other.
 * That is contention, not a failure: the loser just needs to start over against
 * the row that now exists.
 *
 * Checked structurally rather than with `instanceof` so this stays independent
 * of which Prisma client instance threw.
 */
function isDepartureDateConflict(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const e = error as { code?: unknown; meta?: { target?: unknown } };
  if (e.code !== "P2002") return false;
  const target = e.meta?.target;
  const named = Array.isArray(target) ? target.join(",") : String(target ?? "");
  // MySQL reports the constraint name; be generous, since the only unique
  // constraint this transaction can violate is the departure date one.
  return named === "" || /tour_departures|startDate|tourId/i.test(named);
}

/** How many times to re-run the reservation when it loses that race. Each retry
 *  is a fresh transaction, which matters: InnoDB would otherwise keep serving
 *  this transaction's original snapshot, in which the winner's row is invisible. */
const MAX_DATE_CONFLICT_ATTEMPTS = 3;

/**
 * Turn a DateSelection into the departure id to claim seats on, creating the
 * departure when the traveler is the first to ask for that date.
 *
 * Runs on the caller's transaction client so the departure it may create lives
 * and dies with the reservation: if the seat claim or the coupon check fails,
 * the rollback takes the new departure row with it and the calendar is left
 * exactly as it was.
 */
async function resolveSelectionWith(
  tx: Prisma.TransactionClient,
  selection: DateSelection,
): Promise<string> {
  if (selection.kind === "departure") return selection.departureId;
  const tour = await loadRequestTour(tx, selection.tourSlug);
  const startDate = assertSelectableDate(selection.isoDate, windowOf(tour));
  return resolveRequestDepartureWith(tx, {
    tourId: tour.id,
    startDate,
    durationDays: tour.durationDays,
    capacity: tour.requestCapacity,
  });
}

/**
 * Parse the frozen price breakdown stored on a booking (Booking.pricing JSON).
 * Returns null for legacy bookings made before P4 (no breakdown) or any shape
 * that does not validate, so callers can fall back to the single-line pricing.
 */
function readBreakdown(value: unknown): PriceBreakdown | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  if (!Array.isArray(v.items) || typeof v.totalCents !== "number" || typeof v.currency !== "string") {
    return null;
  }
  const items: PriceLine[] = [];
  for (const raw of v.items) {
    if (!raw || typeof raw !== "object") return null;
    const o = raw as Record<string, unknown>;
    if (
      typeof o.type !== "string" ||
      !(PASSENGER_TYPES as readonly string[]).includes(o.type) ||
      typeof o.count !== "number" ||
      typeof o.unitCents !== "number"
    ) {
      return null;
    }
    items.push({ type: o.type as PassengerType, count: o.count, unitCents: o.unitCents });
  }
  return { items, totalCents: v.totalCents, currency: v.currency };
}

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
  const { selection, adults, children, infants, coupon, contact } = parsed.data;
  // `narrowDateSelection` already raised the issue that made it undefined, so
  // safeParse would have failed; this is a type narrowing, not a second check.
  if (!selection) {
    return { ok: false, reason: "INVALID_INPUT", message: "Choose your travel date." };
  }
  const counts: PassengerCounts = { adult: adults, child: children, infant: infants };

  const user = await getSessionUser();
  const userId = user?.id ?? null;
  // Guest email drives confirmation for anonymous bookings; a logged-in booking
  // still records the contact email in contactInfo.
  const guestEmail = userId ? null : contact.email.toLowerCase();
  // Origin country for P7 reporting: the billing country is our best proxy for
  // where the traveler is booking from. Already ISO alpha-2, uppercased by zod.
  const originCountry = contact.billing.country;

  // One transaction spans resolving the date AND claiming the seats, so a
  // departure materialized for a customer-chosen date is never left behind by a
  // reservation that then failed.
  const runReserve = () =>
    db.$transaction(async (tx) => {
      const id = await resolveSelectionWith(tx, selection);
      return {
        departureId: id,
        reserved: await reserveSeatsWith(tx, {
          departureId: id,
          counts,
          userId,
          guestEmail,
          originCountry,
          couponCode: coupon ?? null,
          contactInfo: contact as unknown as Prisma.InputJsonValue,
        }),
      };
    });

  try {
    // Losing the create-the-departure race is contention, not an error: retry
    // in a NEW transaction, where the winner's row is visible, so the second
    // customer either books the remaining seats or gets a clean SOLD_OUT —
    // never a 500. Capacity is still guarded solely by the conditional UPDATE
    // inside reserveSeatsWith, so a retry cannot oversell.
    let outcome: Awaited<ReturnType<typeof runReserve>> | null = null;
    for (let attempt = 1; attempt <= MAX_DATE_CONFLICT_ATTEMPTS; attempt++) {
      try {
        outcome = await runReserve();
        break;
      } catch (error) {
        if (!isDepartureDateConflict(error) || attempt === MAX_DATE_CONFLICT_ATTEMPTS) throw error;
        logger.warn("booking date conflict — retrying", { attempt, selection });
      }
    }
    // Unreachable: the loop either assigns, breaks, or rethrows.
    if (!outcome) throw new ReserveError("SOLD_OUT");
    const { reserved, departureId } = outcome;

    await writeAudit({
      actorId: userId,
      action: "booking.create",
      entity: "Booking",
      entityId: reserved.bookingId,
      meta: {
        departureId,
        // Which way the date arrived is worth auditing: a departure
        // materialized from a calendar pick has no admin behind it.
        dateSource: selection.kind === "date" ? `requested:${selection.isoDate}` : "scheduled",
        seats: reserved.seats,
        counts: { ...counts },
        totalCents: reserved.totalCents,
        ...(reserved.couponCode
          ? { couponCode: reserved.couponCode, discountCents: reserved.discountCents }
          : {}),
        originCountry,
        guest: !userId,
      },
    });

    return {
      ok: true,
      bookingId: reserved.bookingId,
      totalCents: reserved.totalCents,
      currency: reserved.currency,
      discountCents: reserved.discountCents,
      couponCode: reserved.couponCode,
    };
  } catch (error) {
    if (error instanceof ReserveError) {
      return { ok: false, reason: error.reason, message: RESERVE_MESSAGES[error.reason] };
    }
    logger.error("createPendingBooking failed", { error });
    throw error;
  }
}

// ── Coupon live preview ─────────────────────────────────────────────────────

/** Friendly, customer-facing reasons a previewed coupon did not apply. */
const COUPON_REJECTION_MESSAGES: Record<CouponRejectionReason, string> = {
  INACTIVE: "This code is not active.",
  NOT_STARTED: "This code is not active yet.",
  EXPIRED: "This code has expired.",
  CURRENCY_MISMATCH: "This code can’t be used for this tour’s currency.",
  MIN_SPEND: "Your total is below the minimum spend for this code.",
  LIMIT_REACHED: "This code has reached its usage limit.",
};

const validateCouponSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(1, "Enter a discount code")
      .max(40)
      .transform((c) => c.toUpperCase()),
    ...dateSelectionFields,
    adults: z.coerce.number().int().min(1).max(MAX_SEATS),
    children: z.coerce.number().int().min(0).max(MAX_SEATS),
    infants: z.coerce.number().int().min(0).max(MAX_SEATS),
  })
  .refine((d) => d.adults + d.children + d.infants <= MAX_SEATS, {
    message: `Up to ${MAX_SEATS} travelers per booking.`,
    path: ["adults"],
  })
  .transform((d, ctx) => ({ ...d, selection: narrowDateSelection(d, ctx) }));

export type CouponPreview =
  | { ok: true; code: string; discountCents: number; netCents: number; grossCents: number; currency: string }
  | { ok: false; message: string };

/**
 * Live-preview a discount code against a specific departure + passenger mix,
 * WITHOUT reserving anything. Prices the gross exactly as the reserve path does
 * (departure override ?? base, per passenger type) then runs the same pure
 * `evaluateCoupon`, so the previewed number always matches what the customer is
 * finally charged. Read-only: it never creates a booking or claims seats; the
 * authoritative check still happens atomically inside `reserveSeatsWith`.
 */
export async function validateCoupon(raw: unknown): Promise<CouponPreview> {
  const parsed = validateCouponSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Invalid discount code." };
  }
  const { code, selection, adults, children, infants } = parsed.data;
  if (!selection) return { ok: false, message: "Choose your travel date." };
  const counts: PassengerCounts = { adult: adults, child: children, infant: infants };

  try {
    assertValidCounts(counts);
  } catch {
    return { ok: false, message: "Choose your travelers before applying a code." };
  }

  // Read-only pricing for the selection. The date branch deliberately does NOT
  // go through resolveSelectionWith: previewing a code must never create a
  // departure row, so it prices straight off the tour (a date the customer has
  // not booked yet has no override by definition).
  let pricing: TourPricing;
  try {
    pricing = await loadPricingForPreview(selection);
  } catch (error) {
    if (error instanceof ReserveError) return { ok: false, message: RESERVE_MESSAGES[error.reason] };
    throw error;
  }

  let grossCents: number;
  try {
    grossCents = priceBooking(counts, pricing).totalCents;
  } catch {
    return { ok: false, message: "One of the selected traveler types is not available on this tour." };
  }

  const coupon = await db.coupon.findUnique({ where: { code } });
  if (!coupon) return { ok: false, message: "That discount code was not recognised." };

  const redemptions = await db.booking.count({
    where: { couponCode: coupon.code, status: { notIn: ["FAILED", "CANCELLED"] } },
  });
  const outcome = evaluateCoupon({ coupon, grossCents, currency: pricing.currency, redemptions });
  if (!outcome.ok) return { ok: false, message: COUPON_REJECTION_MESSAGES[outcome.reason] };

  return {
    ok: true,
    code: coupon.code,
    discountCents: outcome.discountCents,
    netCents: outcome.netCents,
    grossCents,
    currency: pricing.currency,
  };
}

/** Shared tour price columns — one shape for both preview branches. */
const pricingTourSelect = {
  basePriceCents: true,
  childPriceCents: true,
  infantPriceCents: true,
  currency: true,
  bookingClosed: true,
  priceTiers: { select: { minPax: true, maxPax: true, pricePerPersonCents: true } },
} as const;

/**
 * Resolve the per-type prices for a selection, read-only. Mirrors the pricing
 * `reserveSeatsWith` computes — same override precedence, same tiers — so a
 * previewed discount matches the final charge to the cent. Throws ReserveError
 * for a selection the funnel must refuse.
 */
async function loadPricingForPreview(selection: DateSelection): Promise<TourPricing> {
  if (selection.kind === "date") {
    const tour = await loadRequestTour(db, selection.tourSlug);
    // Re-check the date here too: a code previewed against a date the server
    // would refuse would quote a total the customer can never actually pay.
    assertSelectableDate(selection.isoDate, windowOf(tour));
    const prices = await db.tour.findUniqueOrThrow({
      where: { id: tour.id },
      select: pricingTourSelect,
    });
    return {
      adultCents: prices.basePriceCents,
      childCents: prices.childPriceCents,
      infantCents: prices.infantPriceCents,
      currency: prices.currency,
      tiers: prices.priceTiers,
    };
  }

  const dep = await db.tourDeparture.findUnique({
    where: { id: selection.departureId },
    select: { priceOverrideCents: true, tour: { select: pricingTourSelect } },
  });
  if (!dep) throw new ReserveError("DEPARTURE_NOT_FOUND");
  if (dep.tour.bookingClosed) throw new ReserveError("BOOKING_CLOSED");
  return {
    adultCents: dep.priceOverrideCents ?? dep.tour.basePriceCents,
    childCents: dep.tour.childPriceCents,
    infantCents: dep.tour.infantPriceCents,
    currency: dep.tour.currency,
    tiers: dep.priceOverrideCents == null ? dep.tour.priceTiers : [],
  };
}

// ── Start Stripe Checkout for a pending booking ─────────────────────────────

/**
 * Create a hosted Stripe Checkout Session for a PENDING_PAYMENT booking and
 * persist a Payment row keyed by the session id. Returns the redirect URL.
 * Payments-unavailable (no Stripe configured) is a clean, non-throwing result.
 */
export async function startStripeCheckout(bookingId: string, locale: Locale): Promise<CheckoutResult> {
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      status: true,
      seats: true,
      totalCents: true,
      currency: true,
      pricing: true,
      discountCents: true,
      couponCode: true,
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

  const contactEmail =
    booking.guestEmail ??
    (booking.contactInfo && typeof booking.contactInfo === "object" && "email" in booking.contactInfo
      ? String((booking.contactInfo as Record<string, unknown>).email)
      : undefined);
  const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const departureLabel = booking.departure.startDate.toISOString().slice(0, 10);

  // P4: one Stripe line item per passenger type from the frozen breakdown (its
  // line totals sum EXACTLY to totalCents). Legacy bookings without a breakdown
  // fall back to the original single line at the average per-seat amount.
  // P5: when a coupon discounted the order, the GROSS breakdown no longer sums
  // to the NET `totalCents`, and Stripe has no clean per-line discount here, so
  // we collapse to ONE line item at the net total (the code is named for the
  // buyer). PayPal/bank read `totalCents` directly and need no such handling.
  const breakdown = readBreakdown(booking.pricing);
  const discounted = booking.discountCents > 0;
  const lineItems =
    !discounted && breakdown && breakdown.items.length > 0
      ? breakdown.items.map((line) => ({
          quantity: line.count,
          price_data: {
            currency: booking.currency.toLowerCase(),
            unit_amount: line.unitCents,
            product_data: {
              name: `${booking.departure.tour.title} — ${PAX_LABEL[line.type]}`,
              description: `Departure ${departureLabel}`,
            },
          },
        }))
      : [
          {
            quantity: 1,
            price_data: {
              currency: booking.currency.toLowerCase(),
              // Net total as a single unit (never divide — a discounted total
              // rarely splits evenly across seats and must reconcile to the cent).
              unit_amount: booking.totalCents,
              product_data: {
                name: booking.departure.tour.title,
                description: discounted
                  ? `Departure ${departureLabel} · ${booking.seats} traveler(s) · code ${booking.couponCode} applied`
                  : `Departure ${departureLabel} · ${booking.seats} traveler(s)`,
              },
            },
          },
        ];

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      client_reference_id: booking.id,
      customer_email: contactEmail,
      line_items: lineItems,
      metadata: {
        bookingId: booking.id,
        tourSlug: booking.departure.tour.slug,
        seats: String(booking.seats),
      },
      success_url: `${baseUrl}${localizePath("/booking/success", locale)}?booking=${booking.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}${localizePath("/booking/cancelled", locale)}?booking=${booking.id}`,
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

// ── Bank transfer (offline) ─────────────────────────────────────────────────

export type BankTransferResult =
  | { ok: true; reference: string }
  | { ok: false; reason: "UNAVAILABLE" | "BOOKING_NOT_PAYABLE"; message: string };

/**
 * Record intent to pay a PENDING_PAYMENT booking by offline bank transfer.
 * Creates a PENDING bank_transfer Payment row (no gateway) so the order shows a
 * method in the admin panel; funds are reconciled manually and an admin marks
 * it paid via `confirmBankTransferBooking`. The booking reference is the id the
 * customer quotes on their transfer.
 */
export async function startBankTransfer(bookingId: string): Promise<BankTransferResult> {
  if (!(await getToggle("PAYMENTS_BANK_TRANSFER_ENABLED"))) {
    return { ok: false, reason: "UNAVAILABLE", message: "Bank transfer is not available right now." };
  }
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: { id: true, status: true, totalCents: true, currency: true },
  });
  if (!booking) return { ok: false, reason: "BOOKING_NOT_PAYABLE", message: "Booking not found." };
  if (booking.status !== "PENDING_PAYMENT") {
    return { ok: false, reason: "BOOKING_NOT_PAYABLE", message: "This booking is no longer awaiting payment." };
  }

  // Idempotent: only create the intent row once per booking.
  const existing = await db.payment.findFirst({
    where: { bookingId: booking.id, method: "bank_transfer" },
    select: { id: true },
  });
  if (!existing) {
    await db.payment.create({
      data: {
        bookingId: booking.id,
        method: "bank_transfer",
        amountCents: booking.totalCents,
        currency: booking.currency,
        status: "PENDING",
      },
    });
  }
  return { ok: true, reference: booking.id };
}

/**
 * Admin marks an offline bank-transfer booking paid: PENDING_PAYMENT → CONFIRMED
 * exactly once (status-guarded), the bank_transfer payment → SUCCEEDED, audit,
 * and the confirmation email on the winning transition. Seats were already
 * claimed at reserve time, so confirmation changes no capacity.
 *
 * `reference` (optional) is the admin's proof-of-receipt note — a bank transfer
 * confirmation code, the payer's name, etc. Offline payments carry no gateway
 * id, so it is recorded on the Payment.raw JSON (no schema column) and echoed
 * into the audit meta for the status-history trail.
 */
export async function confirmBankTransferBooking(params: {
  bookingId: string;
  actorId: string;
  reference?: string;
}): Promise<{ ok: boolean }> {
  const { bookingId, actorId } = params;
  const reference = params.reference?.trim().slice(0, 200) || undefined;
  const confirmed = await db.$transaction(async (tx) => {
    const flip = await tx.booking.updateMany({
      where: { id: bookingId, status: "PENDING_PAYMENT" },
      data: { status: "CONFIRMED" },
    });
    if (flip.count !== 1) return false; // not pending — no-op (never double-confirm)

    await tx.payment.updateMany({
      where: { bookingId, method: "bank_transfer", status: "PENDING" },
      data: {
        status: "SUCCEEDED",
        ...(reference ? { raw: { reference, source: "admin.confirm" } } : {}),
      },
    });

    await writeAudit({
      actorId,
      action: "booking.confirm",
      entity: "Booking",
      entityId: bookingId,
      meta: { via: "admin.bank_transfer", ...(reference ? { reference } : {}) },
    });
    return true;
  });

  if (confirmed) {
    await sendBookingConfirmationEmail(bookingId);
  }
  return { ok: confirmed };
}

// ── PayPal checkout (Orders v2, server-side redirect) ────────────────────────

/**
 * Create a PayPal order for a PENDING_PAYMENT booking and persist a Payment row
 * keyed by the PayPal order id (in `sessionId`). Returns the buyer approval URL.
 * The admin PAYMENTS_PAYPAL_ENABLED toggle is authoritative even when creds
 * exist. Same clean PAYMENTS_UNAVAILABLE degradation as Stripe.
 */
export async function startPaypalCheckout(bookingId: string, locale: Locale): Promise<CheckoutResult> {
  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      status: true,
      seats: true,
      totalCents: true,
      currency: true,
      departure: { select: { startDate: true, tour: { select: { title: true } } } },
    },
  });
  if (!booking) return { ok: false, reason: "BOOKING_NOT_PAYABLE", message: "Booking not found." };
  if (booking.status !== "PENDING_PAYMENT") {
    return { ok: false, reason: "BOOKING_NOT_PAYABLE", message: "This booking is no longer awaiting payment." };
  }

  const enabled = await getToggle("PAYMENTS_PAYPAL_ENABLED");
  if (!enabled || !(await paypal.isPaypalConfigured())) {
    return {
      ok: false,
      reason: "PAYMENTS_UNAVAILABLE",
      message: "PayPal is not available right now. Please contact us to complete your booking.",
    };
  }

  const baseUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  // Mirrors startStripeCheckout: the gateway call is wrapped so a PayPal
  // outage or credential problem becomes a clean message on the funnel, never
  // an exception — the booking and its seat claim already exist by now, and a
  // crash would leave the customer with no reference and no way back.
  let order: Awaited<ReturnType<typeof paypal.createOrder>>;
  try {
    order = await paypal.createOrder({
      amountCents: booking.totalCents,
      currency: booking.currency,
      referenceId: booking.id,
      description: `${booking.departure.tour.title} · ${booking.seats} traveler(s)`,
      returnUrl: `${baseUrl}${localizePath("/booking/paypal-return", locale)}?booking=${booking.id}`,
      cancelUrl: `${baseUrl}${localizePath("/booking/cancelled", locale)}?booking=${booking.id}`,
    });
  } catch (error) {
    logger.error("paypal checkout start failed", { bookingId: booking.id, error });
    return { ok: false, reason: "GATEWAY_ERROR", message: "Could not start PayPal checkout. Please try again." };
  }
  if (!order) {
    return { ok: false, reason: "GATEWAY_ERROR", message: "Could not start PayPal checkout. Please try again." };
  }

  await db.payment.create({
    data: {
      bookingId: booking.id,
      sessionId: order.orderId,
      method: "paypal",
      amountCents: booking.totalCents,
      currency: booking.currency,
      status: "PENDING",
    },
  });

  return { ok: true, url: order.approveUrl };
}

/**
 * Capture an approved PayPal order on return from the hosted flow, then confirm
 * the booking. Idempotent: if capture already happened (double return, or the
 * webhook won the race) we read the order state instead and still confirm.
 */
export async function capturePaypalReturn(
  orderId: string,
): Promise<{ ok: boolean; bookingId: string | null }> {
  let capture = await paypal.captureOrder(orderId);
  if (!capture) capture = await paypal.getOrder(orderId);
  if (!capture || capture.status !== "COMPLETED") {
    const payment = await db.payment.findUnique({ where: { sessionId: orderId }, select: { bookingId: true } });
    return { ok: false, bookingId: payment?.bookingId ?? null };
  }
  const res = await confirmPaypalOrder({
    orderId,
    captureId: capture.captureId,
    raw: capture.raw as Prisma.InputJsonValue,
  });
  return { ok: true, bookingId: res.bookingId };
}

/**
 * Confirm a PayPal-paid booking exactly once (status-guarded), mark its payment
 * SUCCEEDED with the capture id, and email on the winning transition. Resolves
 * the payment by PayPal order id (`sessionId`) or, failing that, by booking id +
 * method (the webhook carries `custom_id` = booking id). Idempotent — safe to
 * call from both the return route and the webhook.
 */
export async function confirmPaypalOrder(params: {
  orderId?: string | null;
  bookingId?: string | null;
  captureId: string | null;
  raw: Prisma.InputJsonValue;
}): Promise<{ ok: boolean; bookingId: string | null }> {
  const payment = params.orderId
    ? await db.payment.findUnique({ where: { sessionId: params.orderId }, select: { id: true, bookingId: true } })
    : params.bookingId
      ? await db.payment.findFirst({
          where: { bookingId: params.bookingId, method: "paypal" },
          orderBy: { createdAt: "desc" },
          select: { id: true, bookingId: true },
        })
      : null;
  if (!payment) return { ok: false, bookingId: params.bookingId ?? null };
  const bookingId = payment.bookingId;

  const confirmed = await db.$transaction(async (tx) => {
    const flip = await tx.booking.updateMany({
      where: { id: bookingId, status: "PENDING_PAYMENT" },
      data: { status: "CONFIRMED" },
    });
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: "SUCCEEDED", intentId: params.captureId ?? undefined, raw: params.raw },
    });
    if (flip.count === 1) {
      await writeAudit({
        actorId: null,
        action: "booking.confirm",
        entity: "Booking",
        entityId: bookingId,
        meta: { via: "paypal", captureId: params.captureId },
      });
    }
    return flip.count === 1;
  });

  if (confirmed) await sendBookingConfirmationEmail(bookingId);
  return { ok: true, bookingId };
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
      // No prior Payment row for this session (rare — e.g. a webhook arriving
      // for a booking whose checkout row was never written). Price the fallback
      // row from the booking itself so a non-USD (e.g. EGP) booking is never
      // mislabelled as USD.
      const bk = await tx.booking.findUnique({
        where: { id: bookingId },
        select: { currency: true, totalCents: true },
      });
      await tx.payment.create({
        data: {
          bookingId,
          sessionId: sessionId ?? undefined,
          intentId: intentId ?? undefined,
          method: "stripe",
          amountCents: amountCents ?? bk?.totalCents ?? 0,
          currency: bk?.currency ?? "USD",
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
 * Cancel a PENDING_PAYMENT booking and release its seats — exactly once,
 * guarded by the status transition. For an admin clearing a stuck/abandoned
 * booking whose payment never completed (nothing was captured, so there is no
 * gateway refund to make). Distinct from `failAndReleaseBooking` (webhook-driven
 * FAILED) so the audit trail records an intentional staff cancellation.
 */
export async function cancelAndReleaseBooking(params: {
  bookingId: string;
  actorId: string;
}): Promise<{ ok: boolean }> {
  const { bookingId, actorId } = params;
  return db.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      select: { status: true, seats: true, departureId: true },
    });
    if (!booking) return { ok: false };

    const flip = await tx.booking.updateMany({
      where: { id: bookingId, status: "PENDING_PAYMENT" },
      data: { status: "CANCELLED" },
    });
    if (flip.count !== 1) return { ok: false }; // not pending — refuse (never double-release)

    await tx.tourDeparture.update({
      where: { id: booking.departureId },
      data: { remainingCapacity: { increment: booking.seats } },
    });

    // Any pending payment attempt (e.g. an unpaid bank-transfer intent) is voided.
    await tx.payment.updateMany({
      where: { bookingId, status: "PENDING" },
      data: { status: "FAILED" },
    });

    await writeAudit({
      actorId,
      action: "booking.cancel",
      entity: "Booking",
      entityId: bookingId,
      meta: { via: "admin", seatsReleased: booking.seats },
    });
    return { ok: true };
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
