import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import CountryCard from "@/components/marketing/CountryCard";
import { countries } from "@/lib/countries";
import { citiesByCountry } from "@/lib/cities";
import { getPublishedTourCountsByDestination } from "@/server/catalog";

export const metadata: Metadata = {
  title: "Countries | Ptah Tours",
  description:
    "Browse every country Ptah Tours operates in — Egypt, Jordan, Morocco, the UAE, Saudi Arabia and Albania.",
};

// Tour counts come from the live catalog.
export const dynamic = "force-dynamic";

export default async function CountriesPage() {
  const counts = await getPublishedTourCountsByDestination();

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
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Countries" }]} />

      <div className="mt-6">
        <SectionHeading
          eyebrow="Destinations"
          title="Every country we"
          emphasis="operate in."
          description="Egypt is where our itineraries run deepest today. The rest of the region is opening up one city at a time."
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
