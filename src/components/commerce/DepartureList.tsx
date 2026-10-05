import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import type { DepartureView } from "@/server/catalog";
import type { PageContent } from "@/i18n/pages/en";
import { formatPriceCents } from "@/lib/utils";

type DepartureLabels = PageContent["tourDetail"]["departureList"];

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** How urgent the seat count reads. Low stock nudges without false scarcity. */
function seatsLabel(
  remaining: number,
  labels: DepartureLabels,
): { text: string; tone: "ok" | "low" | "none" } {
  if (remaining <= 0) return { text: labels.soldOut, tone: "none" };
  if (remaining <= 3) return { text: labels.onlyLeft.replace("{count}", String(remaining)), tone: "low" };
  return { text: labels.seatsLeft.replace("{count}", String(remaining)), tone: "ok" };
}

/**
 * Departure availability list (Phase 3). Each open, in-stock departure links to
 * the booking flow with the departure preselected. Sold-out rows are shown
 * disabled (honest availability, not hidden).
 */
export default function DepartureList({
  tourSlug,
  departures,
  labels,
  bookingClosed,
  onRequestDates,
}: {
  tourSlug: string;
  departures: DepartureView[];
  labels: DepartureLabels;
  /** When true, online booking is paused tour-wide — every row is disabled. */
  bookingClosed?: boolean;
  /** P8: the tour runs on the traveler's own dates, so the real answer to
   *  "when can I go?" is the calendar in the funnel, not this list. */
  onRequestDates?: boolean;
}) {
  // An on-request tour leads with the calendar invitation. Any scheduled
  // departures still list below it — a fixed date with seats held is useful
  // information, and some travelers would rather join one than name a day.
  const onRequestCard =
    onRequestDates && !bookingClosed ? (
      <div className="rounded-xl border border-nile/30 bg-nile/5 p-5">
        <p className="text-card-title font-semibold text-ink">{labels.onRequestTitle}</p>
        <p className="mt-1 text-body text-ink/70">{labels.onRequestBody}</p>
        <Link
          href={`/booking/${tourSlug}`}
          className="mt-4 inline-block rounded-full bg-nile px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-nile/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nile"
        >
          {labels.onRequestCta}
        </Link>
      </div>
    ) : null;

  if (departures.length === 0) {
    return (
      onRequestCard ?? (
        <p className="rounded-xl border border-grey-300/60 bg-papyrus/50 p-5 text-body text-ink/70">
          {labels.empty}
        </p>
      )
    );
  }

  return (
    <>
      {onRequestCard}
      {onRequestCard && (
        <p className="mt-4 mb-2 text-meta text-ink/55">{labels.onRequestAlso}</p>
      )}
      <ul className="space-y-3">
      {departures.map((d) => {
        const seats = seatsLabel(d.remainingCapacity, labels);
        const bookable = !d.soldOut && !bookingClosed;
        return (
          <li
            key={d.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-grey-300/60 bg-white p-4"
          >
            <div>
              <p className="font-semibold text-ink">{formatDate(d.startDate)}</p>
              <p className="text-meta text-ink/55">
                {labels.toPrefix} {formatDate(d.endDate)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-nile">
                {formatPriceCents(d.priceCents, d.currency)}
                <span className="text-[11px] font-normal text-ink/50"> {labels.perPerson}</span>
              </p>
              <p
                className={
                  seats.tone === "none"
                    ? "text-meta text-ink/45"
                    : seats.tone === "low"
                      ? "text-meta font-semibold text-rust"
                      : "text-meta text-ink/60"
                }
              >
                {seats.text}
              </p>
            </div>

            {bookable ? (
              <Link
                href={`/booking/${tourSlug}?departure=${d.id}`}
                className="rounded-full bg-nile px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-nile/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nile"
              >
                {labels.bookThisDate}
              </Link>
            ) : (
              <span className="rounded-full border border-grey-300 px-5 py-2.5 text-[13px] font-semibold text-ink/40">
                {d.soldOut ? labels.soldOut : labels.bookingPaused}
              </span>
            )}
          </li>
        );
      })}
      </ul>
    </>
  );
}
