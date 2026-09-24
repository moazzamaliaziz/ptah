import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ToursFinder from "@/components/commerce/ToursFinder";
import { searchTours, listDestinationsWithTours } from "@/server/catalog";
import { getSessionUser } from "@/server/auth/session";
import { toLocale } from "@/i18n/config";
import { getPageContent } from "@/i18n/pages";
import { parseFinderParams, type FinderRawParams } from "@/content/tours-finder";
import { TOUR_TAG_LABELS, LENGTH_BUCKETS } from "@/content/tour-tags";

export const metadata: Metadata = {
  title: "Tours | Ptah Tours",
  description:
    "Browse every Ptah Tours departure across Egypt — Cairo, Luxor, the Nile, and the Red Sea. Private and small-group tours with licensed Egyptologist guides.",
  // Every filter/sort/page variant is a subset — canonicalize them all to the
  // base listing (what the sitemap lists).
  alternates: { canonical: "/tours" },
};

// Catalog reads live data (capacity changes with bookings), so render dynamically.
export const dynamic = "force-dynamic";

export default async function ToursPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<FinderRawParams>;
}) {
  const { lang } = await params;
  const raw = await searchParams;
  const locale = toLocale(lang);
  const { filter, current } = parseFinderParams(raw);

  const [result, destinations, user, pc] = await Promise.all([
    searchTours(filter, locale),
    listDestinationsWithTours(locale),
    getSessionUser(),
    getPageContent(locale),
  ]);
  const isAuthenticated = user !== null;
  const t = pc.tours;

  // A contextual heading when a single facet is active; otherwise the default.
  const activeDestination = current.destination
    ? destinations.find((d) => d.slug === current.destination)
    : undefined;
  const heading = activeDestination
    ? t.headingDestination.replace("{name}", activeDestination.name)
    : current.type
      ? t.headingTag.replace("{label}", TOUR_TAG_LABELS[current.type])
      : current.length
        ? LENGTH_BUCKETS[current.length].label
        : current.departingSoon
          ? t.departingSoon
          : t.headingDefault;

  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: pc.common.home, href: "/" }, { label: t.breadcrumb }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">{t.eyebrow}</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">{heading}</h1>
        <p className="mt-3 text-body text-ink/65">{t.intro}</p>
      </header>

      <ToursFinder
        basePath="/tours"
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
