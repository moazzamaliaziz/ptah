import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import { getBookingOutcome } from "@/server/booking-read";
import { formatPriceCents } from "@/lib/utils";
import { env } from "@/lib/env";

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

  return (
    <Container className="py-16">
      <div className="mx-auto max-w-xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">Almost there</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">Complete your booking by bank transfer</h1>
        <p className="mt-3 text-body text-ink/70">
          We&apos;ve reserved your seats. Transfer the total below quoting your booking reference, and
          we&apos;ll confirm your place as soon as the funds arrive. Nothing has been charged automatically.
        </p>

        <div className="mt-8 rounded-2xl border border-grey-300/60 bg-white p-6">
          <p className="text-[11px] uppercase tracking-wide text-ink/50">Booking reference</p>
          <p className="font-mono text-card-title font-semibold text-ink">{booking.id}</p>
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
              <dt className="text-ink/55">Amount to transfer</dt>
              <dd className="font-bold text-nile">{formatPriceCents(booking.totalCents, booking.currency)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-6 rounded-2xl border border-grey-300/60 bg-papyrus/50 p-6">
          <h2 className="text-card-title font-semibold text-ink">Transfer details</h2>
          {instructions ? (
            <p className="mt-3 whitespace-pre-line text-meta leading-relaxed text-ink/75">{instructions}</p>
          ) : (
            <p className="mt-3 text-meta leading-relaxed text-ink/75">
              Our team will email you the bank account details for this booking shortly. If you don&apos;t
              receive them within one business day,{" "}
              <Link href="/contact" className="font-semibold text-rust hover:underline">
                contact us
              </Link>{" "}
              quoting your booking reference above.
            </p>
          )}
          <p className="mt-4 border-t border-grey-300/50 pt-4 text-[11px] text-ink/50">
            Always include your booking reference <span className="font-mono">{booking.id}</span> so we can
            match your payment. Your seats are held while you arrange the transfer.
          </p>
        </div>

        <div className="mt-8">
          <Link
            href="/tours"
            className="rounded-full bg-nile px-6 py-3 text-btn text-white transition-colors hover:bg-nile/90"
          >
            Browse more tours
          </Link>
        </div>
      </div>
    </Container>
  );
}
