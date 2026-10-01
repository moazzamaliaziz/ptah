import { Cabin, Noto_Sans, Noto_Sans_Arabic, Playfair_Display } from "next/font/google";

/**
 * Shared Cabin variable font (design.md §1.2.1), weights 400–700 incl. italics.
 *
 * Instantiated once here and imported by EVERY root layout (`[lang]`, `admin`,
 * `maintenance`, and `global-not-found`). Because the app has no single
 * top-level `app/layout.tsx` any more (multiple root layouts — the public site
 * is under `[lang]`), each root document shell must load the font itself; this
 * module keeps the `--font-cabin` CSS variable consistent without duplicating
 * the loader config. `next/font` dedupes identical requests at build time.
 *
 * Non-Latin scripts: Cabin ships only latin/latin-ext/vietnamese subsets (no
 * Arabic, no Cyrillic), so scripts it can't render are paired with a companion
 * face loaded only on the relevant locale:
 *  - `ar` → `notoArabic` below (`--font-arabic`), preferred under `dir="rtl"`.
 *  - `ru` → `notoCyrillic` below (`--font-cyrillic`), preferred under `[lang="ru"]`.
 * The public root layout adds the companion variable only for that locale, and
 * globals.css prefers it there; other locales never download the companion file
 * (each companion's @font-face is script-only unicode-range), so there is no
 * cost outside the locale that needs it.
 */
export const cabin = Cabin({
  weight: "variable",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cabin",
  // `swap` (not `block`): show the metric-similar fallback immediately and swap
  // Cabin in on load, so body text is never invisible during the font fetch.
  // This keeps LCP fast on the public site; Next's size-adjusted fallback keeps
  // the swap's layout shift negligible. Matches the Arabic face below.
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

/**
 * Arabic companion face (Noto Sans Arabic — a neutral, highly legible variable
 * Arabic font). Loaded only on the `ar` locale via the public root layout; its
 * subset is Arabic-only so it never affects Latin pages. Exposed as
 * `--font-arabic` for globals.css to prefer under `dir="rtl"`.
 */
export const notoArabic = Noto_Sans_Arabic({
  weight: "variable",
  style: ["normal"],
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
  fallback: ["Segoe UI", "Tahoma", "sans-serif"],
});

/**
 * Cyrillic companion face (Noto Sans — a neutral, highly legible variable sans).
 * Cabin has no Cyrillic glyphs, so the `ru` locale pairs it with this face.
 * Loaded only on `ru` via the public root layout; its subset is Cyrillic-only so
 * it never affects Latin or Arabic pages. Exposed as `--font-cyrillic` for
 * globals.css to prefer under `[lang="ru"]`. Mirrors the Arabic companion above.
 */
export const notoCyrillic = Noto_Sans({
  weight: "variable",
  style: ["normal", "italic"],
  subsets: ["cyrillic"],
  variable: "--font-cyrillic",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

/**
 * Editorial serif display face (Playfair Display) — high-contrast, elegant, used
 * ONLY for the admin sign-in screen's large headlines (the split-screen hero copy
 * and "Welcome back."). It gives the login an on-brand, magazine-like feel that
 * the functional Cabin body face can't. Loaded lazily via `.variable` on the
 * login container only, so no other admin page pays for it. Italics are included
 * for the two-line hero headline (roman line + italic line). Latin subset only;
 * Arabic headings fall back to `notoArabic` under `dir="rtl"`.
 */
export const playfair = Playfair_Display({
  weight: "variable",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  fallback: ["Georgia", "Cambria", "Times New Roman", "serif"],
});
