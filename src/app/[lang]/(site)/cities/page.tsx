import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import DestinationCard from "@/components/marketing/DestinationCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbLd } from "@/lib/seo/jsonld";
import { cities } from "@/lib/cities";
import { getCountry } from "@/lib/countries";
import { getPublishedTourCountsByDestination } from "@/server/catalog";
import { toLocale } from "@/i18n/config";
import { getPageContent } from "@/i18n/pages";
import { cityContent } from "@/content/city-content";
import { cityImage, type CitySlug } from "@/content/city-media";

export const metadata: Metadata = {
  title: "Egypt Destinations & City Tours | Ptah Tours",
  description:
    "Explore Ptah Tours' Egypt destinations — Cairo, Luxor, Aswan, Alexandria, Hurghada and Sharm el-Sheikh — with guided day trips, excursions and private tours in every city.",
  keywords: [
    "Egypt destinations",
    "Egypt city tours",
    "Cairo tours",
    "Luxor tours",
    "Aswan tours",
    "Alexandria tours",
    "Hurghada excursions",
    "Sharm el-Sheikh excursions",
  ],
  alternates: { canonical: "/cities" },
  openGraph: {
    title: "Egypt Destinations & City Tours | Ptah Tours",
    description:
      "Guided day trips, excursions and private tours across every Egyptian city Ptah Tours operates in.",
    url: "/cities",
    type: "website",
  },
};

// Tour counts come from the live catalog (tours publish/unpublish over time).
export const dynamic = "force-dynamic";

export default async function CitiesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const [counts, pc] = await Promise.all([
    getPublishedTourCountsByDestination(),
    getPageContent(toLocale(lang)),
  ]);
  const t = pc.cities;

  // Prefer each city's curated editorial hero; fall back to the legacy flat
  // image only if a city has no content module yet.
  const cityCards = cities.map((city) => {
    const cs = city.slug as CitySlug;
    const content = cityContent[cs];
    return {
      slug: city.slug,
      country: getCountry(city.countrySlug)?.name ?? city.countrySlug,
      city: city.name,
      tourCount: counts[city.slug] ?? 0,
      image: content ? cityImage(cs, content.heroSlug).src : city.heroImage,
    };
  });

  const breadcrumbLd = buildBreadcrumbLd([
    { name: pc.common.home, path: "/" },
    { name: t.breadcrumb },
  ]);

  return (
    <Container className="py-16">
      <JsonLd data={breadcrumbLd} />
      <Breadcrumbs items={[{ label: pc.common.home, href: "/" }, { label: t.breadcrumb }]} />

      <div className="mt-6">
        <SectionHeading
          eyebrow={t.eyebrow}
          title={t.title}
          emphasis={t.emphasis}
          description={t.description}
        />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cityCards.map((c) => (
          <DestinationCard key={c.slug} destination={c} className="h-72" />
        ))}
      </div>
    </Container>
  );
}
