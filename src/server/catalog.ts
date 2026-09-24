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
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import {
  DEPARTING_SOON_DAYS,
  durationInBucket,
  type LengthToken,
  type TourTag,
  type TourSort,
  type TourDifficulty,
} from "@/content/tour-tags";
import { defaultLocale, type Locale } from "@/i18n/config";
import {
  getTranslations,
  getRecordTranslation,
  tString,
  tNullableString,
  tStringArray,
  tFaqArray,
} from "@/server/translations";

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
  /** P6 free-text query (`?q=`) — matches English title / summary / destination name. */
  q?: string;
  /** P6 price-range floor on the "from" price, minor units (`?priceMin=`, in whole units). */
  priceMinCents?: number;
  /** P6 price-range ceiling on the "from" price, minor units (`?priceMax=`). */
  priceMaxCents?: number;
  /** P6 difficulty filter (`?difficulty=`), a Prisma `Difficulty` enum value. */
  difficulty?: TourDifficulty;
  /** P6 sort order (`?sort=`); defaults to "featured" (newest first). */
  sort?: TourSort;
  /** P6 pagination: 1-based page number (`?page=`). */
  page?: number;
  /** P6 pagination: results per page; defaults to DEFAULT_TOUR_PAGE_SIZE. */
  pageSize?: number;
}

/** Paginated result envelope returned by the P6 advanced search (`searchTours`). */
export interface SearchToursResult {
  /** The tours on the requested page (already localized + sorted). */
  items: TourListItem[];
  /** Total matches across all pages (exact — filtering is done before slicing). */
  total: number;
  /** The page actually returned (clamped into `[1, pageCount]`). */
  page: number;
  /** Page size used. */
  pageSize: number;
  /** Total number of pages (at least 1, even when empty). */
  pageCount: number;
}

/** Default results-per-page for the tours finder. */
export const DEFAULT_TOUR_PAGE_SIZE = 9;

export interface TourDetail {
  id: string;
  slug: string;
  title: string;
  summary: string;
  descriptionLong: string;
  durationDays: number;
  basePriceCents: number;
  /** P4 per-passenger-type prices (minor units). null ⇒ type not offered on this
   *  tour, so the checkout hides that selector. May be 0 (free infant). */
  childPriceCents: number | null;
  infantPriceCents: number | null;
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
  /** P4 close-tour toggle: tour is visible but online booking is disabled. */
  bookingClosed: boolean;
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

/* Shared Prisma `select` for the catalog list view-model. Includes the row `id`
   and each destination `id` — needed as translation keys, dropped from the
   returned view-model. */
const tourListSelect = {
  id: true,
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
    select: { destination: { select: { id: true, name: true } } },
  },
  departures: {
    where: openFutureDepartureWhere(),
    orderBy: { startDate: "asc" },
    select: { startDate: true, priceOverrideCents: true },
  },
} as const;

type TourListRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  durationDays: number;
  basePriceCents: number;
  currency: string;
  difficulty: string;
  heroImage: string | null;
  tags: unknown;
  destinations: { destination: { id: string; name: string } }[];
  departures: { startDate: Date; priceOverrideCents: number | null }[];
};

/**
 * Map raw catalog rows to the public TourListItem[], overlaying `title`,
 * `summary` and destination `name` with their `locale` translations (English
 * fallback per field). One batched translation query per model, regardless of
 * how many tours are in the list.
 */
