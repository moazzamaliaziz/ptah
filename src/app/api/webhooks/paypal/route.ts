/**
 * PayPal webhook endpoint (Wave 2, SP3) — POST /api/webhooks/paypal
 *
 * Same three-layer posture as the Stripe webhook:
 *   1. SIGNATURE VERIFY — the raw body + PayPal transmission headers are sent to
 *      PayPal's verify-webhook-signature API (with the vault webhook id). Not
 *      "SUCCESS" → 400, no work.
 *   2. REPLAY GUARD — the event id is INSERTed into `webhook_events` before
 *      processing; a unique-violation → 200 (already handled).
 *   3. IDEMPOTENT TRANSITIONS — booking state advances only through
 *      status-guarded updates, so redeliveries and the return-route capture can
 *      never double-confirm or double-release.
 */
import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { verifyWebhookSignature, type PaypalWebhookHeaders } from "@/server/payments/paypal";
import {
  confirmPaypalOrder,
  failAndReleaseBooking,
  findBookingIdByIntent,
  refundBooking,
} from "@/server/booking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PaypalEvent {
  id: string;
  event_type: string;
  resource?: {
    id?: string;
    custom_id?: string;
    supplementary_data?: { related_ids?: { order_id?: string } };
    links?: { href?: string; rel?: string }[];
  };
}

async function claimEvent(eventId: string): Promise<boolean> {
  try {
    await db.webhookEvent.create({ data: { eventId, provider: "paypal" } });
    return true;
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && (error as { code?: string }).code === "P2002") {
      return false;
    }
    throw error;
  }
}

async function markProcessed(eventId: string): Promise<void> {
  await db.webhookEvent
    .update({ where: { eventId }, data: { processedAt: new Date() } })
    .catch((error) => logger.warn("paypal webhook processedAt update failed", { eventId, error }));
}

/** Pull the capture id out of a refund resource's `up` link. */
function captureIdFromRefundLinks(links: { href?: string; rel?: string }[] | undefined): string | null {
  const up = links?.find((l) => l.rel === "up" && l.href?.includes("/captures/"));
  if (!up?.href) return null;
  const seg = up.href.split("/captures/")[1];
  return seg ? seg.split(/[/?#]/)[0] : null;
}

export async function POST(req: Request): Promise<NextResponse> {
  const rawBody = await req.text();
  const headers: PaypalWebhookHeaders = {
    transmissionId: req.headers.get("paypal-transmission-id"),
    transmissionTime: req.headers.get("paypal-transmission-time"),
    certUrl: req.headers.get("paypal-cert-url"),
    authAlgo: req.headers.get("paypal-auth-algo"),
    transmissionSig: req.headers.get("paypal-transmission-sig"),
  };

  const verified = await verifyWebhookSignature(headers, rawBody);
  if (!verified) {
    logger.warn("paypal webhook signature verification failed");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: PaypalEvent;
  try {
    event = JSON.parse(rawBody) as PaypalEvent;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (!event.id) {
    return NextResponse.json({ error: "Missing event id" }, { status: 400 });
  }

  const fresh = await claimEvent(event.id);
  if (!fresh) {
    return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
  }

  try {
    await handleEvent(event);
    await markProcessed(event.id);
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    await db.webhookEvent.deleteMany({ where: { eventId: event.id, processedAt: null } }).catch(() => {});
    logger.error("paypal webhook processing failed", {
      eventId: event.id,
      type: event.event_type,
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}

async function handleEvent(event: PaypalEvent): Promise<void> {
  const resource = event.resource ?? {};
  const raw = event as unknown as Prisma.InputJsonValue;

  switch (event.event_type) {
    case "PAYMENT.CAPTURE.COMPLETED": {
      const captureId = resource.id ?? null;
      const orderId = resource.supplementary_data?.related_ids?.order_id ?? null;
      const bookingId = resource.custom_id ?? null;
      if (!orderId && !bookingId) {
        logger.warn("paypal capture completed without order_id or custom_id", { captureId });
        return;
      }
      await confirmPaypalOrder({ orderId, bookingId, captureId, raw });
      return;
    }

    case "PAYMENT.CAPTURE.DENIED":
    case "PAYMENT.CAPTURE.DECLINED": {
      const bookingId = resource.custom_id ?? null;
      const orderId = resource.supplementary_data?.related_ids?.order_id ?? null;
      if (!bookingId) return;
      await failAndReleaseBooking({ bookingId, sessionId: orderId, reason: event.event_type });
      return;
    }

    case "PAYMENT.CAPTURE.REFUNDED": {
      const captureId = captureIdFromRefundLinks(resource.links);
      if (!captureId) {
        logger.warn("paypal refund without resolvable capture id", { eventId: event.id });
        return;
      }
      const bookingId = await findBookingIdByIntent(captureId);
      if (!bookingId) {
        logger.warn("paypal refund for unknown capture", { captureId });
        return;
      }
      await refundBooking({ bookingId, intentId: captureId, raw });
      return;
    }

    default:
      logger.info("unhandled paypal event", { type: event.event_type });
      return;
  }
}
