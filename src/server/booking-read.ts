/**
 * Booking read helpers for the customer-facing outcome pages (Phase 3).
 * Server-only. Returns just what the success/cancelled/pending pages render —
 * never the full contactInfo blob or payment internals.
 */
import "server-only";
import { db } from "@/lib/db";
import { parsePriceBreakdown, type PriceBreakdown } from "@/server/booking-core";

export interface BookingOutcome {
  id: string;
  status: string;
  seats: number;
  totalCents: number;
  currency: string;
  tourTitle: string;
  tourSlug: string;
  startDate: Date;
  endDate: Date;
  /**
   * Masked confirmation address (e.g. `j***@example.com`). These outcome pages
   * are addressable by anyone holding the (UUIDv4) booking id, so we never emit
   * the full PII email — the booker still recognizes their own masked address.
   */
  contactEmailMasked: string | null;
  /** Frozen per-passenger-type price breakdown, or null for legacy bookings. */
  pricing: PriceBreakdown | null;
  /** P5: discount applied at checkout (minor units); 0 when no coupon. The
   *  breakdown lines sum to the GROSS; `totalCents` is already the NET charge. */
  discountCents: number;
  /** Coupon code applied, or null. */
  couponCode: string | null;
}

/** `john@example.com` → `j***@example.com`; keeps the domain for recognition. */
function maskEmail(email: string | null): string | null {
  if (!email) return null;
  const trimmed = email.trim();
  if (!trimmed) return null;
  const at = trimmed.lastIndexOf("@");
  if (at <= 0) return `${trimmed[0] ?? ""}***`;
  return `${trimmed[0]}***${trimmed.slice(at)}`;
}

export interface UserBookingRow {
  id: string;
  status: string;
  seats: number;
  totalCents: number;
  currency: string;
  tourTitle: string;
  tourSlug: string;
  startDate: Date;
  createdAt: Date;
}

/** A user's own bookings (account area), newest first. Owner-scoped by userId. */
export async function listUserBookings(userId: string): Promise<UserBookingRow[]> {
  const rows = await db.booking.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      seats: true,
      totalCents: true,
      currency: true,
      createdAt: true,
      departure: { select: { startDate: true, tour: { select: { title: true, slug: true } } } },
    },
  });
  return rows.map((b) => ({
    id: b.id,
    status: b.status,
    seats: b.seats,
    totalCents: b.totalCents,
    currency: b.currency,
    tourTitle: b.departure.tour.title,
    tourSlug: b.departure.tour.slug,
    startDate: b.departure.startDate,
    createdAt: b.createdAt,
  }));
}

export async function getBookingOutcome(bookingId: string): Promise<BookingOutcome | null> {
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
      pricing: true,
      discountCents: true,
      couponCode: true,
      departure: {
        select: { startDate: true, endDate: true, tour: { select: { title: true, slug: true } } },
      },
    },
  });
  if (!booking) return null;

  return {
    id: booking.id,
    status: booking.status,
    seats: booking.seats,
    totalCents: booking.totalCents,
    currency: booking.currency,
    tourTitle: booking.departure.tour.title,
    tourSlug: booking.departure.tour.slug,
    startDate: booking.departure.startDate,
    endDate: booking.departure.endDate,
    contactEmailMasked: maskEmail(contactEmailOf(booking)),
    pricing: parsePriceBreakdown(booking.pricing),
    discountCents: booking.discountCents,
    couponCode: booking.couponCode,
  };
}

type ContactCarrier = { guestEmail: string | null; contactInfo: unknown };

/** Best contact email for a booking: the guest email, else stored contactInfo.email. */
function contactEmailOf(booking: ContactCarrier): string | null {
  if (booking.guestEmail) return booking.guestEmail;
  const info = booking.contactInfo;
  if (info && typeof info === "object" && "email" in info) {
    const email = (info as Record<string, unknown>).email;
    return typeof email === "string" ? email : null;
  }
  return null;
}

export interface BookingTracking {
  reference: string;
  status: string;
  seats: number;
  totalCents: number;
  currency: string;
  tourTitle: string;
  tourSlug: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  /** Frozen per-passenger-type price breakdown, or null for legacy bookings. */
  pricing: PriceBreakdown | null;
  /** P5: discount applied at checkout (minor units); 0 when no coupon. The
   *  breakdown lines sum to the GROSS; `totalCents` is already the NET charge. */
  discountCents: number;
  /** Coupon code applied, or null. */
  couponCode: string | null;
}

/**
 * Public tracking lookup: match a booking by BOTH its reference (id) and the
 * contact email used to book. The reference is a UUID others might hold, so the
 * email must also match to prove ownership. Any mismatch returns null with no
 * hint about whether the reference exists on its own — uniform not-found.
 */
export async function lookupBooking(reference: string, email: string): Promise<BookingTracking | null> {
  const ref = reference.trim();
  const wanted = email.trim().toLowerCase();
  if (!ref || !wanted) return null;

  const booking = await db.booking.findUnique({
    where: { id: ref },
    select: {
      id: true,
      status: true,
      seats: true,
      totalCents: true,
      currency: true,
      guestEmail: true,
      contactInfo: true,
      createdAt: true,
      pricing: true,
      discountCents: true,
      couponCode: true,
      departure: {
        select: { startDate: true, endDate: true, tour: { select: { title: true, slug: true } } },
      },
    },
  });
  if (!booking) return null;

  const contact = contactEmailOf(booking);
  if (!contact || contact.trim().toLowerCase() !== wanted) return null;

  return {
    reference: booking.id,
    status: booking.status,
    seats: booking.seats,
    totalCents: booking.totalCents,
    currency: booking.currency,
    tourTitle: booking.departure.tour.title,
    tourSlug: booking.departure.tour.slug,
    startDate: booking.departure.startDate,
    endDate: booking.departure.endDate,
    createdAt: booking.createdAt,
    pricing: parsePriceBreakdown(booking.pricing),
    discountCents: booking.discountCents,
    couponCode: booking.couponCode,
  };
}
