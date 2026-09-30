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
import FactStrip from "@/components/site/theme/FactStrip";
import FeatureRows from "@/components/site/theme/FeatureRows";
import { ThemeGallery } from "@/components/site/theme/ThemeGallery";
import ImageCredits from "@/components/site/theme/ImageCredits";
import CityAnchorNav from "@/components/site/city/CityAnchorNav";
import CityHighlights from "@/components/site/city/CityHighlights";
import CityTrustBar from "@/components/site/city/CityTrustBar";
import StickyTourCta from "@/components/site/city/StickyTourCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbLd, buildTouristDestinationLd } from "@/lib/seo/jsonld";
import { cities, getCity, citiesByCountry } from "@/lib/cities";
import { getCountry } from "@/lib/countries";
import {
  listPublishedTours,
  getPublishedTourCountsByDestination,
} from "@/server/catalog";
import { getSessionUser } from "@/server/auth/session";
import { toLocale } from "@/i18n/config";
import { getPageContent } from "@/i18n/pages";
import { getThemeEditorial } from "@/content/localized/theme-content";
import { getCityContent } from "@/content/localized/city-content";
import { getUiSupplemental } from "@/content/localized/ui-supplemental";
import { cityMedia, cityImage, type CitySlug } from "@/content/city-media";

// City slugs are static content; the tour list + session are read at request
// time (force-dynamic), so params stay static but data stays live.
export function generateStaticParams() {
  return cities.map((c) => ({ slug: c.slug }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const city = getCity(slug);
  if (!city) return {};
  const cityContent = await getCityContent(toLocale(lang));
  const content = cityContent[city.slug as CitySlug];
  if (!content) return { title: `${city.name} Tours | Ptah Tours`, description: city.intro };
  const hero = cityImage(city.slug as CitySlug, content.heroSlug);
  return {
    title: content.seo.title,
    description: content.seo.description,
    keywords: content.seo.keywords,
    alternates: { canonical: `/cities/${slug}` },
    openGraph: {
      title: content.seo.title,
      description: content.seo.description,
      url: `/cities/${slug}`,
      type: "website",
      images: [{ url: hero.src, width: hero.width, height: hero.height, alt: hero.alt }],
    },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const city = getCity(slug);
  if (!city) notFound();

  const citySlug = city.slug as CitySlug;
  const country = getCountry(city.countrySlug);
  const locale = toLocale(lang);
  const [tours, counts, user, pc, cityContent, theme, ui] = await Promise.all([
    listPublishedTours(city.slug, locale),
    getPublishedTourCountsByDestination(),
    getSessionUser(),
    getPageContent(locale),
    getCityContent(locale),
    getThemeEditorial(locale),
    getUiSupplemental(locale),
  ]);
  const content = cityContent[citySlug];
  if (!content) notFound();
  const isAuthenticated = user !== null;
  const t = pc.cityDetail;
  const hero = cityImage(citySlug, content.heroSlug);
  const media = cityMedia[citySlug];
  const otherEgyptCities = citiesByCountry("egypt")
    .filter((c) => c.slug !== city.slug && (counts[c.slug] ?? 0) > 0)
    .slice(0, 4);

  // Curated "nearby" cards use each destination's editorial hero, not the flat
  // legacy heroImage, so the related strip matches the rest of the redesign.
  const nearbyCards = content.nearby
    .map((ns) => {
      const nc = getCity(ns);
      if (!nc) return null;
      const nHero = cityImage(ns, cityContent[ns].heroSlug);
      return {
        slug: ns,
        country: getCountry(nc.countrySlug)?.name ?? nc.countrySlug,
        city: nc.name,
        tourCount: counts[ns] ?? 0,
        image: nHero.src,
      };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  // One breadcrumb trail drives both the visible nav and the JSON-LD.
  const crumbs = [
    { label: pc.common.home, href: "/" },
    { label: t.breadcrumbCountries, href: "/countries" },
    ...(country ? [{ label: country.name, href: `/countries/${country.slug}` }] : []),
    { label: city.name },
  ];

  const destinationLd = buildTouristDestinationLd({
    name: city.name,
    description: content.seo.description,
    path: `/cities/${slug}`,
    image: hero.src,
    latitude: city.coordinates.lat,
    longitude: city.coordinates.lng,
    attractions: content.highlights.items.map((h) => h.name),
    country: country?.name ?? "Egypt",
  });
  const breadcrumbLd = buildBreadcrumbLd(
    crumbs.map((c) => ({ name: c.label, ...(c.href ? { path: c.href } : {}) })),
  );

  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${city.coordinates.lat},${city.coordinates.lng}`;

  const navSections = [
    { id: "overview", label: ui["cityNav.overview"] },
    { id: "tours", label: ui["cityNav.tours"] },
    { id: "things-to-do", label: ui["cityNav.thingsToDo"] },
    { id: "explore", label: ui["cityNav.explore"] },
    { id: "photos", label: ui["cityNav.photos"] },
    { id: "plan", label: ui["cityNav.plan"] },
    { id: "faq", label: ui["cityNav.faq"] },
  ];
  return (
    <div>
      <JsonLd data={destinationLd} />
      <JsonLd data={breadcrumbLd} />

      {/* Hero */}
      <div className="relative h-[420px] w-full sm:h-[500px]">
        <Image src={hero.src} alt={hero.alt} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-nile/95 via-nile/45 to-nile/10" />
        <Container className="relative flex h-full flex-col justify-end pb-12">
          <Breadcrumbs items={crumbs} />
          <div className="mt-4 max-w-3xl">
            <Eyebrow tone="light">{content.heroEyebrow}</Eyebrow>
            <span className="mt-2 block h-0.5 w-16 rounded-full bg-gold" aria-hidden="true" />
            <h1 className="mt-3 text-hero font-bold text-white">{content.h1}</h1>
            <p className="mt-4 text-body leading-relaxed text-white/85">{content.lede}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button href="#tours" variant="secondary">
                {t.browseTours}
              </Button>
              <Button href="/contact" variant="ghost-light">
                {t.askQuestion}
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container className="pb-20">
        <CityAnchorNav sections={navSections} />

        {/* Overview */}
        <section id="overview" className="scroll-mt-32 pt-14">
          <div className="max-w-3xl space-y-4">
            {content.overview.map((p, i) => (
              <p key={i} className="text-body leading-relaxed text-ink/75">
                {p}
              </p>
            ))}
          </div>
          <div className="mt-10">
            <FactStrip facts={content.facts} />
          </div>
          <div className="mt-10">
            <CityTrustBar />
          </div>
        </section>
        {/* Tours in this city (live catalog) */}
        <section id="tours" className="scroll-mt-32 pt-16">
          <h2 className="text-section-h2 font-bold text-ink">
            {t.toursHeading.replace("{name}", city.name)}
          </h2>
          {tours.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((tour) => (
                <TourCard key={tour.slug} tour={tour} isAuthenticated={isAuthenticated} />
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <EmptyState
                title={t.emptyToursTitle.replace("{name}", city.name)}
                description={t.emptyToursBody}
                links={otherEgyptCities.map((c) => ({ href: `/cities/${c.slug}`, label: c.name }))}
              />
            </div>
          )}
        </section>

        {/* Things to do — ranked highlights */}
        <section id="things-to-do" className="scroll-mt-32 pt-16">
          <CityHighlights head={content.highlights.head} items={content.highlights.items} />
        </section>

        {/* Explore — image-led feature rows */}
        <section id="explore" className="scroll-mt-32 pt-16">
          <FeatureRows
            resolveImage={(s) => cityImage(citySlug, s)}
            head={content.features.head}
            rows={content.features.rows}
          />
        </section>

        {/* Photo gallery */}
        <section id="photos" className="scroll-mt-32 pt-16">
          <ThemeGallery head={content.gallery} images={media} labels={theme.galleryLabels} />
        </section>
        {/* Plan your visit */}
        <section id="plan" className="scroll-mt-32 pt-16">
          <h2 className="text-section-h2 font-bold text-ink">{ui.cityPlanHeading.replace("{name}", city.name)}</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-grey-300/60 bg-papyrus/50 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-rust">
                <Calendar size={20} />
                <p className="text-eyebrow uppercase tracking-[0.14em]">{content.whenToGo.head.eyebrow}</p>
              </div>
              <h3 className="mt-2 text-kbyg-h2 font-bold text-ink">{content.whenToGo.head.heading}</h3>
              <div className="mt-3 space-y-3 text-body leading-relaxed text-ink/75">
                {content.whenToGo.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-grey-300/60 bg-papyrus/50 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-rust">
                <MapPin size={20} />
                <p className="text-eyebrow uppercase tracking-[0.14em]">{content.gettingThere.head.eyebrow}</p>
              </div>
              <h3 className="mt-2 text-kbyg-h2 font-bold text-ink">{content.gettingThere.head.heading}</h3>
              <div className="mt-3 space-y-3 text-body leading-relaxed text-ink/75">
                {content.gettingThere.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-meta font-semibold text-nile underline underline-offset-4 hover:text-rust"
              >
                <MapPin size={16} /> {ui.cityViewOnMaps.replace("{name}", city.name)}
              </a>
            </div>
          </div>
        </section>

        {/* FAQ (visible accordion — no FAQPage schema by design) */}
        {content.faqs.length > 0 && (
          <section id="faq" className="max-w-3xl scroll-mt-32 pt-16">
            <h2 className="text-section-h2 font-bold text-ink">{t.faqHeading}</h2>
            <div className="mt-6 divide-y divide-grey-300/50 rounded-2xl border border-grey-300/60 bg-white">
              {content.faqs.map((faq) => (
                <details key={faq.q} className="group p-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-meta font-semibold text-ink [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span className="shrink-0 text-lg text-rust transition-transform group-open:rotate-45" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p className="mt-2 text-meta leading-relaxed text-ink/70">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}
        {/* Nearby / related destinations (internal linking) */}
        {nearbyCards.length > 0 && (
          <section className="pt-16">
            <h2 className="text-section-h2 font-bold text-ink">{t.relatedCities}</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {nearbyCards.map((c) => (
                <DestinationCard key={c.slug} destination={c} className="h-52" />
              ))}
            </div>
          </section>
        )}

        {/* Conversion band */}
        <section className="mt-16 flex flex-col items-center gap-4 rounded-3xl bg-nile px-8 py-12 text-center">
          <h2 className="text-fwcta-h2 font-bold text-white">
            {t.ctaHeading.replace("{name}", city.name)}
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button href="#tours" variant="secondary">
              {t.browseTours}
            </Button>
            <Button href="/contact" variant="ghost-light">
              {t.askQuestion}
            </Button>
          </div>
        </section>

        {/* Image credits & licenses */}
        <div className="mt-12">
          <ImageCredits images={media} summary={content.creditsSummary} />
        </div>
      </Container>

      <StickyTourCta label={t.browseTours} />
    </div>
  );
}

