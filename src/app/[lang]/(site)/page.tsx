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
import { toLocale, localeHtmlLang } from "@/i18n/config";
import { getImageAltOverlay, localizeImages } from "@/content/localized/image-alt";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ptahtours.com";

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
  const [{ heroSlides, inspiredTabs, planCta, fiftyCtas, kbygItems, tourTypes }, landing, pc, altOverlay] =
    await Promise.all([getLandingContent(locale), getLandingDefaults(locale), getPageContent(locale), getImageAltOverlay(locale)]);
  const siteMeta = landing.siteMeta;

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
      <GetInspired tabs={inspiredTabs} />

      {/* 3.3 Plan Your Dream Trip — full-bleed CTA */}
      <PlanCta block={planCta} />

      {/* 3.4 50/50 CTA pair */}
      <FiftyCtas items={fiftyCtas} />

      {/* 3.5 Know Before You Go */}
      <Kbyg items={kbygItems} />

      {/* 3.6 Tour Types (the reference "Find Accommodation" slot) */}
      <TourTypes items={tourTypes} />

      {/* 3.6b Real travelers, real moments — featured guest photos → /gallery */}
      <TravelersShowcase photos={localizeImages(featuredPhotos, altOverlay)} strings={pc.gallery.showcase} />

      {/* 3.7 The Journal — static blog card grid (replaces DB Stories carousel) */}
      <LandingJournal locale={locale} />

      {/* 3.8 FAQ accordion — nearest the footer, emits FAQPage JSON-LD */}
      <LandingFaqs />
    </>
  );
}