async function localizeTourList(rows: TourListRow[], locale: Locale): Promise<TourListItem[]> {
  const tourTr = await getTranslations("Tour", rows.map((r) => r.id), locale);
  const destIds = [
    ...new Set(rows.flatMap((r) => r.destinations.map((d) => d.destination.id))),
  ];
  const destTr = await getTranslations("Destination", destIds, locale);

  return rows.map((t) => {
    const fm = tourTr.get(t.id);
    const overrides = t.departures
      .map((d) => d.priceOverrideCents)
      .filter((c): c is number => c !== null);
    // "From" price = cheapest of (base, any departure overrides).
    const fromPriceCents = Math.min(t.basePriceCents, ...overrides);
    return {
      slug: t.slug,
      title: tString(fm, "title", t.title),
      summary: tString(fm, "summary", t.summary),
      durationDays: t.durationDays,
      fromPriceCents: Number.isFinite(fromPriceCents) ? fromPriceCents : t.basePriceCents,
      currency: t.currency,
      difficulty: t.difficulty,
      heroImage: t.heroImage,
      tags: toStringArray(t.tags),
      destinations: t.destinations.map((d) =>
        tString(destTr.get(d.destination.id), "name", d.destination.name),
      ),
      nextDeparture: t.departures[0]?.startDate ?? null,
      openDepartureCount: t.departures.length,
    };
  });
}

/**
 * Build-time resilience. `listPublishedTourSlugs` runs inside the
 * /tours/[slug] `generateStaticParams`, which Next.js executes during
 * `next build` even though that route is `force-dynamic` (the config governs
 * rendering, not param collection). A build server that briefly can't reach
 * the DB must NOT crash the whole build — mirror the graceful degradation used
 * in src/server/events.ts / content.ts / toggles.ts: log and return a safe
 * empty fallback, so the build emits zero prerendered params and the pages are
 * generated on demand once the DB is reachable, instead of failing the deploy.
 */
async function safeRead<T>(label: string, run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch (error) {
    logger.warn(`${label} failed — using empty fallback (DB unreachable?)`, { error });
    return fallback;
  }
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
  locale: Locale = defaultLocale,
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
    select: tourListSelect,
    orderBy: { createdAt: "desc" },
  });

  const soonCutoff = new Date();
  soonCutoff.setUTCDate(soonCutoff.getUTCDate() + DEPARTING_SOON_DAYS);

  const items = await localizeTourList(tours, locale);

  return items.filter((t) => {
    if (f.tag && !t.tags.includes(f.tag)) return false;
    if (f.length && !durationInBucket(t.durationDays, f.length)) return false;
    if (f.departingSoon && !(t.nextDeparture && t.nextDeparture <= soonCutoff)) return false;
    return true;
  });
}

/**
 * In-place sort for the finder. "featured" keeps the incoming createdAt-desc
 * order from the DB; every other mode sorts a shallow copy's elements. V8's
 * Array.sort is stable, so ties preserve that catalog order.
 */
function sortToursInPlace(items: TourListItem[], sort: TourSort): void {
  switch (sort) {
    case "price-asc":
      items.sort((a, b) => a.fromPriceCents - b.fromPriceCents);
      break;
    case "price-desc":
      items.sort((a, b) => b.fromPriceCents - a.fromPriceCents);
      break;
    case "duration-asc":
      items.sort((a, b) => a.durationDays - b.durationDays);
      break;
    case "duration-desc":
      items.sort((a, b) => b.durationDays - a.durationDays);
      break;
    case "soonest":
      // Tours with no open departure sort last.
      items.sort((a, b) => {
        const at = a.nextDeparture ? a.nextDeparture.getTime() : Number.POSITIVE_INFINITY;
        const bt = b.nextDeparture ? b.nextDeparture.getTime() : Number.POSITIVE_INFINITY;
        return at - bt;
      });
      break;
    case "featured":
    default:
      break; // keep createdAt-desc order
  }
}

/**
 * P6 advanced search — the unified, paginated query behind BOTH `/tours` and
 * `/search`. It supersets `listPublishedTours` (facets) and
 * `searchPublishedTours` (free-text) without changing either, so their other
 * callers are untouched.
 *
 * Strategy mirrors `listPublishedTours`' hybrid split: destination, difficulty
 * and free-text narrow in the DB; tag / length / departing-soon / price-range
 * and all sorting run in-memory over the localized rows (`tags` is a Json
 * column, `length` is derived from durationDays, and the catalog is small).
 * Pagination is applied LAST over the fully-filtered, sorted set, so `total`
 * and `pageCount` are exact and `page` is clamped into range.
 */
