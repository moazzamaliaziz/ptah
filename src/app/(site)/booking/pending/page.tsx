import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import { getBookingOutcome } from "@/server/booking-read";
import { formatPriceCents } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Booking request received | Ptah Tours",
  robots: { index: false, follow: false },
};

function fmtDate(d: Date): string {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(d);
}

/**
 * Shown when a booking was created but online payment is unavailable (Stripe not
 * configured/enabled). The seats are held (PENDING_PAYMENT) and staff follow up.
 */
export default async function BookingPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ booking?: string }>;
}) {
  const { booking: bookingId } = await searchParams;
  if (!bookingId) redirect("/");
  const booking = await getBookingOutcome(bookingId);
  if (!booking) notFound();

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-section-h2 font-bold text-ink">Booking request received</h1>
        <p className="mt-3 text-body text-ink/70">
          We&apos;ve reserved your seats and our team will be in touch to arrange secure payment.
          Nothing has been charged yet — quote the request reference below when you contact us.
        </p>

        <div className="mt-8 rounded-2xl border border-grey-300/60 bg-white p-6 text-left">
          <p className="text-[11px] uppercase tracking-wide text-ink/50">Request reference</p>
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
              <dt className="text-ink/55">Travelers</dt>
              <dd className="text-ink">{booking.seats}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink/55">Estimated total</dt>
              <dd className="font-bold text-nile">{formatPriceCents(booking.totalCents, booking.currency)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8">
          <Link href="/tours" className="rounded-full bg-nile px-6 py-3 text-btn text-white transition-colors hover:bg-nile/90">
            Browse more tours
          </Link>
        </div>
      </div>
    </Container>
  );
}
