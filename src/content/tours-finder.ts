/**
 * Pure param-parsing for the P6 tours finder — shared by `/tours` and `/search`
 * so both validate the same querystring vocabulary
 * (`q / destination / type / length / difficulty / priceMin / priceMax / filter / sort / page`)
 * identically. No DB and no `server-only`: it maps raw string params to a
 * validated `TourFilter` (fed to `searchTours`) plus the `ToursFinderCurrent`
 * echo the form re-renders from. Unknown / malformed values are dropped
 * (treated as absent) rather than trusted — the type guards are the allow-list.
 */
import {
  isTourTag,
  isLengthToken,
  isTourSort,
  isTourDifficulty,
  DEFAULT_TOUR_SORT,
} from "@/content/tour-tags";
import type { TourFilter } from "@/server/catalog";
import type { ToursFinderCurrent } from "@/components/commerce/ToursFinder";

/** Raw querystring shape both pages receive (all optional strings). */
export interface FinderRawParams {
  q?: string;
  destination?: string;
  type?: string;
  length?: string;
  difficulty?: string;
  priceMin?: string;
  priceMax?: string;
  filter?: string;
  sort?: string;
  page?: string;
}

export interface ParsedFinder {
  /** Validated filter for `searchTours` (price already ×100 to minor units). */
  filter: TourFilter;
  /** The same state, echoed back for the form's default values + link hrefs. */
  current: ToursFinderCurrent;
}

/** Parse a non-negative integer from a param, else undefined. */
function parseNonNegInt(value: string | undefined): number | undefined {
  if (value == null || value.trim() === "") return undefined;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return undefined;
  return Math.floor(n);
}

export function parseFinderParams(raw: FinderRawParams): ParsedFinder {
  const q = (typeof raw.q === "string" ? raw.q : "").trim();
  const destination =
    typeof raw.destination === "string" && raw.destination.trim() ? raw.destination.trim() : undefined;
  const type = typeof raw.type === "string" && isTourTag(raw.type) ? raw.type : undefined;
  const length = typeof raw.length === "string" && isLengthToken(raw.length) ? raw.length : undefined;
  const difficulty =
    typeof raw.difficulty === "string" && isTourDifficulty(raw.difficulty) ? raw.difficulty : undefined;
  const departingSoon = raw.filter === "departing-soon";
  const sort = typeof raw.sort === "string" && isTourSort(raw.sort) ? raw.sort : DEFAULT_TOUR_SORT;

  // Price inputs are whole currency units; the catalog stores minor units (×100).
  const priceMin = parseNonNegInt(raw.priceMin);
  const priceMax = parseNonNegInt(raw.priceMax);

  const pageNum = parseNonNegInt(raw.page);
  const page = pageNum && pageNum > 0 ? pageNum : 1;

  const filter: TourFilter = {
    q: q || undefined,
    destinationSlug: destination,
    tag: type,
    length,
    difficulty,
    departingSoon: departingSoon || undefined,
    priceMinCents: priceMin != null ? priceMin * 100 : undefined,
    priceMaxCents: priceMax != null ? priceMax * 100 : undefined,
    sort,
    page,
  };

  const current: ToursFinderCurrent = {
    q,
    destination,
    type,
    length,
    difficulty,
    priceMin,
    priceMax,
    departingSoon,
    sort,
  };

  return { filter, current };
}
