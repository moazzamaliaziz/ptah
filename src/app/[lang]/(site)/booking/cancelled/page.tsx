import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import { getBookingOutcome } from "@/server/booking-read";
import { getPageContent } from "@/i18n/pages";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Checkout cancelled | Ptah Tours",
  robots: { index: false, follow: false },
};

export default async function BookingCancelledPage({
  searchParams,
}: {
  searchParams: Promise<{ booking?: string }>;
}) {
  const { booking: bookingId } = await searchParams;
  const booking = bookingId ? await getBookingOutcome(bookingId) : null;
  if (bookingId && !booking) notFound();
  const pc = await getPageContent();
  const t = pc.bookingCancelled;

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-xl text-center">
        <h1 className="text-section-h2 font-bold text-ink">{t.heading}</h1>
        <p className="mt-3 text-body text-ink/70">
          {t.body}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {booking ? (
            <Link
              href={`/booking/${booking.tourSlug}`}
              className="rounded-full bg-nile px-6 py-3 text-btn text-white transition-colors hover:bg-nile/90"
            >
              {t.tryAgain}
            </Link>
          ) : (
            <Link href="/tours" className="rounded-full bg-nile px-6 py-3 text-btn text-white transition-colors hover:bg-nile/90">
              {t.browseTours}
            </Link>
          )}
          <Link href="/contact" className="rounded-full border border-nile/25 px-6 py-3 text-btn text-nile transition-colors hover:border-nile">
            {t.needHelp}
          </Link>
        </div>
      </div>
    </Container>
  );
}
