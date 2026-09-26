import { Cabin, Noto_Sans_Arabic, Playfair_Display } from "next/font/google";

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
 * Arabic/RTL: Cabin is a Latin-only face, so the `ar` locale pairs it with
 * `notoArabic` below (a proper Arabic face) — the public root layout adds the
 * `--font-arabic` variable only for `ar`, and globals.css prefers it when the
 * document is RTL. Latin locales never download the Arabic file (its @font-face
 * is Arabic-only unicode-range), so there is no cost outside Arabic.
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
