/**
 * Content-translation overlay layer (Phase 3 / item #11) — PUBLIC site only.
 *
 * The `Translation` side-table (prisma/schema.prisma) stores one row per
 * (model, recordId, locale, field). This module reads those rows and overlays
 * them onto the English source view-models produced by the catalog/events read
 * layers. English is the source and is never stored, so:
 *
 *   locale === "en"        → no query, return source unchanged
 *   translation present    → use it (coerced to the field's shape)
 *   missing / blank / bad  → fall back to the English source
 *
 * A translation therefore can only ever ADD a localized string; a gap always
 * degrades to English rather than blanking the page. Server-only (touches DB).
 */
import "server-only";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { defaultLocale, type Locale } from "@/i18n/config";

/** Models that carry translatable public content (see schema `Translation`). */
export type TranslatableModel =
  | "Tour"
  | "Destination"
  | "Event"
  | "TripIdea"
  | "ItineraryDay"
  | "ContentSection"
  | "SiteSetting"
  | "FloatingWidget"
  | "MediaAsset";

/** field → translated value (string | string[] | {q,a}[] | arbitrary Json). */
export type FieldMap = Record<string, unknown>;

/** recordId → { field: translatedValue }. Absent record ⇒ no translation. */
export type TranslationMap = Map<string, FieldMap>;

/** An empty, immutable map — returned for the source locale / on any DB error. */
const EMPTY: TranslationMap = new Map();

/**
 * Fetch translations for many records of ONE model + locale in a single query.
 * Returns recordId → { field: value }. The source locale (`en`) and an empty id
 * list short-circuit to an empty map (no query). DB errors are swallowed (log +
 * empty) so a translation outage degrades to English, never a 500.
 */
export async function getTranslations(
  model: TranslatableModel,
  recordIds: readonly string[],
  locale: Locale,
): Promise<TranslationMap> {
  if (locale === defaultLocale || recordIds.length === 0) return EMPTY;
  try {
    const rows = await db.translation.findMany({
      where: { model, locale, recordId: { in: [...recordIds] } },
      select: { recordId: true, field: true, value: true },
    });
    const out: TranslationMap = new Map();
    for (const row of rows) {
      let fm = out.get(row.recordId);
      if (!fm) {
        fm = {};
        out.set(row.recordId, fm);
      }
      fm[row.field] = row.value;
    }
    return out;
  } catch (error) {
    logger.warn("translations unreadable — serving source locale", { model, locale, error });
    return EMPTY;
  }
}

/** Convenience for a single record — returns its FieldMap (empty when none). */
export async function getRecordTranslation(
  model: TranslatableModel,
  recordId: string,
  locale: Locale,
): Promise<FieldMap> {
  const map = await getTranslations(model, [recordId], locale);
  return map.get(recordId) ?? {};
}

// ── Per-field coercion (translation-or-English-fallback) ────────────────────────
//
// Each getter validates the stored Json against the field's expected shape and
// falls back to the supplied English source when the translation is absent,
// blank, or the wrong shape. Mirrors the coercion already used in catalog.ts.

/** Non-empty translated string, else the English source string. */
export function tString(fm: FieldMap | undefined, field: string, source: string): string {
  const v = fm?.[field];
  return typeof v === "string" && v.trim().length > 0 ? v : source;
}

/** Non-empty translated string, else the (possibly null) English source. */
export function tNullableString(
  fm: FieldMap | undefined,
  field: string,
  source: string | null,
): string | null {
  const v = fm?.[field];
  return typeof v === "string" && v.trim().length > 0 ? v : source;
}

/** Non-empty translated string[], else the English source array. */
export function tStringArray(fm: FieldMap | undefined, field: string, source: string[]): string[] {
  const v = fm?.[field];
  if (Array.isArray(v)) {
    const arr = v.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
    if (arr.length > 0) return arr;
  }
  return source;
}

/** Non-empty translated {q,a}[], else the English source FAQ array. */
export function tFaqArray(
  fm: FieldMap | undefined,
  field: string,
  source: { q: string; a: string }[],
): { q: string; a: string }[] {
  const v = fm?.[field];
  if (Array.isArray(v)) {
    const arr = v.flatMap((item) => {
      if (item && typeof item === "object" && !Array.isArray(item)) {
        const { q, a } = item as Record<string, unknown>;
        if (typeof q === "string" && typeof a === "string" && q.trim() && a.trim()) {
          return [{ q, a }];
        }
      }
      return [];
    });
    if (arr.length > 0) return arr;
  }
  return source;
}
