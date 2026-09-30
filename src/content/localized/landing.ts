/**
 * Localized homepage editorial loader (Phase 4 i18n editorial rollout).
 *
 * The English homepage editorial lives in `@/content/landing` (shape SSOT). Each
 * non-English locale has a sibling module here whose exports are typed against
 * `typeof` the English exports, mirroring the shape 1:1. This loader returns the
 * active locale's homepage sections (+ siteMeta), code-split behind dynamic
 * imports, English as the fallback.
 *
 * Note: the site header/footer nav (`siteNav` / `footerContent`) are localized
 * separately by `@/i18n/chrome`, which zips the chrome `Dictionary` onto the
 * landing structure — so they are NOT re-exposed here. This loader covers the
 * homepage BODY sections and the brand tagline only.
 */
import type { Locale } from "@/i18n/config";
import {
  siteMeta,
  heroSlides,
  inspiredTabs,
  planCta,
  fiftyCtas,
  kbygItems,
  tourTypes,
  stories,
} from "@/content/landing";

export interface LandingDefaults {
  // Widened so localized siteMeta (string values) and the English SSOT (literal
  // "Ptah Tours") are both assignable; the brand name stays verbatim in data.
  siteMeta: { name: string; legalName: string; tagline: string };
  heroSlides: typeof heroSlides;
  inspiredTabs: typeof inspiredTabs;
  planCta: typeof planCta;
  fiftyCtas: typeof fiftyCtas;
  kbygItems: typeof kbygItems;
  tourTypes: typeof tourTypes;
  stories: typeof stories;
}

const en: LandingDefaults = {
  siteMeta,
  heroSlides,
  inspiredTabs,
  planCta,
  fiftyCtas,
  kbygItems,
  tourTypes,
  stories,
};

const loaders: Record<Locale, () => Promise<LandingDefaults>> = {
  en: () => Promise.resolve(en),
  ar: () =>
    import("./landing.ar").then((m) => ({
      siteMeta: m.siteMetaAr,
      heroSlides: m.heroSlidesAr,
      inspiredTabs: m.inspiredTabsAr,
      planCta: m.planCtaAr,
      fiftyCtas: m.fiftyCtasAr,
      kbygItems: m.kbygItemsAr,
      tourTypes: m.tourTypesAr,
      stories: m.storiesAr,
    })),
  fr: () =>
    import("./landing.fr").then((m) => ({
      siteMeta: m.siteMetaFr,
      heroSlides: m.heroSlidesFr,
      inspiredTabs: m.inspiredTabsFr,
      planCta: m.planCtaFr,
      fiftyCtas: m.fiftyCtasFr,
      kbygItems: m.kbygItemsFr,
      tourTypes: m.tourTypesFr,
      stories: m.storiesFr,
    })),
  de: () =>
    import("./landing.de").then((m) => ({
      siteMeta: m.siteMetaDe,
      heroSlides: m.heroSlidesDe,
      inspiredTabs: m.inspiredTabsDe,
      planCta: m.planCtaDe,
      fiftyCtas: m.fiftyCtasDe,
      kbygItems: m.kbygItemsDe,
      tourTypes: m.tourTypesDe,
      stories: m.storiesDe,
    })),
  es: () =>
    import("./landing.es").then((m) => ({
      siteMeta: m.siteMetaEs,
      heroSlides: m.heroSlidesEs,
      inspiredTabs: m.inspiredTabsEs,
      planCta: m.planCtaEs,
      fiftyCtas: m.fiftyCtasEs,
      kbygItems: m.kbygItemsEs,
      tourTypes: m.tourTypesEs,
      stories: m.storiesEs,
    })),
  it: () =>
    import("./landing.it").then((m) => ({
      siteMeta: m.siteMetaIt,
      heroSlides: m.heroSlidesIt,
      inspiredTabs: m.inspiredTabsIt,
      planCta: m.planCtaIt,
      fiftyCtas: m.fiftyCtasIt,
      kbygItems: m.kbygItemsIt,
      tourTypes: m.tourTypesIt,
      stories: m.storiesIt,
    })),
  ru: () =>
    import("./landing.ru").then((m) => ({
      siteMeta: m.siteMetaRu,
      heroSlides: m.heroSlidesRu,
      inspiredTabs: m.inspiredTabsRu,
      planCta: m.planCtaRu,
      fiftyCtas: m.fiftyCtasRu,
      kbygItems: m.kbygItemsRu,
      tourTypes: m.tourTypesRu,
      stories: m.storiesRu,
    })),
};

/** Resolve the active locale's homepage editorial defaults, English fallback. */
export async function getLandingDefaults(locale: Locale): Promise<LandingDefaults> {
  return (loaders[locale] ?? loaders.en)();
}