export async function searchTours(
  filter: TourFilter,
  locale: Locale = defaultLocale,
): Promise<SearchToursResult> {
  const pageSize =
    filter.pageSize && filter.pageSize > 0 ? filter.pageSize : DEFAULT_TOUR_PAGE_SIZE;

  // Cap the term so a pathological input can't build a huge LIKE scan.
  const needle = filter.q?.trim().slice(0, 100) ?? "";

  const where: Prisma.TourWhereInput = {
    status: "PUBLISHED",
    ...(filter.destinationSlug
      ? { destinations: { some: { destination: { slug: filter.destinationSlug } } } }
      : {}),
    ...(filter.difficulty ? { difficulty: filter.difficulty } : {}),
    ...(needle
      ? {
          OR: [
            { title: { contains: needle } },
            { summary: { contains: needle } },
            { destinations: { some: { destination: { name: { contains: needle } } } } },
          ],
        }
      : {}),
  };

  const rows = await db.tour.findMany({
    where,
    select: tourListSelect,
    orderBy: { createdAt: "desc" },
  });

  const soonCutoff = new Date();
  soonCutoff.setUTCDate(soonCutoff.getUTCDate() + DEPARTING_SOON_DAYS);

  let items = await localizeTourList(rows, locale);

  items = items.filter((t) => {
    if (filter.tag && !t.tags.includes(filter.tag)) return false;
    if (filter.length && !durationInBucket(t.durationDays, filter.length)) return false;
    if (filter.departingSoon && !(t.nextDeparture && t.nextDeparture <= soonCutoff)) return false;
    if (filter.priceMinCents != null && t.fromPriceCents < filter.priceMinCents) return false;
    if (filter.priceMaxCents != null && t.fromPriceCents > filter.priceMaxCents) return false;
    return true;
  });

  sortToursInPlace(items, filter.sort ?? "featured");

  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, filter.page ?? 1), pageCount);
  const start = (page - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);

  return { items: paged, total, page, pageSize, pageCount };
}

/** Full detail for one published tour, or null (unpublished/absent → 404). */
export async function getTourDetail(
  slug: string,
  locale: Locale = defaultLocale,
): Promise<TourDetail | null> {
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
      childPriceCents: true,
      infantPriceCents: true,
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
      bookingClosed: true,
      destinations: {
        orderBy: { sortOrder: "asc" },
        select: { destination: { select: { id: true, slug: true, name: true, region: true } } },
      },
      itinerary: {
        orderBy: [{ sortOrder: "asc" }, { dayNumber: "asc" }],
        select: { id: true, dayNumber: true, title: true, description: true },
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

  // Overlay translations (English fallback per field). One batched query per model.
  const fm = await getRecordTranslation("Tour", tour.id, locale);
  const destTr = await getTranslations(
    "Destination",
    tour.destinations.map((d) => d.destination.id),
    locale,
  );
  const itinTr = await getTranslations(
    "ItineraryDay",
    tour.itinerary.map((d) => d.id),
    locale,
  );

  return {
    id: tour.id,
    slug: tour.slug,
    title: tString(fm, "title", tour.title),
    summary: tString(fm, "summary", tour.summary),
    descriptionLong: tString(fm, "descriptionLong", tour.descriptionLong),
    durationDays: tour.durationDays,
    basePriceCents: tour.basePriceCents,
    childPriceCents: tour.childPriceCents,
    infantPriceCents: tour.infantPriceCents,
    currency: tour.currency,
    difficulty: tour.difficulty,
    heroImage: tour.heroImage,
    gallery: toStringArray(tour.gallery),
    inclusions: tStringArray(fm, "inclusions", toStringArray(tour.inclusions)),
    exclusions: tStringArray(fm, "exclusions", toStringArray(tour.exclusions)),
    faqs: tFaqArray(fm, "faqs", toFaqArray(tour.faqs)),
    travelNotes: tStringArray(fm, "travelNotes", toStringArray(tour.travelNotes)),
    ctaLabel: tNullableString(fm, "ctaLabel", tour.ctaLabel),
    ctaHref: tour.ctaHref,
    metaTitle: tNullableString(fm, "metaTitle", tour.metaTitle),
    metaDesc: tNullableString(fm, "metaDesc", tour.metaDesc),
    ogImage: tour.ogImage,
    bookingClosed: tour.bookingClosed,
    destinations: tour.destinations.map((d) => {
      const dfm = destTr.get(d.destination.id);
      return {
        slug: d.destination.slug,
        name: tString(dfm, "name", d.destination.name),
        region: tNullableString(dfm, "region", d.destination.region),
      };
    }),
    itinerary: tour.itinerary.map((day) => {
      const ifm = itinTr.get(day.id);
      return {
        dayNumber: day.dayNumber,
        title: tString(ifm, "title", day.title),
        description: tString(ifm, "description", day.description),
      };
    }),
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
export async function searchPublishedTours(
  term: string,
  locale: Locale = defaultLocale,
): Promise<TourListItem[]> {
  const q = term.trim();
  if (q.length === 0) return [];
  // Cap the term so a pathological input can't build a huge LIKE scan.
  const needle = q.slice(0, 100);

  // Search matches the ENGLISH source (title/summary/destination name); the
  // returned view-model is then localized for display. Localizing the match
  // itself would require scanning translation rows — out of scope here.
  const tours = await db.tour.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { title: { contains: needle } },
        { summary: { contains: needle } },
        { destinations: { some: { destination: { name: { contains: needle } } } } },
      ],
    },
    select: tourListSelect,
    orderBy: { createdAt: "desc" },
  });

  return localizeTourList(tours, locale);
}

