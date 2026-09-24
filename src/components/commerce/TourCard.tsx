import Image from "next/image";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import type { TourListItem } from "@/server/catalog";
import { formatPriceCents } from "@/lib/utils";
import WishlistButton from "@/components/account/WishlistButton";

const DIFFICULTY_LABEL: Record<string, string> = {
  EASY: "Easy",
  MODERATE: "Moderate",
  CHALLENGING: "Challenging",
};

function formatDepartureDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/**
 * Catalog card (Phase 3, token-styled). Presentational: takes a plain
 * TourListItem view-model, no data fetching. Whole card is the tour link.
 */
export default function TourCard({
  tour,
  isAuthenticated = false,
}: {
  tour: TourListItem;
  isAuthenticated?: boolean;
}) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-grey-300/60 bg-white transition-shadow duration-200 hover:shadow-[0_18px_44px_-24px_rgba(26,35,64,0.45)] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-nile">
      <div className="relative aspect-[3/2] w-full overflow-hidden bg-papyrus">
        {tour.heroImage ? (
          <Image
            src={tour.heroImage}
            alt={tour.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-meta text-nile/40">
            {tour.destinations[0] ?? "Egypt"}
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-nile/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
          {tour.durationDays} {tour.durationDays === 1 ? "day" : "days"}
        </span>
        {/* Wishlist toggle — sibling of the card link (a <button> can't nest in <a>). */}
        <div className="absolute right-3 top-3 z-10">
          <WishlistButton slug={tour.slug} isAuthenticated={isAuthenticated} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        {tour.destinations.length > 0 && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-rust">
            {tour.destinations.join(" · ")}
          </p>
        )}
        {/* Card link spans the whole card via ::after; the wishlist button sits above it (z-10). */}
        <h3 className="mt-1.5 text-trip-h3 font-semibold text-ink transition-colors group-hover:text-rust">
          <Link
            href={`/tours/${tour.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus:outline-none"
          >
            {tour.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-meta text-ink/65">{tour.summary}</p>

        <div className="mt-3 flex items-center gap-2 text-meta text-ink/60">
          <span>{DIFFICULTY_LABEL[tour.difficulty] ?? tour.difficulty}</span>
          {tour.nextDeparture && (
            <>
              <span aria-hidden>·</span>
              <span>Next {formatDepartureDate(tour.nextDeparture)}</span>
            </>
          )}
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-grey-300/50 pt-4">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-ink/50">From</p>
            <p className="text-lg font-bold text-nile">
              {formatPriceCents(tour.fromPriceCents, tour.currency)}
              <span className="text-[11px] font-normal text-ink/50"> /person</span>
            </p>
          </div>
          <span className="rounded-full border border-nile/20 px-4 py-2 text-[13px] font-semibold text-nile transition-colors group-hover:border-rust group-hover:text-rust">
            {tour.openDepartureCount > 0 ? "View & book" : "View tour"}
          </span>
        </div>
      </div>
    </div>
  );
}
