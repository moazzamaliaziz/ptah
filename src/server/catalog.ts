/**
 * Catalog read layer (Phase 3) — the DB-backed replacement for the mock
 * `src/lib/tours.ts` used by legacy scaffold routes.
 *
 * All public catalog pages read through here. Functions return plain
 * view-models (no Prisma types leak into components), money stays as integer
 * cents + currency, and only PUBLISHED tours / OPEN future departures are ever
 * exposed to the public. Server-only: these touch the DB.
 */
import "server-only";
import { db } from "@/lib/db";
import {
  DEPARTING_SOON_DAYS,
  durationInBucket,
  type LengthToken,
  type TourTag,
} from "@/content/tour-tags";

export interface DepartureView {
  id: string;
  startDate: Date;
  endDate: Date;
  maxCapacity: number;
  remainingCapacity: number;
  /** Effective per-seat price: departure override, else tour base. */
  priceCents: number;
  currency: string;
  soldOut: boolean;
}

export interface TourListItem {
  slug: string;
  title: string;
  summary: string;
  durationDays: number;
  fromPriceCents: number;
  currency: string;
  difficulty: string;
  heroImage: string | null;
  destinations: string[];
  tags: string[];
  nextDeparture: Date | null;
  openDepartureCount: number;
}

/** Optional filters for the public tours listing (maps to `/tours?…`). */
export interface TourFilter {
  /** Destination slug (existing behaviour). */
  destinationSlug?: string;
  /** Style/special tag from TOUR_TAGS (`?type=`). */
  tag?: TourTag;
  /** Length bucket derived from durationDays (`?length=`). */
  length?: LengthToken;
  /** Only tours with an open departure within DEPARTING_SOON_DAYS (`?filter=departing-soon`). */
  departingSoon?: boolean;
}

export interface TourDetail {
  id: string;
  slug: string;
  title: string;
  summary: string;
  descriptionLong: string;
  durationDays: number;
  basePriceCents: number;
  currency: string;
  difficulty: string;
  heroImage: string | null;
  gallery: string[];
  inclusions: string[];
  exclusions: string[];
  /** Phase 7 (D3) flexible content — empty/null when the editor left them blank. */
  faqs: { q: string; a: string }[];
  travelNotes: string[];
  ctaLabel: string | null;
  ctaHref: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
  ogImage: string | null;
  destinations: { slug: string; name: string; region: string | null }[];
  itinerary: { dayNumber: number; title: string; description: string }[];
  departures: DepartureView[];
}

/** Coerce a Json column that should be string[] into a safe string[]. */
function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

/** Coerce a Json column that should be {q,a}[] into a safe FAQ array. */
function toFaqArray(value: unknown): { q: string; a: string }[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (item && typeof item === "object" && !Array.isArray(item)) {
      const { q, a } = item as Record<string, unknown>;
      if (typeof q === "string" && typeof a === "string" && q.trim() && a.trim()) {
        return [{ q, a }];
      }
    }
    return [];
  });
}

/** Only future, OPEN departures are bookable/visible to the public. */
function openFutureDepartureWhere() {
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);
  return { status: "OPEN" as const, startDate: { gte: startOfToday } };
}

/**
 * List published tours with a price-from and next-departure summary.
 *
 * Accepts either a destination slug (legacy string arg, kept for existing
 * callers) or a `TourFilter`. Destination filtering runs in the DB; tag /
 * length / departing-soon filtering runs in-memory after the fetch — the
 * catalog is small, `tags` is a Json column (awkward to query relationally in
 * MySQL), and length is derived from durationDays rather than stored.
 */
