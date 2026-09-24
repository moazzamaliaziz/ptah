/**
 * Locale configuration for the public-site internationalization (item #11, Phase 3).
 *
 * Locked product decisions:
 *  - Six languages: English (default), Arabic, French, German, Spanish, Italian.
 *  - Arabic renders right-to-left.
 *  - Scope is the PUBLIC customer-facing site only. The admin panel, API routes
 *    and system emails stay English and are NOT localized.
 *
 * This module is intentionally dependency-free (no `server-only`, no
 * `next/root-params`, no React) so it can be imported anywhere: Server and
 * Client Components, the proxy (Edge-style request handling), sitemap/robots,
 * and build-time helpers alike.
 */

/** All supported public-site locales. `en` MUST stay first (it is the default/source). */
export const locales = ["en", "ar", "fr", "de", "es", "it"] as const;

export type Locale = (typeof locales)[number];

/** The fallback locale used when negotiation finds no supported match. */
export const defaultLocale: Locale = "en";

/** Locales rendered right-to-left. A Set so adding another RTL language is one line. */
const rtlLocales: ReadonlySet<Locale> = new Set<Locale>(["ar"]);

/** True when the locale is written right-to-left (drives `<html dir>` and RTL CSS). */
export function isRtl(locale: Locale): boolean {
  return rtlLocales.has(locale);
}

/** The `dir` attribute value for `<html>` for a given locale. */
export function dir(locale: Locale): "rtl" | "ltr" {
  return isRtl(locale) ? "rtl" : "ltr";
}

/**
 * Endonyms — each language's own name — for the locale switcher UI.
 * Shown to users, so each is written in its own script.
 */
export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
  it: "Italiano",
};

/**
 * BCP-47 language tags for `<html lang>`, hreflang alternates and `Intl.*`
 * formatting. Kept separate from the route segment so a route locale (`en`)
 * and its formatting tag (`en`) can diverge later (e.g. `en` route → `en-GB`).
 */
export const localeHtmlLang: Record<Locale, string> = {
  en: "en",
  ar: "ar",
  fr: "fr",
  de: "de",
  es: "es",
  it: "it",
};

/**
 * Open Graph `og:locale` values (BCP-47 with region, underscore form) for each
 * locale. Arabic uses `ar_EG` — this is an Egypt tour operator, so the Egyptian
 * region is the meaningful default.
 */
export const localeOgLocale: Record<Locale, string> = {
  en: "en_US",
  ar: "ar_EG",
  fr: "fr_FR",
  de: "de_DE",
  es: "es_ES",
  it: "it_IT",
};

/**
 * Narrow an untrusted string (route param, header, cookie) to a supported
 * Locale. Use before treating any external value as a Locale.
 */
export function isLocale(value: string | undefined | null): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/**
 * Coerce any external value to a Locale, falling back to the default.
 * Handy in the proxy and formatting helpers where a value is always needed.
 */
export function toLocale(value: string | undefined | null): Locale {
  return isLocale(value) ? value : defaultLocale;
}
