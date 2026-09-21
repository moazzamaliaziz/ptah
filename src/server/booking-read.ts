/**
 * Booking read helpers for the customer-facing outcome pages (Phase 3).
 * Server-only. Returns just what the success/cancelled/pending pages render —
 * never the full contactInfo blob or payment internals.
 */
import "server-only";
import { db } from "@/lib/db";

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
      departure: {
        select: { startDate: true, endDate: true, tour: { select: { title: true, slug: true } } },
      },
    },
  });
  if (!booking) return null;

  const contactEmail =
    booking.guestEmail ??
    (booking.contactInfo && typeof booking.contactInfo === "object" && "email" in booking.contactInfo
      ? String((booking.contactInfo as Record<string, unknown>).email)
      : null);

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
    contactEmailMasked: maskEmail(contactEmail),
  };
}
