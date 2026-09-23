import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import PrintButton from "@/components/site/PrintButton";
import { getBookingOutcome } from "@/server/booking-read";
import { formatPriceCents } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Booking confirmed | Ptah Tours",
  robots: { index: false, follow: false },
};

function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(d);
}

const STATUS_CHIP: Record<string, { label: string; className: string }> = {
  CONFIRMED: { label: "Confirmed", className: "bg-nile/10 text-nile ring-nile/20" },
  PENDING_PAYMENT: { label: "Pending payment", className: "bg-gold/10 text-rust ring-gold/30" },
  REFUNDED: { label: "Refunded", className: "bg-grey-300/25 text-ink/70 ring-grey-300/70" },
  CANCELLED: { label: "Cancelled", className: "bg-grey-300/25 text-ink/70 ring-grey-300/70" },
  FAILED: { label: "Payment failed", className: "bg-grey-300/25 text-ink/70 ring-grey-300/70" },
};

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ booking?: string }>;
}) {
  const { booking: bookingId } = await searchParams;
  if (!bookingId) redirect("/");
  const booking = await getBookingOutcome(bookingId);
  if (!booking) notFound();

  // At success-redirect time the webhook may not have flipped the status yet.
  const confirmed = booking.status === "CONFIRMED";
  const chip = STATUS_CHIP[booking.status] ?? STATUS_CHIP.PENDING_PAYMENT;

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-xl">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-nile/10">
            <svg viewBox="0 0 24 24" className="h-7 w-7 text-nile" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="mt-6 text-section-h2 font-bold text-ink">
            {confirmed ? "You're booked!" : "Payment received"}
          </h1>
          <p className="mt-3 text-body text-ink/70">
            {confirmed
              ? "Your booking is confirmed. Keep this receipt — you'll need the reference to manage or track your trip."
              : "Thanks — your payment went through. We're finalizing your confirmation now. Keep this receipt handy."}
          </p>
        </div>
        {/* __RECEIPT__ */}
        <div className="print-receipt mt-8 overflow-hidden rounded-2xl border border-grey-300/60 bg-white text-left">
          <div className="flex items-center justify-between gap-4 border-b border-grey-300/50 bg-papyrus/40 px-6 py-4">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-nile">Ptah Tours</p>
              <p className="text-[11px] uppercase tracking-wide text-ink/50">Booking receipt</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-[12px] font-semibold ring-1 ring-inset ${chip.className}`}>
              {chip.label}
            </span>
          </div>

          <div className="px-6 py-5">
            <p className="text-[11px] uppercase tracking-wide text-ink/50">Booking reference</p>
            <p className="font-mono text-meta text-ink">{booking.id}</p>

            <dl className="mt-4 space-y-2.5 border-t border-grey-300/50 pt-4 text-meta">
              <div className="flex justify-between gap-4">
                <dt className="text-ink/55">Tour</dt>
                <dd className="text-right font-semibold text-ink">{booking.tourTitle}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink/55">Departure</dt>
                <dd className="text-right text-ink">{fmtDate(booking.startDate)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink/55">Returns</dt>
                <dd className="text-right text-ink">{fmtDate(booking.endDate)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink/55">Travelers</dt>
                <dd className="text-ink">{booking.seats}</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-grey-300/50 pt-2.5">
                <dt className="font-semibold text-ink">Total {confirmed ? "paid" : "due"}</dt>
                <dd className="font-bold text-nile">{formatPriceCents(booking.totalCents, booking.currency)}</dd>
              </div>
              {booking.contactEmailMasked ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/55">Confirmation to</dt>
                  <dd className="text-right text-ink">{booking.contactEmailMasked}</dd>
                </div>
              ) : null}
            </dl>
          </div>

          <p className="border-t border-grey-300/50 px-6 py-3 text-[12px] text-ink/55">
            Thank you for booking with Ptah Tours. Questions about your trip?{" "}
            <Link href="/contact" className="font-semibold text-nile underline-offset-2 hover:underline">
              Contact us
            </Link>{" "}
            and quote your booking reference.
          </p>
        </div>
        {/* __ACTIONS__ */}
        <div className="no-print mt-8 flex flex-wrap justify-center gap-3">
          <PrintButton className="inline-flex items-center gap-2 rounded-full bg-nile px-6 py-3 text-btn text-white transition-colors hover:bg-nile/90">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Download PDF
          </PrintButton>
          <Link
            href={`/track-booking?ref=${encodeURIComponent(booking.id)}`}
            className="rounded-full border border-nile/25 px-6 py-3 text-btn text-nile transition-colors hover:border-nile"
          >
            Track this booking
          </Link>
          <Link
            href={`/tours/${booking.tourSlug}`}
            className="rounded-full border border-nile/25 px-6 py-3 text-btn text-nile transition-colors hover:border-nile"
          >
            View this tour
          </Link>
        </div>
      </div>
    </Container>
  );
}
