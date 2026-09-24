/**
 * Events + Trip Ideas public read layer. Mirrors src/server/catalog.ts: plain
 * view-models (no Prisma types leak), only PUBLISHED rows are ever exposed,
 * server-only (touches the DB). Trip ideas surface their curated published
 * tours via the TripIdeaTour join.
 */
import "server-only";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import type { TourListItem } from "@/server/catalog";
import { defaultLocale, type Locale } from "@/i18n/config";
import {
  getTranslations,
  getRecordTranslation,
  tString,
  tNullableString,
} from "@/server/translations";

/** Coerce a Json column that should be string[] into a safe string[]. */
function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string");
}

/**
 * Build-time resilience. These public catalog reads run during `next build`
 * (the ISR /events and /trip-ideas pages, and the /events/[slug]
 * generateStaticParams). A build server that briefly can't reach the DB must
 * NOT crash the whole build — mirror the graceful degradation already used in
 * src/server/content.ts and src/server/toggles.ts: log and return a safe empty
 * fallback, so static generation emits empty pages that ISR fills in once the
 * DB is reachable, instead of failing the deploy.
 */
async function safeRead<T>(label: string, run: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await run();
  } catch (error) {
    logger.warn(`${label} failed — using empty fallback (DB unreachable?)`, { error });
    return fallback;
  }
}

export interface EventListItem {
  slug: string;
  title: string;
  summary: string;
  location: string | null;
  startDate: Date;
  endDate: Date | null;
  recurring: boolean;
  heroImage: string | null;
}

export interface EventDetail extends EventListItem {
  id: string;
  description: string;
  metaTitle: string | null;
  metaDesc: string | null;
  ogImage: string | null;
}

export interface TripIdeaListItem {
  slug: string;
  title: string;
  summary: string;
  heroImage: string | null;
  tourCount: number;
}

export interface TripIdeaDetail {
  id: string;
  slug: string;
  title: string;
  summary: string;
  descriptionLong: string;
  heroImage: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
  ogImage: string | null;
  /** Curated published tours for this theme, as the shared catalog view-model. */
  tours: TripIdeaTourItem[];
}

export interface TripIdeaTourItem {
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
}

// ── Events ─────────────────────────────────────────────────────────────────────

/** Published events, upcoming first; recurring festivals always included. */
export async function listPublishedEvents(
  locale: Locale = defaultLocale,
): Promise<EventListItem[]> {
  return safeRead(
    "listPublishedEvents",
    async () => {
      const rows = await db.event.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ sortOrder: "asc" }, { startDate: "asc" }],
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          location: true,
          startDate: true,
          endDate: true,
          recurring: true,
          heroImage: true,
        },
      });
      const tr = await getTranslations("Event", rows.map((r) => r.id), locale);
      return rows.map((e) => {
        const fm = tr.get(e.id);
        return {
          slug: e.slug,
          title: tString(fm, "title", e.title),
          summary: tString(fm, "summary", e.summary),
          location: tNullableString(fm, "location", e.location),
          startDate: e.startDate,
          endDate: e.endDate,
          recurring: e.recurring,
          heroImage: e.heroImage,
        };
      });
    },
    [],
  );
}

/** Full detail for one published event, or null. */
export async function getEventDetail(
  slug: string,
  locale: Locale = defaultLocale,
): Promise<EventDetail | null> {
  return safeRead(
    "getEventDetail",
    async () => {
      const e = await db.event.findFirst({
        where: { slug, status: "PUBLISHED" },
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          description: true,
          location: true,
          startDate: true,
          endDate: true,
          recurring: true,
          heroImage: true,
          metaTitle: true,
          metaDesc: true,
          ogImage: true,
        },
      });
      if (!e) return null;
      const fm = await getRecordTranslation("Event", e.id, locale);
      return {
        id: e.id,
        slug: e.slug,
        title: tString(fm, "title", e.title),
        summary: tString(fm, "summary", e.summary),
        description: tString(fm, "description", e.description),
        location: tNullableString(fm, "location", e.location),
        startDate: e.startDate,
        endDate: e.endDate,
        recurring: e.recurring,
        heroImage: e.heroImage,
        metaTitle: tNullableString(fm, "metaTitle", e.metaTitle),
        metaDesc: tNullableString(fm, "metaDesc", e.metaDesc),
        ogImage: e.ogImage,
      };
    },
    null,
  );
}

