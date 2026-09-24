/**
 * Chrome localizers (Phase 3 i18n). Zip a resolved chrome `Dictionary` onto the
 * structural SSOT in `@/content/landing` (hrefs, icon keys, images, brand and
 * proper nouns), producing the exact `SiteNav` / `FooterContent` shapes the
 * chrome components already consume — so nothing downstream changes shape.
 *
 * Strings are matched to structure BY INDEX and fall back to the English label
 * per item, so a translation that is short, reordered or mid-edit degrades to
 * English for the affected item instead of breaking the render.
 *
 * These builders are pure and dependency-light (no `server-only`); the locale
 * is resolved by the caller via `getDictionary()`.
 */
import { siteNav, footerContent, type SiteNav, type FooterContent } from "@/content/landing";
import type { Dictionary } from "./dictionaries/en";

/** Strings the header client island (SiteHeaderChrome) needs as plain props. */
export interface HeaderChromeStrings {
  home: string;
  header: Dictionary["header"];
  search: Dictionary["search"];
  bookmarks: Dictionary["bookmarks"];
}

/** Extra (non-structural) cookie labels the banner needs beyond its content. */
export interface CookieLabels {
  regionAria: string;
  acceptAll: string;
  manage: string;
  rejectAll: string;
  saveChoices: string;
  necessaryName: string;
  necessaryDesc: string;
}

/** Build the header client island's string props from a resolved dictionary. */
export function headerStrings(t: Dictionary): HeaderChromeStrings {
  return { home: t.common.home, header: t.header, search: t.search, bookmarks: t.bookmarks };
}

/** Build the cookie banner's extra label props from a resolved dictionary. */
export function cookieLabels(t: Dictionary): CookieLabels {
  const c = t.cookie;
  return {
    regionAria: c.regionAria,
    acceptAll: c.acceptAll,
    manage: c.manage,
    rejectAll: c.rejectAll,
    saveChoices: c.saveChoices,
    necessaryName: c.necessaryName,
    necessaryDesc: c.necessaryDesc,
  };
}

/** Localized copy of the site navigation (labels swapped, structure intact). */
export function localizeSiteNav(t: Dictionary): SiteNav {
  const n = t.nav;
  return {
    ...siteNav,
    buildTripCta: { ...siteNav.buildTripCta, label: n.buildTrip },
    quickLinks: siteNav.quickLinks.map((q, i) => ({ ...q, label: n.quickLinks[i] ?? q.label })),
    directLinks: siteNav.directLinks.map((d, i) => ({ ...d, label: n.directLinks[i] ?? d.label })),
    popularSearches: siteNav.popularSearches.map((p, i) => n.popularSearches[i] ?? p),
    sections: siteNav.sections.map((s, si) => {
      const ts = n.sections[si];
      return {
        ...s,
        title: ts?.title ?? s.title,
        columns: s.columns.map((c, ci) => {
          const tc = ts?.columns[ci];
          return {
            ...c,
            heading: tc?.heading ?? c.heading,
            links: c.links.map((l, li) => ({ ...l, label: tc?.links[li] ?? l.label })),
          };
        }),
        imageCtas: s.imageCtas.map((cta, xi) => {
          const tx = ts?.imageCtas[xi];
          return { ...cta, label: tx?.label ?? cta.label, heading: tx?.heading ?? cta.heading };
        }),
      };
    }),
  };
}

/** Localized copy of the footer content (labels + cookie strings swapped). */
export function localizeFooter(t: Dictionary): FooterContent {
  const f = t.footer;
  const c = t.cookie;
  return {
    ...footerContent,
    newsletter: {
      ...footerContent.newsletter,
      heading: f.newsletter.heading,
      blurb: f.newsletter.blurb,
      cta: { ...footerContent.newsletter.cta, label: f.newsletter.ctaLabel },
    },
    badgeHeading: f.badgeHeading,
    badges: footerContent.badges.map((b, i) => ({ ...b, sub: f.badgeSubs[i] ?? b.sub })),
    partnersHeading: f.partnersHeading,
    partners: footerContent.partners.map((p, i) => ({ ...p, tagline: f.partnerTaglines[i] ?? p.tagline })),
    columns: footerContent.columns.map((col, ci) => {
      const tc = f.columns[ci];
      return {
        ...col,
        heading: tc?.heading ?? col.heading,
        links: col.links.map((l, li) => ({ ...l, label: tc?.links[li] ?? l.label })),
      };
    }),
    legalLinks: footerContent.legalLinks.map((l, i) => ({ ...l, label: f.legalLinks[i] ?? l.label })),
    copyrightLine: f.copyrightLine,
    acknowledgement: f.acknowledgement,
    cookie: {
      heading: c.heading,
      copy: c.copy,
      manageHeading: c.manageHeading,
      categories: footerContent.cookie.categories.map((cat, i) => ({
        ...cat,
        name: c.categories[i]?.name ?? cat.name,
        description: c.categories[i]?.description ?? cat.description,
      })),
    },
  };
}
