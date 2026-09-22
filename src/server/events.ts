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
export async function listPublishedEvents(): Promise<EventListItem[]> {
  return safeRead(
    "listPublishedEvents",
    () =>
      db.event.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ sortOrder: "asc" }, { startDate: "asc" }],
        select: {
          slug: true,
          title: true,
          summary: true,
          location: true,
          startDate: true,
          endDate: true,
          recurring: true,
          heroImage: true,
        },
      }),
    [],
  );
}

/** Full detail for one published event, or null. */
export async function getEventDetail(slug: string): Promise<EventDetail | null> {
  return safeRead(
    "getEventDetail",
    () =>
      db.event.findFirst({
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
      }),
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
export async function listPublishedTripIdeas(): Promise<TripIdeaListItem[]> {
  return safeRead(
    "listPublishedTripIdeas",
    async () => {
      const ideas = await db.tripIdea.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        select: {
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
      return ideas.map((i) => ({
        slug: i.slug,
        title: i.title,
        summary: i.summary,
        heroImage: i.heroImage,
        tourCount: i.tours.length,
      }));
    },
    [],
  );
}

/** Full detail for one published trip idea + its curated published tours. */
export async function getTripIdeaDetail(slug: string): Promise<TripIdeaDetail | null> {
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
            },
          },
        },
      },
    },
  });
  if (!idea) return null;
  return {
    id: idea.id,
    slug: idea.slug,
    title: idea.title,
    summary: idea.summary,
    descriptionLong: idea.descriptionLong,
    heroImage: idea.heroImage,
    metaTitle: idea.metaTitle,
    metaDesc: idea.metaDesc,
    ogImage: idea.ogImage,
    tours: idea.tours.map((t) => ({
      slug: t.tour.slug,
      title: t.tour.title,
      summary: t.tour.summary,
      durationDays: t.tour.durationDays,
      fromPriceCents: t.tour.basePriceCents,
      currency: t.tour.currency,
      difficulty: t.tour.difficulty,
      heroImage: t.tour.heroImage,
      destinations: t.tour.destinations.map((d) => d.destination.name),
      tags: toStringArray(t.tour.tags),
    })),
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
