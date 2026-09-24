import { headers } from "next/headers";
import { renderToBuffer } from "@react-pdf/renderer";
import { getBookingOutcome, lookupBooking } from "@/server/booking-read";
import { VoucherDocument, type VoucherData } from "@/components/pdf/VoucherDocument";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/client-ip";

/**
 * Server-generated booking voucher PDF (item #3, customer side).
 *
 * GET  /booking/voucher/<id>              — id-addressable surfaces (booking
 *   success / pending / bank-transfer). Uses getBookingOutcome(id), which masks
 *   the email. Those pages are already reachable by the booking id (a UUIDv4)
 *   alone, so an id-keyed PDF that shows the same masked fields matches the
 *   existing exposure and needs no extra proof.
 *
 * POST /booking/voucher/<ref>  (body: email)  — the track-booking surface. Uses
 *   lookupBooking(ref, email), which requires BOTH the reference AND a matching
 *   contact email (returns a uniform null otherwise), exactly like the
 *   /track-booking lookup. The download therefore carries the same proof and
 *   never exposes a booking by id alone from that surface. Rate-limited per IP
 *   so it can't be used as an unthrottled parallel brute-force channel that
 *   would weaken the track lookup's existing protection. The email stays in the
 *   POST body, never the URL.
 *
 * No customer name appears: neither read helper exposes one and none of the four
 * pages render it, so emitting it would widen exposure beyond today's surfaces.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function filenameFor(reference: string): string {
  const safe = reference.replace(/[^a-zA-Z0-9._-]/g, "") || "booking";
  return `ptah-voucher-${safe}.pdf`;
}

async function pdfResponse(data: VoucherData): Promise<Response> {
  const buffer = await renderToBuffer(VoucherDocument(data));
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filenameFor(data.reference)}"`,
      "Cache-Control": "no-store",
    },
  });
}

const notFound = () => new Response("Not found", { status: 404 });

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Rendering a PDF is CPU-heavy. Even though the id is a non-enumerable UUIDv4,
  // throttle per IP so this GET can't be used as an unmetered render-cost channel.
  const ip = getClientIp(await headers());
  const limit = await checkRateLimit(`voucher-pdf:${ip}`, 12, 60_000);
  if (!limit.allowed) return new Response("Too many requests", { status: 429 });

  const booking = await getBookingOutcome(id);
  if (!booking) return notFound();

  return pdfResponse({
    reference: booking.id,
    status: booking.status,
    tourTitle: booking.tourTitle,
    startDate: booking.startDate,
    endDate: booking.endDate,
    seats: booking.seats,
    totalCents: booking.totalCents,
    currency: booking.currency,
    contactEmailMasked: booking.contactEmailMasked,
    pricing: booking.pricing,
    discountCents: booking.discountCents,
    couponCode: booking.couponCode,
  });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const ip = getClientIp(await headers());
  const limit = await checkRateLimit(`voucher-track:${ip}`, 12, 60_000);
  if (!limit.allowed) return new Response("Too many requests", { status: 429 });

  const form = await req.formData();
  const email = form.get("email");
  if (typeof email !== "string" || !email.trim()) return notFound();

  const booking = await lookupBooking(id, email);
  if (!booking) return notFound();

  return pdfResponse({
    reference: booking.reference,
    status: booking.status,
    tourTitle: booking.tourTitle,
    startDate: booking.startDate,
    endDate: booking.endDate,
    seats: booking.seats,
    totalCents: booking.totalCents,
    currency: booking.currency,
    // The track-booking surface never shows an email; keep the PDF identical.
    contactEmailMasked: null,
    pricing: booking.pricing,
    discountCents: booking.discountCents,
    couponCode: booking.couponCode,
  });
}
