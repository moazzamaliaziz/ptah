import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ToursFinder from "@/components/commerce/ToursFinder";
import { searchTours, listDestinationsWithTours } from "@/server/catalog";
import { getSessionUser } from "@/server/auth/session";
import { toLocale } from "@/i18n/config";
import { getPageContent } from "@/i18n/pages";
import { parseFinderParams, type FinderRawParams } from "@/content/tours-finder";

/* On-site search results are per-query and thin — never index them (Google's
   own guidance), but the homepage WebSite `SearchAction` still resolves here so
   the sitelinks searchbox works. */
export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

// Results depend on the query params and live catalog state.
export const dynamic = "force-dynamic";

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<FinderRawParams & { term?: string }>;
}) {
  const { lang } = await params;
  const raw = await searchParams;
  const locale = toLocale(lang);

  // The homepage/global search box posts `?term=`; the finder posts `?q=`.
  // Treat them as the same field, preferring an explicit `q`.
  const { filter, current } = parseFinderParams({ ...raw, q: raw.q ?? raw.term });

  const [result, destinations, user, pc] = await Promise.all([
    searchTours(filter, locale),
    listDestinationsWithTours(locale),
    getSessionUser(),
    getPageContent(locale),
  ]);
  const isAuthenticated = user !== null;
  const t = pc.search;

  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: pc.common.home, href: "/" }, { label: t.breadcrumb }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">{t.eyebrow}</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">
          {current.q ? t.headingResults.replace("{query}", current.q) : t.headingDefault}
        </h1>
        <p className="mt-3 text-body text-ink/65">
          {current.q
            ? t.introResults
                .replace("{count}", String(result.total))
                .replace("{unit}", result.total === 1 ? t.resultUnit : t.resultUnitPlural)
            : t.introDefault}
        </p>
      </header>

      <ToursFinder
        basePath="/search"
        locale={locale}
        items={result.items}
        total={result.total}
        page={result.page}
        pageSize={result.pageSize}
        pageCount={result.pageCount}
        destinations={destinations}
        isAuthenticated={isAuthenticated}
        current={current}
        t={pc.toursFinder}
      />
    </Container>
  );
}
