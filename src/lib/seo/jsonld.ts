/**
 * Structured-data (JSON-LD) builders for the destination pages.
 *
 * What Google actually rewards here (2025): BreadcrumbList is rich-result
 * eligible and IS emitted. TouristDestination / TouristAttraction are
 * *semantic* types — they help entity understanding but are not rich-eligible,
 * so we keep them lean. FAQPage is deliberately NOT emitted (Google restricted
 * FAQ rich results to authoritative gov/health sites in 2023); the visible FAQ
 * accordion carries the SEO value on its own. HowTo is deprecated — never used.
 *
 * The site-wide Organization/WebSite nodes are declared once on the landing
 * page (@id `${siteUrl}/#organization`). We only REFERENCE that id here so the
 * knowledge graph stays connected without duplicate entity definitions.
 *
 * These builders return plain objects; render them with <JsonLd> which escapes
 * every "<" to its unicode form (CSP-safe, no script-injection surface).
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ptahtours.com";

/** Absolute URL for a site-relative path (JSON-LD requires absolute URLs). */
function abs(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export interface BreadcrumbItem {
  name: string;
  /** Site-relative path, e.g. "/cities/luxor". Omit on the current page's leaf. */
  path?: string;
}

/**
 * BreadcrumbList — rich-result eligible. Google shows the trail in the SERP and
 * uses it to understand site hierarchy. Positions are 1-based and contiguous.
 */
export function buildBreadcrumbLd(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.path ? { item: abs(item.path) } : {}),
    })),
  };
}

export interface TouristDestinationInput {
  /** City display name, e.g. "Luxor". */
  name: string;
  /** One-line description (reuse the meta description). */
  description: string;
  /** Canonical site-relative path, e.g. "/cities/luxor". */
  path: string;
  /** Primary hero image (site-relative or absolute). */
  image: string;
  /** Geo coordinates from src/lib/cities.ts. */
  latitude: number;
  longitude: number;
  /** Headline attractions → TouristAttraction children (name only). */
  attractions: string[];
  /** Country the destination sits in, e.g. "Egypt". */
  country: string;
}

/**
 * TouristDestination — semantic entity for the city. Not rich-eligible, so it
 * stays lean: identity, geo, the attractions it includes, and a link back to
 * the site's Organization as provider. `includesAttraction` lists each headline
 * sight as a lightweight TouristAttraction node.
 */
export function buildTouristDestinationLd(input: TouristDestinationInput) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "@id": `${abs(input.path)}#destination`,
    name: input.name,
    description: input.description,
    url: abs(input.path),
    image: abs(input.image),
    geo: {
      "@type": "GeoCoordinates",
      latitude: input.latitude,
      longitude: input.longitude,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: input.name,
      addressCountry: input.country,
    },
    includesAttraction: input.attractions.map((name) => ({
      "@type": "TouristAttraction",
      name,
    })),
    // Connect to the site entity declared on the landing page (no re-definition).
    provider: { "@id": `${SITE_URL}/#organization` },
  };
}
