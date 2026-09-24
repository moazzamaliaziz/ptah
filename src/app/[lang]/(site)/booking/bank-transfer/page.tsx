import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { notFound, redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import { getBookingOutcome } from "@/server/booking-read";
import { formatPriceCents } from "@/lib/utils";
import { env } from "@/lib/env";
import { getPageContent } from "@/i18n/pages";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Complete your booking by bank transfer | Ptah Tours",
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

/**
 * Offline bank-transfer instructions. The booking is held (PENDING_PAYMENT); the
 * customer transfers the funds quoting the reference, and staff confirm it in
 * the Orders panel on receipt. Instructions come from BANK_TRANSFER_INSTRUCTIONS
 * — never fabricated. If unset, the customer is told the details will be emailed.
 */
export default async function BankTransferPage({
  searchParams,
}: {
  searchParams: Promise<{ booking?: string }>;
}) {
  const { booking: bookingId } = await searchParams;
  // No reference at all → the user landed here without booking; send them home
  // (a redirect is a clean 307, unlike notFound() on a streamed dynamic page,
  // which flushes a 200 shell before the 404 can take effect).
  if (!bookingId) redirect("/");
  const booking = await getBookingOutcome(bookingId);
  if (!booking) notFound();

  const instructions = env.BANK_TRANSFER_INSTRUCTIONS?.trim();
  const pc = await getPageContent();
  const t = pc.bookingBankTransfer;

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">{t.eyebrow}</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">{t.heading}</h1>
        <p className="mt-3 text-body text-ink/70">
          {t.intro}
        </p>

        <div className="mt-8 rounded-2xl border border-grey-300/60 bg-white p-6">
          <p className="text-[11px] uppercase tracking-wide text-ink/50">{t.referenceLabel}</p>
          <p className="font-mono text-card-title font-semibold text-ink">{booking.id}</p>
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
              <dt className="text-ink/55">{t.amountToTransferLabel}</dt>
              <dd className="font-bold text-nile">{formatPriceCents(booking.totalCents, booking.currency)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 rounded-2xl border border-grey-300/60 bg-papyrus/50 p-6">
          <h2 className="text-card-title font-semibold text-ink">{t.transferDetailsHeading}</h2>
          {instructions ? (
            <p className="mt-3 whitespace-pre-line text-meta leading-relaxed text-ink/75">{instructions}</p>
          ) : (
            <p className="mt-3 text-meta leading-relaxed text-ink/75">
              {t.noInstructionsPre}{" "}
              <Link href="/contact" className="font-semibold text-rust hover:underline">
                {t.noInstructionsLink}
              </Link>{" "}
              {t.noInstructionsPost}
            </p>
          )}
          <p className="mt-4 border-t border-grey-300/50 pt-4 text-[11px] text-ink/50">
            {t.reminderPre} <span className="font-mono">{booking.id}</span> {t.reminderPost}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
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
          <Link
            href="/tours"
            className="rounded-full border border-nile/25 px-6 py-3 text-btn text-nile transition-colors hover:border-nile"
          >
            {t.browseMoreTours}
          </Link>
        </div>
      </div>
    </Container>
  );
}
