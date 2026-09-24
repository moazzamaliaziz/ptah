/**
 * Pure pathname helpers for locale-prefixed public routing (item #11, Phase 3).
 *
 * The public site lives under `/{locale}/...`. These helpers add, detect, strip
 * and swap that leading locale segment. They operate on the PATHNAME only and
 * assume INTERNAL paths (starting with "/"); callers must skip external hrefs
 * (`http:`, `mailto:`, `tel:`, `#...`) before calling `localizePath`.
 *
 * Query strings and hashes are preserved because the locale is only ever
 * *prepended* — the rest of the string is never parsed.
 *
 * Dependency-free apart from `./config`, so it is safe in the proxy, Server and
 * Client Components, sitemap/robots and build-time code.
 */
import { isLocale, type Locale } from "./config";

/** The leading locale of a pathname, or null when it has none. */
export function getPathLocale(pathname: string): Locale | null {
  const first = pathname.split("/", 2)[1] ?? "";
  return isLocale(first) ? first : null;
}

/** True when the pathname already begins with a supported locale segment. */
export function pathnameHasLocale(pathname: string): boolean {
  return getPathLocale(pathname) !== null;
}

/**
 * Remove a leading locale segment, returning the locale-agnostic path.
 * `/en/tours` → `/tours`, `/ar` → `/`, `/tours` → `/tours`.
 */
export function stripLocalePrefix(pathname: string): string {
  const locale = getPathLocale(pathname);
  if (!locale) return pathname || "/";
  const rest = pathname.slice(locale.length + 1); // drop "/<locale>"
  return rest === "" ? "/" : rest;
}

/**
 * Prefix a locale-agnostic internal path with `/{locale}`.
 * `/tours` + `ar` → `/ar/tours`; `/` + `ar` → `/ar`. Idempotent: an already
 * localized path is re-based to the requested locale rather than double-prefixed.
 */
export function localizePath(pathname: string, locale: Locale): string {
  const clean = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const base = pathnameHasLocale(clean) ? stripLocalePrefix(clean) : clean;
  return base === "/" ? `/${locale}` : `/${locale}${base}`;
}

/** Swap whatever locale a path currently has (or none) for `next`. */
export function switchLocalePath(pathname: string, next: Locale): string {
  return localizePath(stripLocalePrefix(pathname), next);
}
