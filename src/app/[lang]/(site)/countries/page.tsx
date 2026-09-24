import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import CountryCard from "@/components/marketing/CountryCard";
import { countries } from "@/lib/countries";
import { citiesByCountry } from "@/lib/cities";
import { getPublishedTourCountsByDestination } from "@/server/catalog";
import { toLocale } from "@/i18n/config";
import { getPageContent } from "@/i18n/pages";

export const metadata: Metadata = {
  title: "Countries | Ptah Tours",
  description:
    "Browse every country Ptah Tours operates in — Egypt, Jordan, Morocco, the UAE, Saudi Arabia and Albania.",
};

// Tour counts come from the live catalog.
export const dynamic = "force-dynamic";

export default async function CountriesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const [counts, pc] = await Promise.all([
    getPublishedTourCountsByDestination(),
    getPageContent(toLocale(lang)),
  ]);
  const t = pc.countries;

  const countryCards = countries.map((country) => {
    const countryCities = citiesByCountry(country.slug);
    const tourCount = countryCities.reduce((sum, city) => sum + (counts[city.slug] ?? 0), 0);
    return {
      slug: country.slug,
      name: country.name,
      tagline: country.tagline,
      heroImage: country.heroImage,
      cityCount: countryCities.length,
      tourCount,
    };
  });

  return (
    <Container className="py-16">
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
        {countryCards.map((country) => (
          <CountryCard key={country.slug} country={country} />
        ))}
      </div>
    </Container>
  );
}
