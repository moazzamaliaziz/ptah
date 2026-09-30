/**
 * Localized city-page editorial loader (Phase 4 i18n editorial rollout).
 *
 * The English city editorial lives in `@/content/city-content` (the shape SSOT).
 * Each non-English locale has a sibling module in this folder whose `cityContent`
 * export is typed against `typeof cityContent`, mirroring the shape 1:1. This
 * loader returns the active locale's `cityContent`, code-split behind dynamic
 * imports, with English as the fallback for `en` and any locale without an
 * editorial module. Mirrors the `getThemeEditorial` idiom; server-only.
 */
import type { Locale } from "@/i18n/config";
import { cityContent } from "@/content/city-content";

type CityContentMap = typeof cityContent;

const loaders: Record<Locale, () => Promise<CityContentMap>> = {
  en: () => Promise.resolve(cityContent),
  ar: () => import("./city-content.ar").then((m) => m.cityContentAr),
  fr: () => import("./city-content.fr").then((m) => m.cityContentFr),
  de: () => import("./city-content.de").then((m) => m.cityContentDe),
  es: () => import("./city-content.es").then((m) => m.cityContentEs),
  it: () => import("./city-content.it").then((m) => m.cityContentIt),
  ru: () => import("./city-content.ru").then((m) => m.cityContentRu),
};

/** Resolve the active locale's city editorial, falling back to English. */
export async function getCityContent(locale: Locale): Promise<CityContentMap> {
  return (loaders[locale] ?? loaders.en)();
}
