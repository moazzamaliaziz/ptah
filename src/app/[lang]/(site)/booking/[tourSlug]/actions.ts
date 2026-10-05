"use server";

/**
 * Booking submission (Phase 3). Server Action = CSRF-safe by Next's same-origin
 * + encrypted-action-id design. Rate-limited per IP.
 *
 * Flow: validate → atomically claim seats (creates PENDING_PAYMENT booking) →
 * start the chosen payment method — Stripe/PayPal hosted checkout (redirect to
 * the gateway) or offline bank transfer (redirect to instructions). On payments-
 * unavailable the booking is still created (staff can follow up) and the user
 * is sent to a "we'll contact you" state. `redirect()` throws by design, so it
 * is called OUTSIDE the try/catch.
 */
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/client-ip";
import { logger } from "@/lib/logger";
import { localizePath } from "@/i18n/routing";
import { toLocale } from "@/i18n/config";
import {
  createPendingBooking,
  startStripeCheckout,
  startPaypalCheckout,
  startBankTransfer,
  validateCoupon,
  type CheckoutResult,
  type CouponPreview,
} from "@/server/booking";

export interface BookingFormState {
  error: string | null;
}

/** Args for the live discount-code preview (mirrors validateCouponSchema).
 *  The date arrives either as a scheduled `departureId` or, when the traveler
 *  picked their own day, as `tourSlug` + `departureDate` (P8). */
export interface CouponPreviewInput {
  code: string;
  departureId?: string;
  tourSlug?: string;
  departureDate?: string;
  adults: number;
  children: number;
  infants: number;
}

/**
 * Live-preview a discount code from the booking form WITHOUT reserving anything.
 * Thin server-action wrapper over `validateCoupon`, with a light per-IP throttle
 * to blunt code enumeration. The authoritative check still runs atomically when
 * the booking is submitted, so a stale preview can never over-discount a charge.
 */
export async function previewCouponAction(input: CouponPreviewInput): Promise<CouponPreview> {
  const h = await headers();
  const ip = getClientIp(h);
  if (!(await checkRateLimit(`coupon:${ip}`, 20, 60_000)).allowed) {
    return { ok: false, message: "Too many attempts. Please wait a minute and try again." };
  }
  return validateCoupon(input);
}

type PaymentMethod = "stripe" | "paypal" | "bank_transfer";

function parseMethod(value: FormDataEntryValue | null): PaymentMethod {
  return value === "paypal" || value === "bank_transfer" ? value : "stripe";
}

export async function submitBookingAction(
  _prev: BookingFormState,
  formData: FormData,
): Promise<BookingFormState> {
  const h = await headers();
  const ip = getClientIp(h);

  // Per-IP throttle: 8 booking attempts / minute (each is a seat claim + gateway call).
  if (!(await checkRateLimit(`booking:${ip}`, 8, 60_000)).allowed) {
    return { error: "Too many attempts. Please wait a minute and try again." };
  }

  const method = parseMethod(formData.get("method"));
  // Active public-site locale (hidden field submitted by BookingForm) so the
  // post-booking redirects land on the localized funnel pages / checkout return.
  const rawLang = formData.get("lang");
  const locale = toLocale(typeof rawLang === "string" ? rawLang : null);
  const raw = {
    // P8: the funnel posts EITHER a scheduled departure id, or the tour slug
    // plus the date the traveler picked on the calendar. The service layer
    // narrows the pair and re-checks the date against the tour's own window —
    // the calendar's disabled days are a courtesy, not the guard.
    departureId: formData.get("departureId"),
    tourSlug: formData.get("tourSlug"),
    departureDate: formData.get("departureDate"),
    adults: formData.get("adults"),
    children: formData.get("children"),
    infants: formData.get("infants"),
    // P5 discount code (optional). Empty string → no coupon; booking-core
    // re-validates and applies it atomically inside the seat-claim transaction.
    coupon: formData.get("coupon") || undefined,
    contact: {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      notes: formData.get("notes") || undefined,
      pickup: formData.get("pickup") || undefined,
      billing: {
        line1: formData.get("billingLine1"),
        line2: formData.get("billingLine2") || undefined,
        city: formData.get("billingCity"),
        region: formData.get("billingRegion"),
        postalCode: formData.get("billingPostalCode"),
        country: formData.get("billingCountry"),
      },
    },
  };

  const booking = await createPendingBooking(raw);
  if (!booking.ok) {
    return {
      error:
        booking.message ||
        "We couldn't start your booking. Please check your details and try again.",
    };
  }

  // Offline bank transfer: hold the booking, show instructions + reference.
  if (method === "bank_transfer") {
    const bank = await startBankTransfer(booking.bookingId);
    if (!bank.ok) {
      // Method unavailable — fall back to the manual-follow-up state.
      redirect(`${localizePath("/booking/pending", locale)}?booking=${booking.bookingId}`);
    }
    redirect(`${localizePath("/booking/bank-transfer", locale)}?booking=${booking.bookingId}`);
  }

  // Online: redirect the browser to the gateway's hosted page.
  //
  // Last line of defence. By this point the booking EXISTS and its seats are
  // claimed, so an exception escaping here would show the generic error page to
  // a customer who has a held booking and no reference for it. Only the gateway
  // call is wrapped — `redirect()` throws by design and must stay outside.
  let checkout: CheckoutResult;
  try {
    checkout =
      method === "paypal"
        ? await startPaypalCheckout(booking.bookingId, locale)
        : await startStripeCheckout(booking.bookingId, locale);
  } catch (error) {
    logger.error("checkout start threw after booking", { bookingId: booking.bookingId, method, error });
    checkout = {
      ok: false,
      reason: "GATEWAY_ERROR",
      message:
        "We couldn't reach the payment provider. Your seats are held — please try again, or contact us quoting your booking reference.",
    };
  }

  if (!checkout.ok) {
    if (checkout.reason === "PAYMENTS_UNAVAILABLE") {
      // Booking is held (PENDING_PAYMENT). Send them to a manual-follow-up state.
      redirect(`${localizePath("/booking/pending", locale)}?booking=${booking.bookingId}`);
    }
    logger.error("checkout start failed after booking", { bookingId: booking.bookingId, method, reason: checkout.reason });
    return {
      error:
        checkout.message ||
        "We couldn't start payment just now. Your seats are held — please try again or contact us.",
    };
  }

  redirect(checkout.url);
}
