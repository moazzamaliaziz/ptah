/**
 * PayPal return handler (Wave 2, SP3) — GET /booking/paypal-return
 *
 * PayPal redirects the buyer here after approval, appending `?token=<orderId>`
 * (and our own `?booking=<id>`). We capture the order server-side, confirm the
 * booking, and redirect to the success or cancelled page. The PayPal webhook is
 * the idempotent safety net if the buyer closes the tab before this runs.
 */
import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { capturePaypalReturn } from "@/server/booking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<NextResponse> {
  const url = new URL(req.url);
  const orderId = url.searchParams.get("token");
  const bookingParam = url.searchParams.get("booking");
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

  if (!orderId) {
    return NextResponse.redirect(
      `${base}/booking/cancelled${bookingParam ? `?booking=${bookingParam}` : ""}`,
    );
  }

  try {
    const result = await capturePaypalReturn(orderId);
    const bookingId = result.bookingId ?? bookingParam;
    if (result.ok && bookingId) {
      return NextResponse.redirect(`${base}/booking/success?booking=${bookingId}`);
    }
    return NextResponse.redirect(`${base}/booking/cancelled${bookingId ? `?booking=${bookingId}` : ""}`);
  } catch (error) {
    logger.error("paypal return capture failed", { orderId, error });
    return NextResponse.redirect(
      `${base}/booking/cancelled${bookingParam ? `?booking=${bookingParam}` : ""}`,
    );
  }
}