/** Slugs of all published tours — for generateStaticParams / sitemap. */
export async function listPublishedTourSlugs(): Promise<string[]> {
  return safeRead(
    "listPublishedTourSlugs",
    async () => {
      const rows = await db.tour.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true },
      });
      return rows.map((r) => r.slug);
    },
    [],
  );
}

/**
 * Published tours across ANY of the given destination slugs (deduped) — for a
 * country page, whose tours span several cities. Empty input → []. Reuses the
 * same TourListItem view-model as the catalog list.
 */
export async function listPublishedToursForDestinations(
  destinationSlugs: string[],
  locale: Locale = defaultLocale,
): Promise<TourListItem[]> {
  if (destinationSlugs.length === 0) return [];
  const tours = await db.tour.findMany({
    where: {
      status: "PUBLISHED",
      destinations: { some: { destination: { slug: { in: destinationSlugs } } } },
    },
    select: tourListSelect,
    orderBy: { createdAt: "desc" },
  });

  return localizeTourList(tours, locale);
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
export async function listDestinationsWithTours(
  locale: Locale = defaultLocale,
): Promise<{ slug: string; name: string }[]> {
  const rows = await db.destination.findMany({
    where: { tours: { some: { tour: { status: "PUBLISHED" } } } },
    select: { id: true, slug: true, name: true },
    orderBy: { name: "asc" },
  });
  const tr = await getTranslations("Destination", rows.map((r) => r.id), locale);
  return rows.map((r) => ({ slug: r.slug, name: tString(tr.get(r.id), "name", r.name) }));
}

/** One bookable departure with its tour context — for the booking page. */
export async function getDepartureForBooking(
  departureId: string,
  locale: Locale = defaultLocale,
): Promise<{
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
        select: { id: true, slug: true, title: true, currency: true, basePriceCents: true, durationDays: true, status: true },
      },
    },
  });
  if (!dep || dep.tour.status !== "PUBLISHED") return null;
  const fm = await getRecordTranslation("Tour", dep.tour.id, locale);
  return {
    id: dep.id,
    startDate: dep.startDate,
    endDate: dep.endDate,
    remainingCapacity: dep.remainingCapacity,
    status: dep.status,
    priceCents: dep.priceOverrideCents ?? dep.tour.basePriceCents,
    currency: dep.tour.currency,
    tourSlug: dep.tour.slug,
    tourTitle: tString(fm, "title", dep.tour.title),
    durationDays: dep.tour.durationDays,
  };
}
