import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, Calendar } from "lucide-react";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import TourCard from "@/components/commerce/TourCard";
import DestinationCard from "@/components/marketing/DestinationCard";
import EmptyState from "@/components/marketing/EmptyState";
import { cities, getCity, citiesByCountry } from "@/lib/cities";
import { getCountry } from "@/lib/countries";
import {
  listPublishedTours,
  getPublishedTourCountsByDestination,
} from "@/server/catalog";
import { getSessionUser } from "@/server/auth/session";

// City slugs are static content; the tour list + session are read at request
// time (force-dynamic), so params stay static but data stays live.
export function generateStaticParams() {
  return cities.map((c) => ({ slug: c.slug }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) return {};
  return {
    title: `${city.name} Tours | Ptah Tours`,
    description: city.intro,
    alternates: { canonical: `/cities/${slug}` },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();

  const country = getCountry(city.countrySlug);
  const [tours, counts, user] = await Promise.all([
    listPublishedTours(city.slug),
    getPublishedTourCountsByDestination(),
    getSessionUser(),
  ]);
  const isAuthenticated = user !== null;

  const otherEgyptCities = citiesByCountry("egypt")
    .filter((c) => c.slug !== city.slug && (counts[c.slug] ?? 0) > 0)
    .slice(0, 4);
  const relatedCities = citiesByCountry(city.countrySlug)
    .filter((c) => c.slug !== city.slug)
    .slice(0, 4);

  return (
    <div>
      <div className="relative h-[380px] w-full sm:h-[440px]">
        <Image src={city.heroImage} alt={city.name} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-nile/90 via-nile/35 to-nile/10" />
        <Container className="relative flex h-full flex-col justify-end pb-10">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Countries", href: "/countries" },
              ...(country ? [{ label: country.name, href: `/countries/${country.slug}` }] : []),
              { label: city.name },
            ]}
          />
          <p className="mt-4 text-meta font-medium text-white/75">{city.tagline}</p>
          <h1 className="mt-1 text-hero font-bold text-white">{city.name}</h1>
        </Container>
      </div>

      <Container className="py-16">
        <div className="max-w-2xl">
          <Eyebrow>{country?.name ?? "Destination"}</Eyebrow>
          <p className="mt-3 text-kbyg-h2 font-semibold leading-snug text-ink">{city.intro}</p>
          <p className="mt-4 text-body leading-relaxed text-ink/70">{city.about}</p>
        </div>

        {/* Tours in this city (live catalog) */}
        <section className="mt-16">
          <h2 className="text-section-h2 font-bold text-ink">Tours in {city.name}</h2>
          {tours.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((tour) => (
                <TourCard key={tour.slug} tour={tour} isAuthenticated={isAuthenticated} />
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState
                title={`${city.name} journeys are coming soon.`}
                description="We haven't published tours here yet — explore other Egypt destinations in the meantime."
                links={otherEgyptCities.map((c) => ({
                  href: `/cities/${c.slug}`,
                  label: c.name,
                }))}
              />
            </div>
          )}
        </section>

        {/* Popular experiences / things to do */}
        <section className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-section-h2 font-bold text-ink">Popular experiences</h2>
            <ul className="mt-5 space-y-3">
              {city.popularExperiences.map((point) => (
                <li key={point} className="flex gap-3 text-body text-ink/70">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-section-h2 font-bold text-ink">Things to do</h2>
            <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {city.thingsToDo.map((item) => (
                <li
                  key={item}
                  className="rounded-xl border border-grey-300/60 bg-papyrus/50 px-4 py-3 text-meta text-ink/85"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Travel info */}
        <section className="mt-16 grid grid-cols-1 gap-4 rounded-2xl border border-grey-300/60 bg-papyrus/50 p-6 sm:grid-cols-2 sm:p-8">
          <div className="flex gap-3">
            <Calendar className="mt-0.5 shrink-0 text-rust" size={20} />
            <div>
              <p className="text-meta font-semibold text-ink">Best time to visit</p>
              <p className="mt-1 text-meta text-ink/65">{city.bestTimeToVisit}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <MapPin className="mt-0.5 shrink-0 text-rust" size={20} />
            <div>
              <p className="text-meta font-semibold text-ink">Getting there</p>
              <p className="mt-1 text-meta text-ink/65">{city.travelInfo}</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        {city.faqs.length > 0 && (
          <section className="mt-16 max-w-2xl">
            <h2 className="text-section-h2 font-bold text-ink">Frequently asked questions</h2>
            <div className="mt-6 divide-y divide-grey-300/50 rounded-2xl border border-grey-300/60 bg-white">
              {city.faqs.map((faq) => (
                <div key={faq.q} className="p-5">
                  <p className="text-meta font-semibold text-ink">{faq.q}</p>
                  <p className="mt-1.5 text-meta text-ink/65">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related cities */}
        {relatedCities.length > 0 && (
          <section className="mt-16">
            <h2 className="text-section-h2 font-bold text-ink">Related cities</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {relatedCities.map((c) => (
                <DestinationCard
                  key={c.slug}
                  destination={{
                    slug: c.slug,
                    country: country?.name ?? c.countrySlug,
                    city: c.name,
                    tourCount: counts[c.slug] ?? 0,
                    image: c.heroImage,
                  }}
                  className="h-52"
                />
              ))}
            </div>
          </section>
        )}

        <section className="mt-16 flex flex-col items-center gap-4 rounded-3xl bg-nile px-8 py-12 text-center">
          <h2 className="text-fwcta-h2 font-bold text-white">Ready to explore {city.name}?</h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button href="/tours" variant="primary">
              Browse Tours
            </Button>
            <Button href="/contact" variant="secondary">
              Ask us a question
            </Button>
          </div>
        </section>
      </Container>
    </div>
  );
}
