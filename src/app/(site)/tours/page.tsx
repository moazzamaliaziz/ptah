import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import TourCard from "@/components/commerce/TourCard";
import {
  listPublishedTours,
  listDestinationsWithTours,
  type TourFilter,
} from "@/server/catalog";
import { getSessionUser } from "@/server/auth/session";
import {
  isTourTag,
  isLengthToken,
  TOUR_TAG_LABELS,
  LENGTH_BUCKETS,
} from "@/content/tour-tags";

export const metadata: Metadata = {
  title: "Tours | Ptah Tours",
  description:
    "Browse every Ptah Tours departure across Egypt — Cairo, Luxor, the Nile, and the Red Sea. Private and small-group tours with licensed Egyptologist guides.",
  // Every `?destination=`/`?type=`/`?length=`/`?filter=` variant is a filtered
  // subset — canonicalize them all to the base listing (what the sitemap lists).
  alternates: { canonical: "/tours" },
};

// Catalog reads live data (capacity changes with bookings), so render dynamically.
export const dynamic = "force-dynamic";

/** Build a `/tours` URL from a set of filter params, dropping empty ones. */
function toursHref(params: {
  destination?: string;
  type?: string;
  length?: string;
  filter?: string;
}): string {
  const sp = new URLSearchParams();
  if (params.destination) sp.set("destination", params.destination);
  if (params.type) sp.set("type", params.type);
  if (params.length) sp.set("length", params.length);
  if (params.filter) sp.set("filter", params.filter);
  const qs = sp.toString();
  return qs ? `/tours?${qs}` : "/tours";
}

export default async function ToursPage({
  searchParams,
}: {
  searchParams: Promise<{
    destination?: string;
    type?: string;
    length?: string;
    filter?: string;
  }>;
}) {
  const {
    destination,
    type: rawType,
    length: rawLength,
    filter: rawFilter,
  } = await searchParams;

  // Validate the thematic params against the tag vocabulary / length buckets;
  // anything unrecognized is ignored (treated as absent) rather than trusted.
  const tag = rawType && isTourTag(rawType) ? rawType : undefined;
  const lengthToken = rawLength && isLengthToken(rawLength) ? rawLength : undefined;
  const departingSoon = rawFilter === "departing-soon";
  const filterToken = departingSoon ? "departing-soon" : undefined;

  const filterObj: TourFilter = {
    destinationSlug: destination || undefined,
    tag,
    length: lengthToken,
    departingSoon: departingSoon || undefined,
  };

  const [tours, destinations, user] = await Promise.all([
    listPublishedTours(filterObj),
    listDestinationsWithTours(),
    getSessionUser(),
  ]);
  const isAuthenticated = user !== null;

  const activeDestination = destination
    ? destinations.find((d) => d.slug === destination)
    : undefined;

  const heading = activeDestination
    ? `Tours in ${activeDestination.name}`
    : tag
      ? `${TOUR_TAG_LABELS[tag]} tours`
      : lengthToken
        ? LENGTH_BUCKETS[lengthToken].label
        : departingSoon
          ? "Departing soon"
          : "Find your Egypt journey";

  // Active thematic filters, each with a link that removes just that one.
  const activeChips: { key: string; label: string; removeHref: string }[] = [];
  if (tag) {
    activeChips.push({
      key: "type",
      label: TOUR_TAG_LABELS[tag],
      removeHref: toursHref({ destination, length: lengthToken, filter: filterToken }),
    });
  }
  if (lengthToken) {
    activeChips.push({
      key: "length",
      label: LENGTH_BUCKETS[lengthToken].label,
      removeHref: toursHref({ destination, type: tag, filter: filterToken }),
    });
  }
  if (departingSoon) {
    activeChips.push({
      key: "filter",
      label: "Departing soon",
      removeHref: toursHref({ destination, type: tag, length: lengthToken }),
    });
  }

  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Tours" }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">All tours</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">{heading}</h1>
        <p className="mt-3 text-body text-ink/65">
          Private and small-group departures with licensed Egyptologist guides. Prices are per person;
          seats update live as travelers book.
        </p>
      </header>

      {/* Active thematic filters (style / length / departing-soon) with clear links. */}
      {activeChips.length > 0 && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-meta uppercase tracking-[0.12em] text-ink/50">Filtered by</span>
          {activeChips.map((chip) => (
            <Link
              key={chip.key}
              href={chip.removeHref}
              className="inline-flex items-center gap-1.5 rounded-full bg-nile px-3 py-1.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              {chip.label}
              <span aria-hidden="true" className="text-white/80">
                ×
              </span>
              <span className="sr-only">(remove filter)</span>
            </Link>
          ))}
          <Link
            href={toursHref({ destination })}
            className="text-[13px] font-semibold text-rust hover:underline"
          >
            Clear all
          </Link>
        </div>
      )}

      {/* Destination filter — plain links (no client JS, shareable URLs). Thematic
          filters are preserved when switching destination. */}
      <nav aria-label="Filter by destination" className="mt-8 flex flex-wrap gap-2">
        <Link
          href={toursHref({ type: tag, length: lengthToken, filter: filterToken })}
          className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
            !destination
              ? "bg-nile text-white"
              : "border border-grey-300/70 text-ink/70 hover:border-nile/40"
          }`}
        >
          All destinations
        </Link>
        {destinations.map((d) => (
          <Link
            key={d.slug}
            href={toursHref({
              destination: d.slug,
              type: tag,
              length: lengthToken,
              filter: filterToken,
            })}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
              destination === d.slug
                ? "bg-nile text-white"
                : "border border-grey-300/70 text-ink/70 hover:border-nile/40"
            }`}
          >
            {d.name}
          </Link>
        ))}
      </nav>

      <div className="mt-10">
        {tours.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour) => (
              <TourCard key={tour.slug} tour={tour} isAuthenticated={isAuthenticated} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-grey-300/60 bg-papyrus/50 p-10 text-center">
            <p className="text-card-title font-semibold text-ink">No tours match this filter.</p>
            <p className="mt-2 text-body text-ink/60">
              Try a different combination, or{" "}
              <Link href="/tours" className="font-semibold text-rust hover:underline">
                browse everything
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}
