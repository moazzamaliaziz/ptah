"use server";

/**
 * Public "track my booking" lookup (item #7). A traveler proves ownership with
 * their booking reference AND the email they booked with; we then show the live
 * order status (synced with what admins set via setBookingStatus). Rate-limited
 * per IP so the reference space can't be brute-forced. No PII beyond what the
 * booker already knows is returned.
 */
import { headers } from "next/headers";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/client-ip";
import { formatPriceCents } from "@/lib/utils";
import { lookupBooking } from "@/server/booking-read";

export interface TrackedBooking {
  reference: string;
  statusKey: string;
  statusLabel: string;
  statusHint: string;
  tone: "ok" | "gold" | "off";
  tourTitle: string;
  tourSlug: string;
  departure: string;
  seats: number;
  total: string;
  bookedOn: string;
}

export type TrackState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "found"; booking: TrackedBooking };

const schema = z.object({
  reference: z.string().trim().min(1).max(64),
  email: z.string().trim().email().max(255),
});

const STATUS_VIEW: Record<
  string,
  { label: string; hint: string; tone: "ok" | "gold" | "off" }
> = {
  PENDING_PAYMENT: {
    label: "Pending payment",
    hint: "We're waiting for your payment to clear. As soon as it does, your booking is confirmed automatically.",
    tone: "gold",
  },
  CONFIRMED: {
    label: "Confirmed",
    hint: "You're all set — your seats are booked. We look forward to hosting you!",
    tone: "ok",
  },
  CANCELLED: {
    label: "Cancelled",
    hint: "This booking was cancelled and the seats released. Please contact us if you think this is a mistake.",
    tone: "off",
  },
  REFUNDED: {
    label: "Refunded",
    hint: "This booking was refunded. The amount is returned to your original payment method.",
    tone: "off",
  },
  FAILED: {
    label: "Payment failed",
    hint: "The payment didn't go through, so this booking wasn't completed. You're welcome to book again anytime.",
    tone: "off",
  },
};

function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(d);
}
// __TRACK_ACTION__

export async function trackBookingAction(
  _prev: TrackState,
  formData: FormData,
): Promise<TrackState> {
  const h = await headers();
  const ip = getClientIp(h);
  // 12 lookups / minute / IP — enough for a fat-fingered traveler, far too few
  // to sweep the UUID reference space.
  if (!(await checkRateLimit(`track-booking:${ip}`, 12, 60_000)).allowed) {
    return { status: "error", message: "Too many attempts. Please wait a minute and try again." };
  }

  const parsed = schema.safeParse({
    reference: formData.get("reference"),
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Enter both your booking reference and the email you used to book.",
    };
  }

  const booking = await lookupBooking(parsed.data.reference, parsed.data.email);
  if (!booking) {
    // Uniform not-found — never reveals whether the reference alone exists.
    return {
      status: "error",
      message: "We couldn't find a booking with that reference and email. Please check both and try again.",
    };
  }

  const view = STATUS_VIEW[booking.status] ?? {
    label: booking.status,
    hint: "",
    tone: "off" as const,
  };
  return {
    status: "found",
    booking: {
      reference: booking.reference,
      statusKey: booking.status,
      statusLabel: view.label,
      statusHint: view.hint,
      tone: view.tone,
      tourTitle: booking.tourTitle,
      tourSlug: booking.tourSlug,
      departure: fmtDate(booking.startDate),
      seats: booking.seats,
      total: formatPriceCents(booking.totalCents, booking.currency),
      bookedOn: fmtDate(booking.createdAt),
    },
  };
}
