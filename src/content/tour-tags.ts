/**
 * Tour classification vocabulary — the SSOT for the Tours mega-menu filters
 * (src/content/landing.ts "By Style" / "Special" links) and the admin tag
 * editor. Pure module (no "server-only"): imported by the catalog read layer,
 * the admin zod schema, client form fields, and the seed alike.
 *
 * Two orthogonal axes drive `/tours?…`:
 *   • `?type=` → a stored tag on the tour (this vocabulary). A tour may carry
 *     several (e.g. a Nile cruise that is also a honeymoon pick), so tags are a
 *     string[] Json column, filtered in the query layer.
 *   • `?length=` → derived from durationDays (LENGTH_BUCKETS below), not stored.
 *   • `?filter=departing-soon` → derived from the nearest open departure.
 */

/** Stored, admin-editable style/special tags. Order = admin checkbox order. */
export const TOUR_TAGS = [
  "classic",
  "nile-cruise",
  "red-sea",
  "desert",
  "private",
  "family",
  "honeymoon",
] as const;

export type TourTag = (typeof TOUR_TAGS)[number];

const TOUR_TAG_SET: ReadonlySet<string> = new Set(TOUR_TAGS);

/** Type guard: is an arbitrary string one of the known tags? */
export function isTourTag(value: string): value is TourTag {
  return TOUR_TAG_SET.has(value);
}

/** Human labels for tags (admin checkboxes + active-filter chips on /tours). */
export const TOUR_TAG_LABELS: Record<TourTag, string> = {
  classic: "Classic Egypt",
  "nile-cruise": "Nile Cruise",
  "red-sea": "Red Sea & Beach",
  desert: "Desert Adventure",
  private: "Private & Tailor-Made",
  family: "Family Trip",
  honeymoon: "Honeymoon",
};

/**
 * Length buckets, matched to the mega-menu "By Length" tokens. `max: null`
 * means open-ended. Kept here so the tours page and any future UI agree.
 */
export const LENGTH_BUCKETS = {
  day: { label: "Day Tours", min: 1, max: 1 },
  short: { label: "2–4 Day Trips", min: 2, max: 4 },
  week: { label: "5–9 Day Journeys", min: 5, max: 9 },
  grand: { label: "10+ Day Expeditions", min: 10, max: null },
} as const;

export type LengthToken = keyof typeof LENGTH_BUCKETS;

const LENGTH_TOKEN_SET: ReadonlySet<string> = new Set(Object.keys(LENGTH_BUCKETS));

export function isLengthToken(value: string): value is LengthToken {
  return LENGTH_TOKEN_SET.has(value);
}

/** Does a duration (days) fall in the given length bucket? */
export function durationInBucket(durationDays: number, token: LengthToken): boolean {
  const b = LENGTH_BUCKETS[token];
  return durationDays >= b.min && (b.max === null || durationDays <= b.max);
}

/**
 * "Departing soon" window: an open departure within this many days from now.
 * Used by both the catalog filter and any "last-minute" surfacing.
 */
export const DEPARTING_SOON_DAYS = 45;

/**
 * P6 advanced search — sort options (`?sort=`). "featured" keeps the default
 * catalog order (newest first); the others are stable and URL-shareable.
 */
export const TOUR_SORTS = [
  "featured",
  "price-asc",
  "price-desc",
  "duration-asc",
  "duration-desc",
  "soonest",
] as const;

export type TourSort = (typeof TOUR_SORTS)[number];

/** Default sort when none is supplied / an unknown value is passed. */
export const DEFAULT_TOUR_SORT: TourSort = "featured";

/**
 * Destination slugs the catalog leads with (P8). Ptah's focus is Upper Egypt,
 * so under the default "featured" sort a Luxor or Aswan tour outranks the rest.
 * Nothing is hidden: every other tour still lists, just below these, and any
 * explicit sort (price, duration, soonest) ignores this entirely — a traveler
 * who asked for "cheapest first" means it.
 *
 * Order matters: earlier slugs rank higher.
 */
export const FOCUS_DESTINATION_SLUGS = ["luxor", "aswan"] as const;

/** Featured rank for a tour's destinations — lower sorts first. */
export function focusRank(destinationSlugs: readonly string[]): number {
  // Annotated because `.length` on the readonly tuple is a literal type, which
  // would otherwise reject the assignment below.
  let best: number = FOCUS_DESTINATION_SLUGS.length;
  for (const slug of destinationSlugs) {
    const index = (FOCUS_DESTINATION_SLUGS as readonly string[]).indexOf(slug);
    if (index !== -1 && index < best) best = index;
  }
  return best;
}

const TOUR_SORT_SET: ReadonlySet<string> = new Set(TOUR_SORTS);

/** Type guard: is an arbitrary string one of the known sort tokens? */
export function isTourSort(value: string): value is TourSort {
  return TOUR_SORT_SET.has(value);
}

/**
 * Tour difficulty levels — mirrors the Prisma `Difficulty` enum, kept here as
 * plain string literals so page/param validation needs no Prisma import.
 */
export const TOUR_DIFFICULTIES = ["EASY", "MODERATE", "CHALLENGING"] as const;

export type TourDifficulty = (typeof TOUR_DIFFICULTIES)[number];

const DIFFICULTY_SET: ReadonlySet<string> = new Set(TOUR_DIFFICULTIES);

/** Type guard: is an arbitrary string one of the known difficulty levels? */
export function isTourDifficulty(value: string): value is TourDifficulty {
  return DIFFICULTY_SET.has(value);
}
