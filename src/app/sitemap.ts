import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { listPublishedTourSlugs } from "@/server/catalog";
import { listPublishedEventSlugs, listPublishedTripIdeaSlugs } from "@/server/events";
import { logger } from "@/lib/logger";
import { locales, localeHtmlLang, defaultLocale } from "@/i18n/config";
import { localizePath } from "@/i18n/routing";

/**
 * Dynamic sitemap (Phase 5, Q15). Lists the indexable public surface only —
 * marketing + legal pages and every PUBLISHED tour detail page. Deliberately
 * excludes the `robots:{index:false}` routes (account/auth, booking outcomes)
 * and the admin area, matching robots.ts.
 *
 * Tour slugs are read from the DB at request time; a DB hiccup degrades to the
 * static routes rather than 500-ing the sitemap.
 */
const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

/* Regenerate hourly so tours published via the admin CMS appear without a
   redeploy (the catalog is DB-driven). Cheap: one indexed slug query per hour. */
export const revalidate = 3600;

/** Static indexable routes with sensible change/priority hints. */
const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/tours", changeFrequency: "daily", priority: 0.9 },
  { path: "/trip-ideas", changeFrequency: "weekly", priority: 0.7 },
  { path: "/events", changeFrequency: "weekly", priority: 0.7 },
  { path: "/cities", changeFrequency: "weekly", priority: 0.7 },
  { path: "/countries", changeFrequency: "weekly", priority: 0.6 },
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/track-booking", changeFrequency: "monthly", priority: 0.4 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-of-service", changeFrequency: "yearly", priority: 0.3 },
  { path: "/cookie-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/refunds-cancellation", changeFrequency: "yearly", priority: 0.3 },
  { path: "/disclaimer", changeFrequency: "yearly", priority: 0.3 },
];

/**
 * A sitemap entry for a locale-agnostic path. The canonical `url` is the
 * default-locale URL (`/en/...`); `alternates.languages` lists every locale's
 * localized URL plus `x-default` (also the default locale) so search engines
 * surface the right language version (Phase 3 i18n). All public URLs are now
 * locale-prefixed, matching the proxy's negotiation redirect.
 */
function localizedEntry(
  path: string,
  lastModified: Date,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {};
  for (const loc of locales) {
    languages[localeHtmlLang[loc]] = `${base}${localizePath(path, loc)}`;
  }
  languages["x-default"] = `${base}${localizePath(path, defaultLocale)}`;
  return {
    url: `${base}${localizePath(path, defaultLocale)}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) =>
    localizedEntry(r.path, now, r.changeFrequency, r.priority),
  );

  // Fetch the three dynamic slug sets in parallel; each degrades independently
  // (a DB hiccup drops that section rather than 500-ing the whole sitemap).
  const [tourSlugs, tripIdeaSlugs, eventSlugs] = await Promise.all([
    listPublishedTourSlugs().catch((error) => {
      logger.error("sitemap: failed to list tour slugs", { error });
      return [] as string[];
    }),
    listPublishedTripIdeaSlugs().catch((error) => {
      logger.error("sitemap: failed to list trip-idea slugs", { error });
      return [] as string[];
    }),
    listPublishedEventSlugs().catch((error) => {
      logger.error("sitemap: failed to list event slugs", { error });
      return [] as string[];
    }),
  ]);

  const tourEntries: MetadataRoute.Sitemap = tourSlugs.map((slug) =>
    localizedEntry(`/tours/${slug}`, now, "weekly", 0.8),
  );

  const tripIdeaEntries: MetadataRoute.Sitemap = tripIdeaSlugs.map((slug) =>
    localizedEntry(`/trip-ideas/${slug}`, now, "weekly", 0.6),
  );

  const eventEntries: MetadataRoute.Sitemap = eventSlugs.map((slug) =>
    localizedEntry(`/events/${slug}`, now, "weekly", 0.6),
  );

  return [...staticEntries, ...tourEntries, ...tripIdeaEntries, ...eventEntries];
}