export async function listPublishedTours(
  filter?: string | TourFilter,
): Promise<TourListItem[]> {
  const f: TourFilter =
    typeof filter === "string" ? { destinationSlug: filter } : (filter ?? {});

  const tours = await db.tour.findMany({
    where: {
      status: "PUBLISHED",
      ...(f.destinationSlug
        ? { destinations: { some: { destination: { slug: f.destinationSlug } } } }
        : {}),
    },
    select: {
      slug: true,
      title: true,
      summary: true,
      durationDays: true,
      basePriceCents: true,
      currency: true,
      difficulty: true,
      heroImage: true,
      tags: true,
      destinations: {
        orderBy: { sortOrder: "asc" },
        select: { destination: { select: { name: true } } },
      },
      departures: {
        where: openFutureDepartureWhere(),
        orderBy: { startDate: "asc" },
        select: { startDate: true, priceOverrideCents: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const soonCutoff = new Date();
  soonCutoff.setUTCDate(soonCutoff.getUTCDate() + DEPARTING_SOON_DAYS);

  return tours
    .map((t) => {
      const overrides = t.departures
        .map((d) => d.priceOverrideCents)
        .filter((c): c is number => c !== null);
      // "From" price = cheapest of (base, any departure overrides).
      const fromPriceCents = Math.min(t.basePriceCents, ...overrides);
      return {
        slug: t.slug,
        title: t.title,
        summary: t.summary,
        durationDays: t.durationDays,
        fromPriceCents: Number.isFinite(fromPriceCents) ? fromPriceCents : t.basePriceCents,
        currency: t.currency,
        difficulty: t.difficulty,
        heroImage: t.heroImage,
        tags: toStringArray(t.tags),
        destinations: t.destinations.map((d) => d.destination.name),
        nextDeparture: t.departures[0]?.startDate ?? null,
        openDepartureCount: t.departures.length,
      };
    })
    .filter((t) => {
      if (f.tag && !t.tags.includes(f.tag)) return false;
      if (f.length && !durationInBucket(t.durationDays, f.length)) return false;
      if (f.departingSoon && !(t.nextDeparture && t.nextDeparture <= soonCutoff)) return false;
      return true;
    });
}

/** Full detail for one published tour, or null (unpublished/absent → 404). */
export async function getTourDetail(slug: string): Promise<TourDetail | null> {
  const tour = await db.tour.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      descriptionLong: true,
      durationDays: true,
      basePriceCents: true,
      currency: true,
      difficulty: true,
      heroImage: true,
      gallery: true,
      inclusions: true,
      exclusions: true,
      faqs: true,
      travelNotes: true,
      ctaLabel: true,
      ctaHref: true,
      metaTitle: true,
      metaDesc: true,
      ogImage: true,
      destinations: {
        orderBy: { sortOrder: "asc" },
        select: { destination: { select: { slug: true, name: true, region: true } } },
      },
      itinerary: {
        orderBy: [{ sortOrder: "asc" }, { dayNumber: "asc" }],
        select: { dayNumber: true, title: true, description: true },
      },
      departures: {
        where: openFutureDepartureWhere(),
        orderBy: { startDate: "asc" },
        select: {
          id: true,
          startDate: true,
          endDate: true,
          maxCapacity: true,
          remainingCapacity: true,
          priceOverrideCents: true,
        },
      },
    },
  });
  if (!tour) return null;

  return {
    id: tour.id,
    slug: tour.slug,
    title: tour.title,
    summary: tour.summary,
    descriptionLong: tour.descriptionLong,
    durationDays: tour.durationDays,
    basePriceCents: tour.basePriceCents,
    currency: tour.currency,
    difficulty: tour.difficulty,
    heroImage: tour.heroImage,
    gallery: toStringArray(tour.gallery),
    inclusions: toStringArray(tour.inclusions),
    exclusions: toStringArray(tour.exclusions),
    faqs: toFaqArray(tour.faqs),
    travelNotes: toStringArray(tour.travelNotes),
    ctaLabel: tour.ctaLabel,
    ctaHref: tour.ctaHref,
    metaTitle: tour.metaTitle,
    metaDesc: tour.metaDesc,
    ogImage: tour.ogImage,
    destinations: tour.destinations.map((d) => d.destination),
    itinerary: tour.itinerary,
    departures: tour.departures.map((d) => ({
      id: d.id,
      startDate: d.startDate,
      endDate: d.endDate,
      maxCapacity: d.maxCapacity,
      remainingCapacity: d.remainingCapacity,
      priceCents: d.priceOverrideCents ?? tour.basePriceCents,
      currency: tour.currency,
      soldOut: d.remainingCapacity <= 0,
    })),
  };
}

/**
 * Free-text search across published tours (title, summary, destination name).
 *
 * MySQL's default collation (utf8mb4_*_ci) is case-insensitive, so `contains`
 * matches regardless of case without Prisma's Postgres-only `mode:"insensitive"`.
 * The term is passed as a bound parameter by Prisma (no string concatenation →
 * no SQLi). Returns the same `TourListItem[]` view-model as the catalog list so
 * the search page reuses the commerce `TourCard`. Empty/whitespace term → [].
 */
export async function searchPublishedTours(term: string): Promise<TourListItem[]> {
  const q = term.trim();
  if (q.length === 0) return [];
  // Cap the term so a pathological input can't build a huge LIKE scan.
  const needle = q.slice(0, 100);

  const tours = await db.tour.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { title: { contains: needle } },
        { summary: { contains: needle } },
        { destinations: { some: { destination: { name: { contains: needle } } } } },
      ],
    },
    select: {
      slug: true,
      title: true,
      summary: true,
      durationDays: true,
      basePriceCents: true,
      currency: true,
      difficulty: true,
      heroImage: true,
      tags: true,
      destinations: {
        orderBy: { sortOrder: "asc" },
        select: { destination: { select: { name: true } } },
      },
      departures: {
        where: openFutureDepartureWhere(),
        orderBy: { startDate: "asc" },
        select: { startDate: true, priceOverrideCents: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return tours.map((t) => {
    const overrides = t.departures
      .map((d) => d.priceOverrideCents)
      .filter((c): c is number => c !== null);
    const fromPriceCents = Math.min(t.basePriceCents, ...overrides);
    return {
      slug: t.slug,
      title: t.title,
      summary: t.summary,
      durationDays: t.durationDays,
      fromPriceCents: Number.isFinite(fromPriceCents) ? fromPriceCents : t.basePriceCents,
      currency: t.currency,
      difficulty: t.difficulty,
      heroImage: t.heroImage,
      tags: toStringArray(t.tags),
      destinations: t.destinations.map((d) => d.destination.name),
      nextDeparture: t.departures[0]?.startDate ?? null,
      openDepartureCount: t.departures.length,
    };
  });
}

/** Slugs of all published tours — for generateStaticParams / sitemap. */
export async function listPublishedTourSlugs(): Promise<string[]> {
  const rows = await db.tour.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

/**
 * Published tours across ANY of the given destination slugs (deduped) — for a
 * country page, whose tours span several cities. Empty input → []. Reuses the
 * same TourListItem view-model as the catalog list.
 */
export async function listPublishedToursForDestinations(
  destinationSlugs: string[],
): Promise<TourListItem[]> {
  if (destinationSlugs.length === 0) return [];
  const tours = await db.tour.findMany({
    where: {
      status: "PUBLISHED",
      destinations: { some: { destination: { slug: { in: destinationSlugs } } } },
    },
    select: {
      slug: true,
      title: true,
      summary: true,
      durationDays: true,
      basePriceCents: true,
      currency: true,
      difficulty: true,
      heroImage: true,
      tags: true,
      destinations: {
        orderBy: { sortOrder: "asc" },
        select: { destination: { select: { name: true } } },
      },
      departures: {
        where: openFutureDepartureWhere(),
        orderBy: { startDate: "asc" },
        select: { startDate: true, priceOverrideCents: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return tours.map((t) => {
    const overrides = t.departures
      .map((d) => d.priceOverrideCents)
      .filter((c): c is number => c !== null);
    const fromPriceCents = Math.min(t.basePriceCents, ...overrides);
    return {
      slug: t.slug,
      title: t.title,
      summary: t.summary,
      durationDays: t.durationDays,
      fromPriceCents: Number.isFinite(fromPriceCents) ? fromPriceCents : t.basePriceCents,
      currency: t.currency,
      difficulty: t.difficulty,
      heroImage: t.heroImage,
      tags: toStringArray(t.tags),
      destinations: t.destinations.map((d) => d.destination.name),
      nextDeparture: t.departures[0]?.startDate ?? null,
      openDepartureCount: t.departures.length,
    };
  });
}

/**
 * Published-tour counts keyed by destination slug — for the city/country cards.
 * One relation query, tallied in-process; a slug with zero published tours is
 * simply absent from the map (callers default to 0).
 */
export async function getPublishedTourCountsByDestination(): Promise<Record<string, number>> {
  const rows = await db.tourDestination.findMany({
    where: { tour: { status: "PUBLISHED" } },
    select: { destination: { select: { slug: true } } },
  });
  const counts: Record<string, number> = {};
  for (const row of rows) {
    const slug = row.destination.slug;
    counts[slug] = (counts[slug] ?? 0) + 1;
  }
  return counts;
}

/** Destinations that have at least one published tour — for the catalog filter. */
export async function listDestinationsWithTours(): Promise<{ slug: string; name: string }[]> {
  const rows = await db.destination.findMany({
    where: { tours: { some: { tour: { status: "PUBLISHED" } } } },
    select: { slug: true, name: true },
    orderBy: { name: "asc" },
  });
  return rows;
}

/** One bookable departure with its tour context — for the booking page. */
export async function getDepartureForBooking(departureId: string): Promise<{
  id: string;
  startDate: Date;
  endDate: Date;
  remainingCapacity: number;
  status: string;
  priceCents: number;
  currency: string;
  tourSlug: string;
  tourTitle: string;
  durationDays: number;
} | null> {
  const dep = await db.tourDeparture.findUnique({
    where: { id: departureId },
    select: {
      id: true,
      startDate: true,
      endDate: true,
      remainingCapacity: true,
      status: true,
      priceOverrideCents: true,
      tour: {
        select: { slug: true, title: true, currency: true, basePriceCents: true, durationDays: true, status: true },
      },
    },
  });
  if (!dep || dep.tour.status !== "PUBLISHED") return null;
  return {
    id: dep.id,
    startDate: dep.startDate,
    endDate: dep.endDate,
    remainingCapacity: dep.remainingCapacity,
    status: dep.status,
    priceCents: dep.priceOverrideCents ?? dep.tour.basePriceCents,
    currency: dep.tour.currency,
    tourSlug: dep.tour.slug,
    tourTitle: dep.tour.title,
    durationDays: dep.tour.durationDays,
  };
}
