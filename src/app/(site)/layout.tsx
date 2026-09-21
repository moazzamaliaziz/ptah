import type { ReactNode } from "react";
import SkipLink from "@/components/site/SkipLink";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import CookieBanner from "@/components/site/CookieBanner";
import AnalyticsScripts from "@/components/site/AnalyticsScripts";
import FloatingWidgets from "@/components/site/FloatingWidgets";

/* No-JS fallback (design.md §4.5 "carousels animate via JS-driven transforms").
   The hero title/hotspots and the story text reveal are revealed by state
   classes that only JS (Swiper) adds; without scripting they would stay at
   opacity:0. This <noscript> stylesheet shows the first slide of each
   full-bleed carousel and reveals its copy, so the page stays readable.
   Harmless when scripting is enabled (browsers ignore noscript content). */
const NO_SCRIPT_FALLBACK = `<style>
  .hero__slide:not(:first-child),
  .stories__slide:not(:first-child) { display: none !important; }
  .hero__title, .hero__hotspot, .hero__hotspot-links, .story__text {
    opacity: 1 !important;
    transform: none !important;
  }
  .hero__zone, .hero__playpause { display: none !important; }
</style>`;

/**
 * Public-site layout (route group `(site)`): the global chrome that every
 * public page shares. Kept out of the root layout so /admin renders without
 * it. The header + footer read DB-driven branding via getSettings() (Phase 7
 * S3), so pages under this layout render dynamically; the short-TTL settings
 * cache keeps that cheap. MAINTENANCE_MODE is enforced at the proxy layer.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <noscript dangerouslySetInnerHTML={{ __html: NO_SCRIPT_FALLBACK }} />
      <SkipLink />
      <SiteHeader />
      <div id="reach-skip-nav" data-reach-skip-nav-content>
        <main id="main">{children}</main>
      </div>
      <SiteFooter />
      {/* Admin-managed floating contact widgets (Phase 7 S4). */}
      <FloatingWidgets />
      <CookieBanner />
      {/* Toggle-driven analytics/monitoring tags (public site only). */}
      <AnalyticsScripts />
    </>
  );
}
