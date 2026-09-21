import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import DestinationCard from "@/components/marketing/DestinationCard";
import { cities } from "@/lib/cities";
import { getCountry } from "@/lib/countries";
import { getPublishedTourCountsByDestination } from "@/server/catalog";

export const metadata: Metadata = {
  title: "Cities | Ptah Tours",
  description: "Every city Ptah Tours currently runs tours in.",
};

// Tour counts come from the live catalog (tours publish/unpublish over time).
export const dynamic = "force-dynamic";

export default async function CitiesPage() {
  const counts = await getPublishedTourCountsByDestination();

  const cityCards = cities.map((city) => ({
    slug: city.slug,
    country: getCountry(city.countrySlug)?.name ?? city.countrySlug,
    city: city.name,
    tourCount: counts[city.slug] ?? 0,
    image: city.heroImage,
  }));

  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cities" }]} />

      <div className="mt-6">
        <SectionHeading
          eyebrow="Cities"
          title="Every city on our"
          emphasis="map."
          description="All six currently sit within Egypt — more will be added as our other country programs launch."
        />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cityCards.map((c) => (
          <DestinationCard key={c.slug} destination={c} className="h-64" />
        ))}
      </div>
    </Container>
  );
}
