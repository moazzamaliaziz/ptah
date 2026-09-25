/**
 * Locale-aware formatting helpers for the admin UI (Wave 5).
 *
 * Dates are the only thing that needs to bend per language: English keeps the
 * exact `en-US` medium format it always had (so nothing regresses), while
 * Arabic gets Arabic month names but KEEPS Western (Latin) digits — the rest of
 * the admin renders numbers, prices and ID ranges in Western numerals, so
 * mixing Arabic-Indic digits into dates alone would look inconsistent. Egypt
 * (`ar-EG`) is the right regional Arabic for an Egyptian tour operator.
 *
 * Centralized so every screen (orders list + detail, enquiries, dashboard,
 * reports) formats dates identically instead of each hardcoding `"en-US"`.
 */
import type { AdminLocale } from "./config";

/** BCP-47 tag per admin locale. `-u-nu-latn` forces Latin digits for Arabic. */
const INTL_LOCALE: Record<AdminLocale, string> = {
  en: "en-US",
  ar: "ar-EG-u-nu-latn",
};

/** A date on its own (default: medium — e.g. "Sep 25, 2026" / "٢٥ سبتمبر…" in Latin digits). */
export function formatAdminDate(
  date: Date,
  locale: AdminLocale,
  opts: Intl.DateTimeFormatOptions = { dateStyle: "medium" },
): string {
  return new Intl.DateTimeFormat(INTL_LOCALE[locale], opts).format(date);
}

/** Date + time of day, for audit/history rows. */
export function formatAdminDateTime(date: Date, locale: AdminLocale): string {
  return formatAdminDate(date, locale, { dateStyle: "medium", timeStyle: "short" });
}
