import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { notFound, redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import { getBookingOutcome } from "@/server/booking-read";
import { formatPriceCents } from "@/lib/utils";
import { getPageContent } from "@/i18n/pages";

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
  const pc = await getPageContent();
  const t = pc.bookingPending;

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-section-h2 font-bold text-ink">{t.heading}</h1>
        <p className="mt-3 text-body text-ink/70">
          {t.body}
        </p>

        <div className="mt-8 rounded-2xl border border-grey-300/60 bg-white p-6 text-left">
          <p className="text-[11px] uppercase tracking-wide text-ink/50">{t.requestReferenceLabel}</p>
          <p className="font-mono text-meta text-ink">{booking.id}</p>
          <dl className="mt-4 space-y-2.5 border-t border-grey-300/50 pt-4 text-meta">
            <div className="flex justify-between gap-4">
              <dt className="text-ink/55">{t.tourLabel}</dt>
              <dd className="text-right font-semibold text-ink">{booking.tourTitle}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink/55">{t.departureLabel}</dt>
              <dd className="text-right text-ink">{fmtDate(booking.startDate)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink/55">{t.travelersLabel}</dt>
              <dd className="text-ink">{booking.seats}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink/55">{t.estimatedTotalLabel}</dt>
              <dd className="font-bold text-nile">{formatPriceCents(booking.totalCents, booking.currency)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={`/booking/voucher/${booking.id}`}
            download
            className="inline-flex items-center gap-2 rounded-full bg-nile px-6 py-3 text-btn text-white transition-colors hover:bg-nile/90"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t.downloadVoucher}
          </a>
          <Link href="/tours" className="rounded-full border border-nile/25 px-6 py-3 text-btn text-nile transition-colors hover:border-nile">
            {t.browseMoreTours}
          </Link>
        </div>
      </div>
    </Container>
  );
}
