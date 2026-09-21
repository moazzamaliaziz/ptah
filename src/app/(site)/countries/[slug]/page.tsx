import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MapPin, Calendar, Plane } from "lucide-react";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import Eyebrow from "@/components/ui/Eyebrow";
import DestinationCard from "@/components/marketing/DestinationCard";
import TourCard from "@/components/commerce/TourCard";
import EmptyState from "@/components/marketing/EmptyState";
import { countries, getCountry } from "@/lib/countries";
import { citiesByCountry } from "@/lib/cities";
import {
  listPublishedToursForDestinations,
  getPublishedTourCountsByDestination,
} from "@/server/catalog";
import { getSessionUser } from "@/server/auth/session";

export function generateStaticParams() {
  return countries.map((c) => ({ slug: c.slug }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const country = getCountry(slug);
  if (!country) return {};
  return {
    title: `${country.name} Tours | Ptah Tours`,
    description: country.intro,
    alternates: { canonical: `/countries/${slug}` },
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const country = getCountry(slug);
  if (!country) notFound();

  const cities = citiesByCountry(country.slug);
  const citySlugs = cities.map((c) => c.slug);

  const [tours, counts, user] = await Promise.all([
    listPublishedToursForDestinations(citySlugs),
    getPublishedTourCountsByDestination(),
    getSessionUser(),
  ]);
  const isAuthenticated = user !== null;
  const featuredTours = tours.slice(0, 6);

  return (
    <div>
      <div className="relative h-[420px] w-full sm:h-[480px]">
        <Image src={country.heroImage} alt={country.name} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-nile/90 via-nile/35 to-nile/10" />
        <Container className="relative flex h-full flex-col justify-end pb-10">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Countries", href: "/countries" },
              { label: country.name },
            ]}
          />
          <p className="mt-4 text-meta font-medium text-white/75">{country.tagline}</p>
          <h1 className="mt-1 text-hero font-bold text-white">{country.name}</h1>
        </Container>
      </div>

      <Container className="py-16">
        {/* Intro */}
        <div className="max-w-2xl">
          <Eyebrow>Overview</Eyebrow>
          <p className="mt-3 text-kbyg-h2 font-semibold leading-snug text-ink">{country.intro}</p>
          <p className="mt-4 text-body leading-relaxed text-ink/70">{country.overview}</p>
        </div>

        {/* Popular cities */}
        <section className="mt-16">
          <h2 className="text-section-h2 font-bold text-ink">Popular cities</h2>
          {cities.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cities.map((city) => (
                <DestinationCard
                  key={city.slug}
                  destination={{
                    slug: city.slug,
                    country: country.name,
                    city: city.name,
                    tourCount: counts[city.slug] ?? 0,
                    image: city.heroImage,
                  }}
                  className="h-64"
                />
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState
                title="City guides are coming soon."
                description={`We're still building out ${country.name}'s city pages. In the meantime, explore where our itineraries already run.`}
                links={[{ href: "/countries/egypt", label: "Explore Egypt" }]}
              />
            </div>
          )}
        </section>

        {/* Featured tours (live catalog) */}
        <section className="mt-16">
          <h2 className="text-section-h2 font-bold text-ink">Featured tours</h2>
          {featuredTours.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredTours.map((tour) => (
                <TourCard key={tour.slug} tour={tour} isAuthenticated={isAuthenticated} />
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState
                title={`${country.name} tours are coming soon.`}
                description="We're finalizing itineraries for this destination — check back shortly, or explore tours already running in Egypt."
                links={[{ href: "/tours", label: "Browse all tours" }]}
              />
            </div>
          )}
        </section>

        {/* Why visit / things to do */}
        <section className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-section-h2 font-bold text-ink">Why visit {country.name}</h2>
            <ul className="mt-5 space-y-3">
              {country.whyVisit.map((point) => (
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
              {country.thingsToDo.map((item) => (
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
              <p className="mt-1 text-meta text-ink/65">{country.bestTimeToVisit}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Plane className="mt-0.5 shrink-0 text-rust" size={20} />
            <div>
              <p className="text-meta font-semibold text-ink">Getting there</p>
              <p className="mt-1 text-meta text-ink/65">{country.travelInfo}</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        {country.faqs.length > 0 && (
          <section className="mt-16 max-w-2xl">
            <h2 className="text-section-h2 font-bold text-ink">Frequently asked questions</h2>
            <div className="mt-6 divide-y divide-grey-300/50 rounded-2xl border border-grey-300/60 bg-white">
              {country.faqs.map((faq) => (
                <div key={faq.q} className="p-5">
                  <p className="text-meta font-semibold text-ink">{faq.q}</p>
                  <p className="mt-1.5 text-meta text-ink/65">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="mt-16 flex flex-col items-center gap-4 rounded-3xl bg-nile px-8 py-12 text-center">
          <MapPin className="text-white/70" size={22} />
          <h2 className="text-fwcta-h2 font-bold text-white">Explore {country.name} tours</h2>
          <p className="max-w-md text-meta text-white/75">
            Tell us your dates and we&apos;ll put together an itinerary, or browse what&apos;s already running.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button href="/tours" variant="primary">
              Browse Tours
            </Button>
            <Button href="/contact" variant="secondary">
              Talk to us
            </Button>
          </div>
        </section>
      </Container>
    </div>
  );
}
