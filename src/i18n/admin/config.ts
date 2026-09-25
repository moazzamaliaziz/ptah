/**
 * Admin-panel UI locale config (Wave 5).
 *
 * TWO languages only — English (default) and Arabic — because the panel's daily
 * operator reads only Arabic. This is deliberately SEPARATE from the public-site
 * six-locale system (`src/i18n/config.ts`): the admin is internal staff chrome,
 * the language is chosen with a cookie (`ADMIN_LOCALE`) rather than a URL prefix,
 * and Arabic must render right-to-left.
 *
 * Dependency-free (no `server-only`, no React) so it can be imported anywhere —
 * the server layout that reads the cookie AND the switcher UI alike.
 */

/** Supported admin-UI locales. `en` MUST stay first (default/source). */
export const adminLocales = ["en", "ar"] as const;

export type AdminLocale = (typeof adminLocales)[number];

/** Fallback when the cookie is missing or holds junk. */
export const defaultAdminLocale: AdminLocale = "en";

/** Cookie that persists the operator's admin-UI language choice. */
export const ADMIN_LOCALE_COOKIE = "ADMIN_LOCALE";

/** Narrow an untrusted string (cookie, form field) to a supported AdminLocale. */
export function isAdminLocale(value: string | undefined | null): value is AdminLocale {
  return typeof value === "string" && (adminLocales as readonly string[]).includes(value);
}

/** Coerce any external value to an AdminLocale, falling back to the default. */
export function toAdminLocale(value: string | undefined | null): AdminLocale {
  return isAdminLocale(value) ? value : defaultAdminLocale;
}

/** `dir` attribute for `<html>` — Arabic is the only RTL admin locale. */
export function adminDir(locale: AdminLocale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

/** BCP-47 tag for `<html lang>` (route segment and formatting tag coincide here). */
export function adminHtmlLang(locale: AdminLocale): string {
  return locale;
}

/** Endonyms (each language written in its own script) for the switcher UI. */
export const adminLocaleNames: Record<AdminLocale, string> = {
  en: "English",
  ar: "العربية",
};
