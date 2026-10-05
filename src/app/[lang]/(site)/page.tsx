import type { JSX } from "react";
import type { Metadata } from "next";
import HeroInspiration from "@/components/landing/HeroInspiration";
import GetInspired from "@/components/landing/GetInspired";
import PlanCta from "@/components/landing/PlanCta";
import FiftyCtas from "@/components/landing/FiftyCtas";
import Kbyg from "@/components/landing/Kbyg";
import TourTypes from "@/components/landing/TourTypes";
import TravelersShowcase from "@/components/landing/TravelersShowcase";
import LandingJournal from "@/components/landing/LandingJournal";
import LandingFaqs from "@/components/landing/LandingFaqs";
import { featuredPhotos } from "@/content/gallery";
import { getLandingContent } from "@/server/content";
import { getLandingDefaults } from "@/content/localized/landing";
import { getPageContent } from "@/i18n/pages";
import { toLocale, localeHtmlLang, type Locale } from "@/i18n/config";
import { listDestinationNames, listPublishedToursForDestinations } from "@/server/catalog";
import { FOCUS_IDEA_SLUGS, pickIdeaCards, type InspiredCard, type InspiredTab } from "@/content/landing";
import { FOCUS_DESTINATION_SLUGS } from "@/content/tour-tags";
import { logger } from "@/lib/logger";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ptahtours.com";

/** Most curated trip ideas to show for a focus destination with no tours yet. */
const FOCUS_FALLBACK_LIMIT = 4;

/**
 * Build the "Get Inspired" tabs around the focus destinations (P8).
 *
 * One tab per focus destination — Luxor, then Aswan — showing that
 * destination's real published tours, newest first. A destination with NO tours
 * yet shows its curated trip ideas instead, so the rail is never empty while
 * the catalog is filling out. The ideas are looked up inside the ACTIVE
 * locale's own tabs, so they come pre-translated.
 *
 * Tours and ideas are deliberately not mixed: several ideas cover the same
 * subject as a day tour ("Karnak by Day, Luxor Temple by Night" beside a
 * "Karnak & Luxor Temple" tour), and side by side on one rail they read as
 * duplicates. Once a destination has any tour at all, the tours speak for it.
 *
 * Falls back to the stock tabs entirely if neither destination resolves (e.g. a
 * database that has not been seeded) — the homepage then renders exactly as it
 * did before rather than showing an empty section.
 */
async function buildFocusTabs(locale: Locale, stockTabs: InspiredTab[]): Promise<InspiredTab[]> {
  let names: { slug: string; name: string }[];
  let tours: Awaited<ReturnType<typeof listPublishedToursForDestinations>>;
  try {
    [names, tours] = await Promise.all([
      listDestinationNames(FOCUS_DESTINATION_SLUGS, locale),
      listPublishedToursForDestinations([...FOCUS_DESTINATION_SLUGS], locale),
    ]);
  } catch (error) {
    // The landing is statically prerendered, so an unreachable database at
    // build time must degrade to the static editorial — never fail the build.
    // This mirrors how `readOverrides` in src/server/content.ts treats the CMS.
    logger.warn("focus tours unreadable — using the static inspired tabs", { error });
    return stockTabs;
  }
  if (names.length === 0) return stockTabs;

  const tabs = names.map(({ slug, name }) => {
    const tourCards: InspiredCard[] = tours
      .filter((t) => t.destinationSlugs.includes(slug))
      .map((t) => ({
        title: t.title,
        href: `/tours/${t.slug}`,
        days: t.durationDays,
        priceFromCents: t.fromPriceCents,
        currency: t.currency,
        image: { src: t.heroImage ?? "", alt: t.title },
      }))
      // A tour with no hero image would render an empty card frame.
      .filter((c) => c.image.src !== "");

    const cards =
      tourCards.length > 0
        ? tourCards
        : pickIdeaCards(stockTabs, FOCUS_IDEA_SLUGS[slug] ?? []).slice(0, FOCUS_FALLBACK_LIMIT);
    return { key: slug, label: name, cards };
  });

  const withCards = tabs.filter((t) => t.cards.length > 0);
  return withCards.length > 0 ? withCards : stockTabs;
}

/* ISR: the landing is DB-driven (Q4 CMS) but must stay fast (§9 perf budgets),
   so it is statically rendered and revalidated. Editing a section in the admin
   CMS surfaces within this window (or immediately if a later phase adds an
   on-save revalidatePath). Reads no cookies/headers → not per-request dynamic. */
export const revalidate = 60;

/* Canonical for the landing route only — the layout sets no canonical, so
   other routes stay free to declare their own (§9 head conventions). */
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Landing page (design.md §3, DOM order).
 *
 * Phase 1b assembly: the 7 sections render from the typed SSOT in
 * src/content/landing.ts, in the reference's content[] order. Static sections
 * are server components; the interactive islands ("use client") own the Swiper
 * engines, tabs, media-query swaps and motion choreography.
 *
 * The single sr-only h1 lives here (visual hierarchy starts at H2, §6.1); the
 * hero band is pulled under the sticky chrome by CSS (.hero margin-top) so the
 * transparent header's on-dark state reads over the imagery.
 */
export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<JSX.Element> {
  const { lang } = await params;
  const locale = toLocale(lang);
  const [{ heroSlides, inspiredTabs, planCta, fiftyCtas, kbygItems, tourTypes }, landing, pc] =
    await Promise.all([getLandingContent(locale), getLandingDefaults(locale), getPageContent(locale)]);
  const siteMeta = landing.siteMeta;
  // "Get Inspired" leads with real Luxor and Aswan tours; see buildFocusTabs.
  const focusTabs = await buildFocusTabs(locale, inspiredTabs);

  /* Structured data (design.md §2.7 / §9): WebSite + SearchAction + Organization,
     inline JSON-LD (inert data, CSP-safe per src/proxy.ts). name/legalName are the
     brand identity (kept verbatim across locales); the tagline/slogan and
     inLanguage follow the active locale. XSS hardening: every "<" is escaped to
     its unicode form so no value can break out of the <script>. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: siteMeta.name,
        description: siteMeta.tagline,
        inLanguage: localeHtmlLang[locale],
        publisher: { "@id": `${siteUrl}/#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/search?term={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: siteMeta.name,
        legalName: siteMeta.legalName,
        url: siteUrl,
        slogan: siteMeta.tagline,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <h1 className="sr-only">{siteMeta.name} — Home</h1>

      {/* 3.1 Hero — InspirationSelector */}
      <HeroInspiration slides={heroSlides} />

      {/* 3.2 Get Inspired — tabs + card rails */}
      <GetInspired tabs={focusTabs} />

      {/* 3.3 Plan Your Dream Trip — full-bleed CTA */}
      <PlanCta block={planCta} />

      {/* 3.4 50/50 CTA pair */}
      <FiftyCtas items={fiftyCtas} />

      {/* 3.5 Know Before You Go */}
      <Kbyg items={kbygItems} />

      {/* 3.6 Tour Types (the reference "Find Accommodation" slot) */}
      <TourTypes items={tourTypes} />

      {/* 3.6b Real travelers, real moments — featured guest photos → /gallery */}
      <TravelersShowcase photos={featuredPhotos} strings={pc.gallery.showcase} />

      {/* 3.7 The Journal — static blog card grid (replaces DB Stories carousel) */}
      <LandingJournal locale={locale} />

      {/* 3.8 FAQ accordion — nearest the footer, emits FAQPage JSON-LD */}
      <LandingFaqs />
    </>
  );
}