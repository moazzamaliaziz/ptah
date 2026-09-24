import { renderToBuffer } from "@react-pdf/renderer";
import { requireCapability } from "@/server/auth/rbac";
import { getBookingForAdmin } from "@/server/admin/orders-admin";
import { InvoiceDocument, type InvoiceData } from "@/components/pdf/InvoiceDocument";

/**
 * Staff-only invoice PDF for one booking (item #11, Phase 2).
 *
 * GET /admin/bookings/<id>/invoice — gated by bookings.view (requireCapability
 * redirects non-staff to login/forbidden). Unlike the customer voucher this
 * shows full, unmasked billing details, so the capability gate is load-bearing.
 * Sits under the (protected) route group but route handlers get no layout, so
 * the guard is repeated here.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function filenameFor(reference: string): string {
  const safe = reference.replace(/[^a-zA-Z0-9._-]/g, "") || "booking";
  return `ptah-invoice-${safe}.pdf`;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await requireCapability("bookings.view");
  const { id } = await params;
  const booking = await getBookingForAdmin(id);
  if (!booking) return new Response("Not found", { status: 404 });

  const data: InvoiceData = {
    reference: booking.id,
    status: booking.status,
    issuedAt: booking.createdAt,
    tourTitle: booking.tourTitle,
    startDate: booking.startDate,
    endDate: booking.endDate,
    seats: booking.seats,
    totalCents: booking.totalCents,
    currency: booking.currency,
    customerName: booking.contactName,
    customerEmail: booking.contactEmail,
    customerPhone: booking.contactPhone,
    billing: booking.billing,
    pricing: booking.pricing,
    discountCents: booking.discountCents,
    couponCode: booking.couponCode,
    originCountry: booking.originCountry,
    payments: booking.payments.map((p) => ({
      method: p.method,
      status: p.status,
      amountCents: p.amountCents,
      currency: p.currency,
      reference: p.intentId ?? p.sessionId ?? p.reference,
      createdAt: p.createdAt,
    })),
  };

  const buffer = await renderToBuffer(InvoiceDocument(data));
  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filenameFor(booking.id)}"`,
      "Cache-Control": "no-store",
    },
  });
}