/** Slugs of published events — for generateStaticParams / sitemap. */
export async function listPublishedEventSlugs(): Promise<string[]> {
  return safeRead(
    "listPublishedEventSlugs",
    async () => {
      const rows = await db.event.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } });
      return rows.map((r) => r.slug);
    },
    [],
  );
}

// ── Trip Ideas ───────────────────────────────────────────────────────────────

/** Published trip-idea themes with a count of their curated published tours. */
export async function listPublishedTripIdeas(
  locale: Locale = defaultLocale,
): Promise<TripIdeaListItem[]> {
  return safeRead(
    "listPublishedTripIdeas",
    async () => {
      const ideas = await db.tripIdea.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          heroImage: true,
          tours: {
            where: { tour: { status: "PUBLISHED" } },
            select: { tourId: true },
          },
        },
      });
      const tr = await getTranslations("TripIdea", ideas.map((i) => i.id), locale);
      return ideas.map((i) => {
        const fm = tr.get(i.id);
        return {
          slug: i.slug,
          title: tString(fm, "title", i.title),
          summary: tString(fm, "summary", i.summary),
          heroImage: i.heroImage,
          tourCount: i.tours.length,
        };
      });
    },
    [],
  );
}

/** Full detail for one published trip idea + its curated published tours. */
export async function getTripIdeaDetail(
  slug: string,
  locale: Locale = defaultLocale,
): Promise<TripIdeaDetail | null> {
  const idea = await db.tripIdea.findFirst({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      slug: true,
      title: true,
      summary: true,
      descriptionLong: true,
      heroImage: true,
      metaTitle: true,
      metaDesc: true,
      ogImage: true,
      tours: {
        orderBy: { sortOrder: "asc" },
        where: { tour: { status: "PUBLISHED" } },
        select: {
          tour: {
            select: {
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
            },
          },
        },
      },
    },
  });
  if (!idea) return null;

  // Overlay translations (English fallback per field). Batched: one query for
  // the idea, one for all its tours, one for all their destinations.
  const ideaFm = await getRecordTranslation("TripIdea", idea.id, locale);
  const tourTr = await getTranslations("Tour", idea.tours.map((t) => t.tour.id), locale);
  const destIds = [
    ...new Set(idea.tours.flatMap((t) => t.tour.destinations.map((d) => d.destination.id))),
  ];
  const destTr = await getTranslations("Destination", destIds, locale);

  return {
    id: idea.id,
    slug: idea.slug,
    title: tString(ideaFm, "title", idea.title),
    summary: tString(ideaFm, "summary", idea.summary),
    descriptionLong: tString(ideaFm, "descriptionLong", idea.descriptionLong),
    heroImage: idea.heroImage,
    metaTitle: tNullableString(ideaFm, "metaTitle", idea.metaTitle),
    metaDesc: tNullableString(ideaFm, "metaDesc", idea.metaDesc),
    ogImage: idea.ogImage,
    tours: idea.tours.map((t) => {
      const fm = tourTr.get(t.tour.id);
      return {
        slug: t.tour.slug,
        title: tString(fm, "title", t.tour.title),
        summary: tString(fm, "summary", t.tour.summary),
        durationDays: t.tour.durationDays,
        fromPriceCents: t.tour.basePriceCents,
        currency: t.tour.currency,
        difficulty: t.tour.difficulty,
        heroImage: t.tour.heroImage,
        destinations: t.tour.destinations.map((d) =>
          tString(destTr.get(d.destination.id), "name", d.destination.name),
        ),
        tags: toStringArray(t.tour.tags),
      };
    }),
  };
}

/** Slugs of published trip ideas — for generateStaticParams / sitemap. */
export async function listPublishedTripIdeaSlugs(): Promise<string[]> {
  return safeRead(
    "listPublishedTripIdeaSlugs",
    async () => {
      const rows = await db.tripIdea.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } });
      return rows.map((r) => r.slug);
    },
    [],
  );
}

/** Adapt a TripIdeaTourItem to the catalog TourCard's TourListItem shape. */
export function toTourListItem(t: TripIdeaTourItem): TourListItem {
  return {
    slug: t.slug,
    title: t.title,
    summary: t.summary,
    durationDays: t.durationDays,
    fromPriceCents: t.fromPriceCents,
    currency: t.currency,
    difficulty: t.difficulty,
    heroImage: t.heroImage,
    destinations: t.destinations,
    tags: t.tags,
    nextDeparture: null,
    openDepartureCount: 0,
  };
}
