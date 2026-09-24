/**
 * ToursFinder (P6 advanced search) — the shared, URL-driven finder used by both
 * `/tours` and `/search`. Pure server component: a GET `<form>` plus
 * `LocaleLink` pagination, so it needs no client JS and every result view is a
 * shareable URL. All state lives in the querystring; the parent page validates
 * the params, calls `searchTours`, and passes the resolved page down here.
 *
 * Type / length option labels come from the English `tour-tags` vocabulary
 * (same as the legacy /tours chips — those labels are English-only today); all
 * control chrome comes from the localized `toursFinder` content section.
 */
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import TourCard from "@/components/commerce/TourCard";
import type { TourListItem } from "@/server/catalog";
import type { PageContent } from "@/i18n/pages";
import type { Locale } from "@/i18n/config";
import { localizePath } from "@/i18n/routing";
import {
  TOUR_TAGS,
  TOUR_TAG_LABELS,
  LENGTH_BUCKETS,
  TOUR_DIFFICULTIES,
  TOUR_SORTS,
  type TourTag,
  type LengthToken,
  type TourDifficulty,
  type TourSort,
} from "@/content/tour-tags";

type FinderLabels = PageContent["toursFinder"];

/** Current filter state, already validated by the page (price in whole units). */
export interface ToursFinderCurrent {
  q: string;
  destination?: string;
  type?: TourTag;
  length?: LengthToken;
  difficulty?: TourDifficulty;
  priceMin?: number;
  priceMax?: number;
  departingSoon: boolean;
  sort: TourSort;
}

