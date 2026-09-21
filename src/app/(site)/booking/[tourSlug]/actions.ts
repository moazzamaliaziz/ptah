"use server";

/**
 * Booking submission (Phase 3). Server Action = CSRF-safe by Next's same-origin
 * + encrypted-action-id design. Rate-limited per IP.
 *
 * Flow: validate → atomically claim seats (creates PENDING_PAYMENT booking) →
 * start Stripe Checkout → redirect the browser to Stripe. On payments-
 * unavailable the booking is still created (staff can follow up) and the user
 * is sent to a "we'll contact you" state. `redirect()` throws by design, so it
 * is called OUTSIDE the try/catch.
 */
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/client-ip";
import { logger } from "@/lib/logger";
import { createPendingBooking, startStripeCheckout } from "@/server/booking";

export interface BookingFormState {
  error: string | null;
}

export async function submitBookingAction(
  _prev: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const h = await headers();
  const ip = getClientIp(h);

  // Per-IP throttle: 8 booking attempts / minute (each is a seat claim + Stripe call).
  if (!checkRateLimit(`booking:${ip}`, 8, 60_000).allowed) {
    return { error: "Too many attempts. Please wait a minute and try again." };
  }

  const raw = {
    departureId: formData.get("departureId"),
    seats: formData.get("seats"),
    contact: {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      notes: formData.get("notes") || undefined,
    },
  };

  const booking = await createPendingBooking(raw);
  if (!booking.ok) {
    return { error: booking.message };
  }

  const checkout = await startStripeCheckout(booking.bookingId);
  if (!checkout.ok) {
    if (checkout.reason === "PAYMENTS_UNAVAILABLE") {
      // Booking is held (PENDING_PAYMENT). Send them to a manual-follow-up state.
      redirect(`/booking/pending?booking=${booking.bookingId}`);
    }
    logger.error("checkout start failed after booking", { bookingId: booking.bookingId, reason: checkout.reason });
    return { error: checkout.message };
  }

  // Off to Stripe's hosted checkout page.
  redirect(checkout.url);
}
