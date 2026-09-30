/**
 * Localized theme-page editorial loader (Phase 4 i18n editorial rollout).
 *
 * The English theme editorial lives in `@/content/theme-content` (the shape SSOT).
 * Each non-English locale has a sibling module in this folder whose exports are
 * typed against `typeof` the English exports, so they mirror the shape 1:1. This
 * loader returns the active locale's `{ themeContent, galleryLabels,
 * whenToVisitContent }`, code-split behind dynamic imports, with English as the
 * fallback for `en` and for any locale that has no editorial module yet.
 *
 * Mirrors the `getDictionary` / `getPageContent` idiom. Server-only usage: theme
 * pages already hold a Locale (from `params.lang`) and pass it explicitly.
 */
import type { Locale } from "@/i18n/config";
import {
  galleryLabels,
  themeContent,
  whenToVisitContent,
} from "@/content/theme-content";

export interface ThemeEditorial {
  themeContent: typeof themeContent;
  galleryLabels: typeof galleryLabels;
  whenToVisitContent: typeof whenToVisitContent;
}

const en: ThemeEditorial = { themeContent, galleryLabels, whenToVisitContent };

const loaders: Record<Locale, () => Promise<ThemeEditorial>> = {
  en: () => Promise.resolve(en),
  ar: () =>
    import("./theme-content.ar").then((m) => ({
      themeContent: m.themeContentAr,
      galleryLabels: m.galleryLabelsAr,
      whenToVisitContent: m.whenToVisitContentAr,
    })),
  fr: () =>
    import("./theme-content.fr").then((m) => ({
      themeContent: m.themeContentFr,
      galleryLabels: m.galleryLabelsFr,
      whenToVisitContent: m.whenToVisitContentFr,
    })),
  de: () =>
    import("./theme-content.de").then((m) => ({
      themeContent: m.themeContentDe,
      galleryLabels: m.galleryLabelsDe,
      whenToVisitContent: m.whenToVisitContentDe,
    })),
  es: () =>
    import("./theme-content.es").then((m) => ({
      themeContent: m.themeContentEs,
      galleryLabels: m.galleryLabelsEs,
      whenToVisitContent: m.whenToVisitContentEs,
    })),
  it: () =>
    import("./theme-content.it").then((m) => ({
      themeContent: m.themeContentIt,
      galleryLabels: m.galleryLabelsIt,
      whenToVisitContent: m.whenToVisitContentIt,
    })),
  ru: () =>
    import("./theme-content.ru").then((m) => ({
      themeContent: m.themeContentRu,
      galleryLabels: m.galleryLabelsRu,
      whenToVisitContent: m.whenToVisitContentRu,
    })),
};

/** Resolve the active locale's theme editorial, falling back to English. */
export async function getThemeEditorial(locale: Locale): Promise<ThemeEditorial> {
  return (loaders[locale] ?? loaders.en)();
}
