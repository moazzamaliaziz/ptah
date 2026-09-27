import type { JSX } from "react";
import type { Metadata } from "next";
import HeroInspiration from "@/components/landing/HeroInspiration";
import GetInspired from "@/components/landing/GetInspired";
import PlanCta from "@/components/landing/PlanCta";
import FiftyCtas from "@/components/landing/FiftyCtas";
import Kbyg from "@/components/landing/Kbyg";
import TourTypes from "@/components/landing/TourTypes";
import Stories from "@/components/landing/Stories";
import TravelersShowcase from "@/components/landing/TravelersShowcase";
import { siteMeta } from "@/content/landing";
import { featuredPhotos } from "@/content/gallery";
import { getLandingContent } from "@/server/content";
import { getPageContent } from "@/i18n/pages";

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

/* Structured data (design.md §2.7 note / §9 Phase 7): WebSite + SearchAction +
   Organization. Rendered inline as JSON-LD (inert data, not executable JS, so
   it is compatible with the CSP in src/proxy.ts). `legalName`/`tagline` from
   the content SSOT are the Organization's legal identity and slogan.

   XSS hardening: the values below are static today, but the Phase-2 CMS
   contract makes them editor-supplied (ContentSection rows). The serializer
   below escapes every less-than character to its unicode escape so no value
   can break out of the script element via a closing tag or comment sequence.
   Standard Next.js JSON-LD pattern. */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteMeta.name,
      description: siteMeta.tagline,
      inLanguage: "en",
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
export default async function Home(): Promise<JSX.Element> {
  const { heroSlides, inspiredTabs, planCta, fiftyCtas, kbygItems, tourTypes, stories } =
    await getLandingContent();
  const pc = await getPageContent();

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
      <TravelersShowcase photos={featuredPhotos} strings={pc.gallery.showcase} />

      {/* 3.7 Featured Stories */}
      <Stories items={stories} />
    </>
  );
}