export interface ToursFinderProps {
  /** "/tours" or "/search" — the locale-agnostic base for every `LocaleLink`
   *  href (the Link wrapper prepends the active locale). The raw GET `<form>`
   *  can't go through that wrapper, so its action is localized here from `locale`. */
  basePath: string;
  /** Active locale, used only to localize the GET `<form action>` (see basePath). */
  locale: Locale;
  items: TourListItem[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  destinations: readonly { slug: string; name: string }[];
  isAuthenticated: boolean;
  current: ToursFinderCurrent;
  t: FinderLabels;
}

/** Serialize the current filters (+ an optional page override) back to a URL,
 *  dropping defaults so shared links stay clean. */
function buildHref(basePath: string, current: ToursFinderCurrent, page = 1): string {
  const sp = new URLSearchParams();
  if (current.q) sp.set("q", current.q);
  if (current.destination) sp.set("destination", current.destination);
  if (current.type) sp.set("type", current.type);
  if (current.length) sp.set("length", current.length);
  if (current.difficulty) sp.set("difficulty", current.difficulty);
  if (current.priceMin != null) sp.set("priceMin", String(current.priceMin));
  if (current.priceMax != null) sp.set("priceMax", String(current.priceMax));
  if (current.departingSoon) sp.set("filter", "departing-soon");
  if (current.sort !== "featured") sp.set("sort", current.sort);
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export default function ToursFinder({
  basePath,
  locale,
  items,
  total,
  page,
  pageSize,
  pageCount,
  destinations,
  isAuthenticated,
  current,
  t,
}: ToursFinderProps) {
  const SORT_LABEL: Record<TourSort, string> = {
    featured: t.sortFeatured,
    "price-asc": t.sortPriceAsc,
    "price-desc": t.sortPriceDesc,
    "duration-asc": t.sortDurationAsc,
    "duration-desc": t.sortDurationDesc,
    soonest: t.sortSoonest,
  };
  const DIFFICULTY_LABEL: Record<TourDifficulty, string> = {
    EASY: t.difficultyEasy,
    MODERATE: t.difficultyModerate,
    CHALLENGING: t.difficultyChallenging,
  };
  const anyActive =
    current.q !== "" ||
    current.destination != null ||
    current.type != null ||
    current.length != null ||
    current.difficulty != null ||
    current.priceMin != null ||
    current.priceMax != null ||
    current.departingSoon ||
    current.sort !== "featured";
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = (page - 1) * pageSize + items.length;
  const unit = total === 1 ? t.resultUnit : t.resultUnitPlural;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const selectClass =
    "mt-1 w-full rounded-lg border border-grey-300/70 bg-white px-3 py-2 text-meta text-ink outline-none focus-visible:border-nile";
  const labelClass = "block text-meta font-semibold text-ink/70";
  // A GET <form> submits to a literal path — it can't run through LocaleLink, so
  // localize its action here or a submit on /fr/tours would bounce to the default
  // locale. The LocaleLink hrefs below keep using the locale-agnostic basePath.
  const formAction = localizePath(basePath, locale);

  return (
    <div className="mt-8">
      <form
        method="get"
        action={formAction}
        aria-label={t.formLabel}
        className="rounded-2xl border border-grey-300/60 bg-papyrus/40 p-4 sm:p-5"
      >
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="search"
            name="q"
            defaultValue={current.q}
            aria-label={t.searchLabel}
            placeholder={t.searchPlaceholder}
            autoComplete="off"
            className="min-w-0 flex-1 rounded-full border border-grey-300/70 bg-white px-5 py-2.5 text-body text-ink outline-none focus-visible:border-nile focus-visible:ring-2 focus-visible:ring-nile/30"
          />
          <button
            type="submit"
            className="rounded-full bg-nile px-6 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-nile/90"
          >
            {t.applyButton}
          </button>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block">
            <span className={labelClass}>{t.destinationLabel}</span>
            <select name="destination" defaultValue={current.destination ?? ""} className={selectClass}>
              <option value="">{t.anyDestination}</option>
              {destinations.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>{t.typeLabel}</span>
            <select name="type" defaultValue={current.type ?? ""} className={selectClass}>
              <option value="">{t.anyType}</option>
              {TOUR_TAGS.map((tag) => (
                <option key={tag} value={tag}>
                  {TOUR_TAG_LABELS[tag]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>{t.lengthLabel}</span>
            <select name="length" defaultValue={current.length ?? ""} className={selectClass}>
              <option value="">{t.anyLength}</option>
              {(Object.keys(LENGTH_BUCKETS) as LengthToken[]).map((token) => (
                <option key={token} value={token}>
                  {LENGTH_BUCKETS[token].label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>{t.difficultyLabel}</span>
            <select name="difficulty" defaultValue={current.difficulty ?? ""} className={selectClass}>
              <option value="">{t.anyDifficulty}</option>
              {TOUR_DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {DIFFICULTY_LABEL[d]}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className={labelClass}>{t.sortLabel}</span>
            <select name="sort" defaultValue={current.sort} className={selectClass}>
              {TOUR_SORTS.map((s) => (
                <option key={s} value={s}>
                  {SORT_LABEL[s]}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3 sm:col-span-2 lg:col-span-1">
            <label className="block">
              <span className={labelClass}>{t.priceMinLabel}</span>
              <input
                type="number"
                name="priceMin"
                min="0"
                inputMode="numeric"
                defaultValue={current.priceMin ?? ""}
                className={selectClass}
              />
            </label>
            <label className="block">
              <span className={labelClass}>{t.priceMaxLabel}</span>
              <input
                type="number"
                name="priceMax"
                min="0"
                inputMode="numeric"
                defaultValue={current.priceMax ?? ""}
                className={selectClass}
              />
            </label>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2 text-meta text-ink/75">
            <input
              type="checkbox"
              name="filter"
              value="departing-soon"
              defaultChecked={current.departingSoon}
              className="h-4 w-4 rounded border-grey-300 text-nile focus-visible:ring-nile/40"
            />
            {t.departingSoonLabel}
          </label>
          {anyActive ? (
            <Link href={basePath} className="text-[13px] font-semibold text-rust hover:underline">
              {t.clearAll}
            </Link>
          ) : null}
        </div>
      </form>
      <p className="mt-6 text-meta text-ink/60">
        {t.resultsRange
          .replace("{from}", String(from))
          .replace("{to}", String(to))
          .replace("{total}", String(total))
          .replace("{unit}", unit)}
      </p>

      <div className="mt-4">
        {items.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((tour) => (
              <TourCard key={tour.slug} tour={tour} isAuthenticated={isAuthenticated} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-grey-300/60 bg-papyrus/50 p-10 text-center">
            <p className="text-card-title font-semibold text-ink">{t.emptyTitle}</p>
            <p className="mt-2 text-body text-ink/60">{t.emptyBody}</p>
            {anyActive ? (
              <p className="mt-3">
                <Link href={basePath} className="font-semibold text-rust hover:underline">
                  {t.clearAll}
                </Link>
              </p>
            ) : null}
          </div>
        )}
      </div>
      {pageCount > 1 ? (
        <nav
          aria-label={t.paginationLabel}
          className="mt-8 flex flex-wrap items-center justify-center gap-1.5"
        >
          {page > 1 ? (
            <Link
              href={buildHref(basePath, current, page - 1)}
              className="rounded-lg border border-grey-300/70 px-3 py-2 text-meta font-semibold text-ink/70 hover:border-nile"
            >
              {t.prev}
            </Link>
          ) : null}
          {pages.map((n) =>
            n === page ? (
              <span
                key={n}
                aria-current="page"
                className="rounded-lg bg-nile px-3.5 py-2 text-meta font-semibold text-white"
              >
                {n}
              </span>
            ) : (
              <Link
                key={n}
                href={buildHref(basePath, current, n)}
                aria-label={t.pageAria.replace("{n}", String(n))}
                className="rounded-lg border border-grey-300/70 px-3.5 py-2 text-meta font-semibold text-ink/70 hover:border-nile"
              >
                {n}
              </Link>
            ),
          )}
          {page < pageCount ? (
            <Link
              href={buildHref(basePath, current, page + 1)}
              className="rounded-lg border border-grey-300/70 px-3 py-2 text-meta font-semibold text-ink/70 hover:border-nile"
            >
              {t.next}
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
