/**
 * Localized UI-supplemental loader (Phase 4 i18n editorial rollout).
 *
 * Copy that previously lived hardcoded in page JSX and route metadata (city
 * in-page nav labels, "Plan your visit to {name}", "View {name} on Google Maps",
 * the site meta description, and the hero OG alt — inventory §I). English is the
 * shape SSOT + fallback; each locale has a flat sibling module. Mirrors the
 * `getThemeEditorial` idiom; server-only. `{name}` tokens are substituted by the
 * caller (e.g. `.replace("{name}", city.name)`).
 */
import type { Locale } from "@/i18n/config";
import { uiSupplementalEn } from "./ui-supplemental.en";

export type UiSupplemental = { [K in keyof typeof uiSupplementalEn]: string };

const loaders: Record<Locale, () => Promise<UiSupplemental>> = {
  en: () => Promise.resolve(uiSupplementalEn),
  ar: () => import("./ui-supplemental.ar").then((m) => m.uiSupplementalAr),
  fr: () => import("./ui-supplemental.fr").then((m) => m.uiSupplementalFr),
  // de/es/it annotate their export as Record<string, string>; every locale file
  // carries the exact UiSupplemental keys (verified), so narrow on load.
  de: () => import("./ui-supplemental.de").then((m) => m.uiSupplementalDe as UiSupplemental),
  es: () => import("./ui-supplemental.es").then((m) => m.uiSupplementalEs as UiSupplemental),
  it: () => import("./ui-supplemental.it").then((m) => m.uiSupplementalIt as UiSupplemental),
  ru: () => import("./ui-supplemental.ru").then((m) => m.uiSupplementalRu),
};

/** Resolve the active locale's UI-supplemental strings, falling back to English. */
export async function getUiSupplemental(locale: Locale): Promise<UiSupplemental> {
  return (loaders[locale] ?? loaders.en)();
}
