/**
 * Stripe webhook endpoint (Phase 3, Q8) — POST /api/webhooks/stripe
 *
 * Security posture (all mandatory per the security matrix):
 *   1. SIGNATURE VERIFY — the raw request body (never the parsed JSON) is
 *      passed to `stripe.webhooks.constructEvent` with the `stripe-signature`
 *      header and the signing secret. A bad/missing signature → 400, no work.
 *   2. REPLAY GUARD — the event id is INSERTed into `webhook_events` (unique
 *      `eventId`) BEFORE processing. A unique-violation means we already
 *      handled this event → return 200 immediately (idempotent, no re-work).
 *   3. IDEMPOTENT TRANSITIONS — even a first-time event only advances booking
 *      state through status-guarded updates, so a race between two deliveries
 *      still cannot double-confirm or double-release seats.
 *
 * Next 16 App-Router route handler: the raw body is read with `await req.text()`
 * (App Router does not buffer/parse it for us — this is required for the
 * signature to verify).
 */
import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { getStripe, getWebhookSecret, type Stripe } from "@/lib/stripe";
import {
  confirmBookingPaid,
  failAndReleaseBooking,
  findBookingIdByIntent,
  refundBooking,
} from "@/server/booking";

// This route must run on Node (Stripe SDK + Prisma) and never be cached/static.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Register the event id; false means "already processed" (replay). */
async function claimEvent(eventId: string): Promise<boolean> {
  try {
    await db.webhookEvent.create({ data: { eventId, provider: "stripe" } });
    return true;
  } catch (error) {
    // P2002 = unique constraint violation on eventId → replay, already handled.
    if (typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "P2002") {
      return false;
    }
    throw error;
  }
}

async function markProcessed(eventId: string): Promise<void> {
  await db.webhookEvent
    .update({ where: { eventId }, data: { processedAt: new Date() } })
    .catch((error) => logger.warn("webhook processedAt update failed", { eventId, error }));
}

export async function POST(req: Request): Promise<NextResponse> {
  const stripe = await getStripe();
  const webhookSecret = await getWebhookSecret();
  if (!stripe || !webhookSecret) {
    // Payments not configured — acknowledge so Stripe does not retry forever,
    // but do nothing. (In practice Stripe is not sending here if unconfigured.)
    logger.warn("stripe webhook hit but Stripe/webhook secret not configured");
    return NextResponse.json({ received: true, ignored: "unconfigured" }, { status: 200 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  // Raw body — REQUIRED for signature verification (do not JSON.parse first).
  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    logger.warn("stripe webhook signature verification failed", {
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Replay guard: only the first delivery of this event id does work.
  const fresh = await claimEvent(event.id);
  if (!fresh) {
    return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
  }

  try {
    await handleEvent(event);
    await markProcessed(event.id);
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    // Processing failed AFTER we claimed the event. Delete the claim so Stripe's
    // retry can reprocess it (the transitions are idempotent, so reprocessing
    // is safe); then signal failure with 500 to trigger that retry.
    await db.webhookEvent.deleteMany({ where: { eventId: event.id, processedAt: null } }).catch(() => {});
    logger.error("stripe webhook processing failed", {
      eventId: event.id,
      type: event.type,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}

async function handleEvent(event: Stripe.Event): Promise<void> {
  switch (event.type) {
    // `completed` fires for synchronous (card) payments already paid.
    // `async_payment_succeeded` fires later for delayed methods (bank debits)
    // once they clear. Both must confirm the booking, so they share a handler.
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object as Stripe.Checkout.Session;
      // Only finalize once actually paid (a `completed` for an async method can
      // still be unpaid — the matching `async_payment_succeeded` confirms it).
      if (session.payment_status !== "paid") {
        logger.info("checkout session not paid yet", { sessionId: session.id, status: session.payment_status, type: event.type });
        return;
      }
      const bookingId = session.client_reference_id ?? session.metadata?.bookingId ?? null;
      if (!bookingId) {
        logger.warn("checkout.session.completed without bookingId", { sessionId: session.id });
        return;
      }
      await confirmBookingPaid({
        bookingId,
        sessionId: session.id,
        intentId: typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id ?? null,
        amountCents: session.amount_total ?? null,
        raw: (event as unknown as Prisma.InputJsonValue),
      });
      return;
    }

    case "checkout.session.async_payment_failed":
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      const bookingId = session.client_reference_id ?? session.metadata?.bookingId ?? null;
      if (!bookingId) return;
      await failAndReleaseBooking({ bookingId, sessionId: session.id, reason: event.type });
      return;
    }

    case "charge.refunded": {
      const charge = event.data.object as Stripe.Charge;
      const intentId = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id ?? null;
      if (!intentId) return;
      const bookingId = await findBookingIdByIntent(intentId);
      if (!bookingId) {
        logger.warn("charge.refunded for unknown intent", { intentId });
        return;
      }
      await refundBooking({ bookingId, intentId, raw: (event as unknown as Prisma.InputJsonValue) });
      return;
    }

    default:
      // Unhandled event types are acknowledged (claimed + 200) so Stripe stops
      // retrying them; we simply take no action.
      logger.info("unhandled stripe event", { type: event.type });
      return;
  }
}
