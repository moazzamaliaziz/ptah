/**
 * Homepage tour grid — the focus destinations' real, bookable tours.
 *
 * Replaces the old "Get Inspired" rail, whose cards carried only a title and a
 * day count. These are the SAME `TourCard`s the /tours catalog renders, so a
 * tour looks and behaves identically wherever a traveler meets it: destination,
 * summary, difficulty, next departure, "from" price per person, wishlist and a
 * "View & book" affordance.
 *
 * Server component — no tabs, no carousel, no client JS. The homepage is
 * statically prerendered, and a plain grid keeps it that way.
 */
import type { JSX } from "react";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import TourCard from "@/components/commerce/TourCard";
import type { TourListItem } from "@/server/catalog";

export interface FocusToursStrings {
  heading: string;
  intro: string;
  cta: string;
}

export default function FocusTours({
  tours,
  strings,
}: {
  tours: TourListItem[];
  strings: FocusToursStrings;
}): JSX.Element | null {
  // Nothing published for the focus destinations yet — render nothing rather
  // than a heading over an empty grid.
  if (tours.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-[1400px] px-[var(--container-padding,1rem)] py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h2 className="text-section-h2 font-bold text-ink">{strings.heading}</h2>
          <p className="mt-2 text-body text-ink/65">{strings.intro}</p>
        </div>
        <Link
          href="/tours"
          className="shrink-0 rounded-full border border-nile/25 px-5 py-2.5 text-[13px] font-semibold text-nile transition-colors hover:border-rust hover:text-rust focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nile"
        >
          {strings.cta}
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tours.map((tour) => (
          // isAuthenticated stays false so the homepage remains static: the
          // wishlist button then uses its guest (localStorage) path, which is
          // the same one every signed-out visitor gets anyway.
          <TourCard key={tour.slug} tour={tour} isAuthenticated={false} />
        ))}
      </div>
    </section>
  );
}
