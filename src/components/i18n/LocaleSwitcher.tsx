"use client";

/**
 * Public-site language switcher (Phase 3 i18n).
 *
 * Two variants share one target-building core:
 *   - "menu"   → globe icon-button + popover, for the desktop primary bar.
 *   - "inline" → a flat chip row, for the mobile curtain.
 *
 * Targets are built with `switchLocalePath` (already fully localized), so this
 * uses PLAIN next/link — LocaleLink would re-base them back to the active
 * locale. The current query string is preserved by reading
 * `window.location.search` in an effect: `useSearchParams()` would force this
 * shared-chrome island into dynamic rendering, which §2 forbids.
 *
 * Selecting a language also writes the NEXT_LOCALE cookie so the proxy honours
 * the choice on subsequent bare-path visits (1-year, path=/, lax).
 */
import { useCallback, useEffect, useRef, useState, type JSX } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames, localeHtmlLang, toLocale, type Locale } from "@/i18n/config";
import { getPathLocale, switchLocalePath } from "@/i18n/routing";
import { Icon } from "@/components/ui/Icon";
import { Flag } from "@/components/i18n/Flag";

const LOCALE_COOKIE = "NEXT_LOCALE";
const ONE_YEAR = 60 * 60 * 24 * 365;

/** Persist the chosen locale so the proxy negotiates it next time (cookie wins). */
function persistLocale(loc: Locale): void {
  document.cookie = `${LOCALE_COOKIE}=${loc}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}

/** Current query string, read client-side to avoid useSearchParams (see file doc). */
function useCurrentQuery(pathname: string): string {
  const [query, setQuery] = useState("");
  useEffect(() => {
    setQuery(window.location.search || "");
  }, [pathname]);
  return query;
}

export interface LocaleSwitcherProps {
  /** "menu" = globe button + popover (desktop bar); "inline" = chip row (mobile curtain). */
  variant?: "menu" | "inline";
}

export function LocaleSwitcher({ variant = "menu" }: LocaleSwitcherProps): JSX.Element {
  const pathname = usePathname() || "/";
  const current = getPathLocale(pathname) ?? toLocale(null);
  const query = useCurrentQuery(pathname);

  if (variant === "inline") {
    return (
      <div className="locale-switcher locale-switcher--inline">
        <span className="locale-switcher__caption">Language</span>
        <ul className="locale-switcher__row" aria-label="Choose a language">
          {locales.map((loc) => (
            <li key={loc}>
              <Link
                href={`${switchLocalePath(pathname, loc)}${query}`}
                hrefLang={localeHtmlLang[loc]}
                lang={localeHtmlLang[loc]}
                aria-current={loc === current ? "true" : undefined}
                data-active={loc === current || undefined}
                className="locale-switcher__chip"
                onClick={() => persistLocale(loc)}
              >
                <Flag locale={loc} />
                {localeNames[loc]}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return <LocaleMenu pathname={pathname} current={current} query={query} />;
}

function LocaleMenu({
  pathname,
  current,
  query,
}: {
  pathname: string;
  current: Locale;
  query: string;
}): JSX.Element {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => setOpen(false), []);

  /* Close on outside pointerdown / Escape while open. */
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="locale-switcher">
      <button
        type="button"
        className="icon-button icon-button--dip"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Language: ${localeNames[current]}`}
        onClick={() => setOpen((v) => !v)}
      >
        <Icon name="globe" size={20} />
      </button>
      {open ? (
        <ul className="locale-switcher__menu" role="menu" aria-label="Choose a language">
          {locales.map((loc) => (
            <li key={loc} role="none">
              <Link
                href={`${switchLocalePath(pathname, loc)}${query}`}
                role="menuitemradio"
                aria-checked={loc === current}
                hrefLang={localeHtmlLang[loc]}
                lang={localeHtmlLang[loc]}
                data-active={loc === current || undefined}
                className="locale-switcher__item"
                onClick={() => {
                  persistLocale(loc);
                  close();
                }}
              >
                <Flag locale={loc} />
                {localeNames[loc]}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default LocaleSwitcher;
