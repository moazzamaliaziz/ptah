"use client";

/**
 * Locale-aware drop-in replacement for `next/link` (item #11, Phase 3).
 *
 * The public site lives under `/{locale}/...`. Internal links in content and
 * components are authored WITHOUT a locale (`/tours`, `/`, `/track-booking`);
 * this wrapper reads the active `[lang]` route param and prepends it at render
 * time (`/tours` → `/ar/tours`) so client-side navigation stays in the
 * visitor's language.
 *
 * Usage is a one-line import swap — files keep writing `<Link href="/tours">`:
 *   import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
 *
 * Pass-through cases (href returned untouched):
 *   - external / scheme hrefs (`https:`, `mailto:`, `tel:`) — no leading "/"
 *   - protocol-relative (`//cdn…`)
 *   - hash-only (`#section`) and relative hrefs — no leading "/"
 *   - object hrefs (none in this codebase today) — forwarded as-is
 *
 * Outside the localized tree (admin, `global-not-found`) there is no `lang`
 * param, so `isLocale(lang)` is false and this degrades to a plain link. That
 * is why shared UI (Button, Breadcrumbs, NotFoundView) can use it safely in
 * both localized and non-localized contexts.
 *
 * `localizePath` is idempotent, so an already-localized href is re-based to the
 * current locale rather than double-prefixed. Query strings and hashes are
 * preserved (the locale is only ever prepended — see `@/i18n/routing`).
 */
import Link from "next/link";
import { useParams } from "next/navigation";
import type { ComponentProps } from "react";
import { isLocale } from "@/i18n/config";
import { localizePath } from "@/i18n/routing";

/** True only for internal absolute paths that should carry the locale prefix. */
function isInternalPath(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

export function LocaleLink({ href, ...rest }: ComponentProps<typeof Link>) {
  // In React 19, `ref` (if passed) rides along in `...rest` and forwards to Link.
  const { lang } = useParams<{ lang?: string }>();

  const resolvedHref =
    typeof href === "string" && isLocale(lang) && isInternalPath(href)
      ? localizePath(href, lang)
      : href;

  return <Link href={resolvedHref} {...rest} />;
}

export default LocaleLink;
