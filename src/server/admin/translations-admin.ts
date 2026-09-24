/**
 * Translation admin service (Phase 3 / item #11) — server-only write layer for
 * the generic /admin/translations surface. English is the source (the model
 * rows themselves) and is never stored; this module reads the English source
 * per translatable field, overlays any existing translation for one locale, and
 * upserts/clears the per-field Translation rows the public read overlay
 * (src/server/translations.ts) consumes.
 *
 * Conventions mirror the sibling admin services (events-admin / catalog-admin):
 *   • Returns plain view-models / a discriminated MutationResult — no Prisma
 *     types leak to callers; invalid input is a friendly error, not a throw.
 *   • Authorization (content.edit) + audit are the caller's responsibility.
 *   • A blank field clears its override (row deleted → page falls back to
 *     English) rather than storing an empty string.
 */
import "server-only";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { getRecordTranslation, type TranslatableModel } from "@/server/translations";
import {
  getTranslatableModel,
  serializeFieldValue,
  parseFieldValue,
  TRANSLATABLE_MODELS,
} from "@/content/translatable-fields";

export type MutationResult<T = void> =
  | ({ ok: true } & (T extends void ? object : { value: T }))
  | { ok: false; error: string };

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

// ── Source-record loading (English) ──────────────────────────────────────────
//
// Each translatable model exposes different columns, so loading the English
// source is per-model. `values` maps every registry field name to its raw DB
// value; `serializeFieldValue` turns each into the plain text the editor shows.

interface SourceRecord {
  label: string;
  sublabel: string | null;
  values: Record<string, unknown>;
}

async function loadSource(model: string, recordId: string): Promise<SourceRecord | null> {
  switch (model) {
    case "Tour": {
      const t = await db.tour.findUnique({
        where: { id: recordId },
        select: {
          slug: true, title: true, summary: true, descriptionLong: true,
          inclusions: true, exclusions: true, faqs: true, travelNotes: true,
          ctaLabel: true, metaTitle: true, metaDesc: true,
        },
      });
      if (!t) return null;
      return {
        label: t.title,
        sublabel: t.slug,
        values: {
          title: t.title, summary: t.summary, descriptionLong: t.descriptionLong,
          inclusions: t.inclusions, exclusions: t.exclusions, faqs: t.faqs,
          travelNotes: t.travelNotes, ctaLabel: t.ctaLabel,
          metaTitle: t.metaTitle, metaDesc: t.metaDesc,
        },
      };
    }
    case "Destination": {
      const d = await db.destination.findUnique({
        where: { id: recordId },
        select: { slug: true, name: true, region: true },
      });
      if (!d) return null;
      return { label: d.name, sublabel: d.slug, values: { name: d.name, region: d.region } };
    }
    case "Event": {
      const e = await db.event.findUnique({
        where: { id: recordId },
        select: {
          slug: true, title: true, summary: true, description: true,
          location: true, metaTitle: true, metaDesc: true,
        },
      });
      if (!e) return null;
      return {
        label: e.title,
        sublabel: e.slug,
        values: {
          title: e.title, summary: e.summary, description: e.description,
          location: e.location, metaTitle: e.metaTitle, metaDesc: e.metaDesc,
        },
      };
    }
    case "TripIdea": {
      const t = await db.tripIdea.findUnique({
        where: { id: recordId },
        select: {
          slug: true, title: true, summary: true, descriptionLong: true,
          metaTitle: true, metaDesc: true,
        },
      });
      if (!t) return null;
      return {
        label: t.title,
        sublabel: t.slug,
        values: {
          title: t.title, summary: t.summary, descriptionLong: t.descriptionLong,
          metaTitle: t.metaTitle, metaDesc: t.metaDesc,
        },
      };
    }
    case "ItineraryDay": {
      const d = await db.itineraryDay.findUnique({
        where: { id: recordId },
        select: {
          dayNumber: true, title: true, description: true,
          tour: { select: { title: true } },
        },
      });
      if (!d) return null;
      return {
        label: `Day ${d.dayNumber}: ${d.title}`,
        sublabel: d.tour.title,
        values: { title: d.title, description: d.description },
      };
    }
    default:
      return null;
  }
}

// ── Model index (nav landing) ────────────────────────────────────────────────

export interface TranslationModelSummary {
  model: string;
  label: string;
  singular: string;
  recordCount: number;
  translationRows: number;
}

const RECORD_COUNTERS: Record<string, () => Promise<number>> = {
  Tour: () => db.tour.count(),
  Destination: () => db.destination.count(),
  Event: () => db.event.count(),
  TripIdea: () => db.tripIdea.count(),
  ItineraryDay: () => db.itineraryDay.count(),
};

export async function listTranslationModels(): Promise<TranslationModelSummary[]> {
  const out: TranslationModelSummary[] = [];
  for (const def of TRANSLATABLE_MODELS) {
    const counter = RECORD_COUNTERS[def.model];
    const [recordCount, translationRows] = await Promise.all([
      counter ? counter() : Promise.resolve(0),
      db.translation.count({ where: { model: def.model } }),
    ]);
    out.push({
      model: def.model,
      label: def.label,
      singular: def.singular,
      recordCount,
      translationRows,
    });
  }
  return out;
}
// ── Record listing (per model) ───────────────────────────────────────────────

interface RecordListRow {
  id: string;
  label: string;
  sublabel: string | null;
}

async function loadRecordList(model: string): Promise<RecordListRow[]> {
  switch (model) {
    case "Tour": {
      const rows = await db.tour.findMany({
        orderBy: { title: "asc" },
        select: { id: true, title: true, slug: true },
      });
      return rows.map((r) => ({ id: r.id, label: r.title, sublabel: r.slug }));
    }
    case "Destination": {
      const rows = await db.destination.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, slug: true },
      });
      return rows.map((r) => ({ id: r.id, label: r.name, sublabel: r.slug }));
    }
    case "Event": {
      const rows = await db.event.findMany({
        orderBy: [{ startDate: "desc" }],
        select: { id: true, title: true, slug: true },
      });
      return rows.map((r) => ({ id: r.id, label: r.title, sublabel: r.slug }));
    }
    case "TripIdea": {
      const rows = await db.tripIdea.findMany({
        orderBy: { title: "asc" },
        select: { id: true, title: true, slug: true },
      });
      return rows.map((r) => ({ id: r.id, label: r.title, sublabel: r.slug }));
    }
    case "ItineraryDay": {
      const rows = await db.itineraryDay.findMany({
        orderBy: [{ tourId: "asc" }, { dayNumber: "asc" }],
        select: { id: true, dayNumber: true, title: true, tour: { select: { title: true } } },
      });
      return rows.map((r) => ({
        id: r.id,
        label: `Day ${r.dayNumber}: ${r.title}`,
        sublabel: r.tour.title,
      }));
    }
    default:
      return [];
  }
}
export interface TranslatableRecordRow extends RecordListRow {
  /** Non-English locales that already have at least one translated field. */
  locales: string[];
}

export async function listTranslatableRecords(model: string): Promise<TranslatableRecordRow[]> {
  if (!getTranslatableModel(model)) return [];
  const rows = await loadRecordList(model);
  if (rows.length === 0) return [];

  const trans = await db.translation.findMany({
    where: { model, recordId: { in: rows.map((r) => r.id) } },
    select: { recordId: true, locale: true },
  });
  const byRecord = new Map<string, Set<string>>();
  for (const t of trans) {
    let set = byRecord.get(t.recordId);
    if (!set) {
      set = new Set();
      byRecord.set(t.recordId, set);
    }
    set.add(t.locale);
  }
  return rows.map((r) => ({ ...r, locales: [...(byRecord.get(r.id) ?? [])].sort() }));
}

// ── Editor read (English source + one locale's current translation) ──────────

export interface TranslatableFieldView {
  name: string;
  label: string;
  kind: string;
  sourceText: string;
  translatedText: string;
}

export interface TranslatableRecordView {
  model: string;
  modelSingular: string;
  recordId: string;
  recordLabel: string;
  sublabel: string | null;
  locale: Locale;
  fields: TranslatableFieldView[];
}
export async function getTranslatableRecord(
  model: string,
  recordId: string,
  locale: Locale,
): Promise<TranslatableRecordView | null> {
  const def = getTranslatableModel(model);
  if (!def) return null;
  const source = await loadSource(model, recordId);
  if (!source) return null;
  const existing = await getRecordTranslation(model as TranslatableModel, recordId, locale);
  const fields: TranslatableFieldView[] = def.fields.map((f) => ({
    name: f.name,
    label: f.label,
    kind: f.kind,
    sourceText: serializeFieldValue(f.kind, source.values[f.name]),
    translatedText: f.name in existing ? serializeFieldValue(f.kind, existing[f.name]) : "",
  }));
  return {
    model: def.model,
    modelSingular: def.singular,
    recordId,
    recordLabel: source.label,
    sublabel: source.sublabel,
    locale,
    fields,
  };
}

// ── Save / delete ─────────────────────────────────────────────────────────────

/**
 * Upsert the non-blank fields and delete the blank ones for one record+locale.
 * `values` is field-name → editor text. A blank field removes its row so the
 * public page falls back to the English source (never stores an empty string).
 * English is rejected — it is the source and is edited on the content itself.
 */
export async function saveRecordTranslations(
  model: string,
  recordId: string,
  locale: string,
  values: Record<string, string>,
): Promise<MutationResult> {
  const def = getTranslatableModel(model);
  if (!def) return fail("Unknown content type.");
  if (!isLocale(locale) || locale === defaultLocale) {
    return fail("Pick a translation language — English is the source and is edited on the content itself.");
  }
  const source = await loadSource(model, recordId);
  if (!source) return fail("That record no longer exists.");
  for (const f of def.fields) {
    const parsed = parseFieldValue(f.kind, values[f.name] ?? "");
    if (parsed === null) {
      await db.translation.deleteMany({ where: { model, recordId, locale, field: f.name } });
    } else {
      await db.translation.upsert({
        where: { model_recordId_locale_field: { model, recordId, locale, field: f.name } },
        create: {
          model,
          recordId,
          locale,
          field: f.name,
          value: parsed as Prisma.InputJsonValue,
        },
        update: { value: parsed as Prisma.InputJsonValue },
      });
    }
  }
  return { ok: true };
}

/**
 * Remove every translation row for a record — call from a model's delete path so
 * a deleted Tour/Event/… leaves no orphan rows behind. `recordId` is a soft
 * reference (no FK), so this is the only cleanup. Best-effort: never throws (a
 * translation-table hiccup must not block the primary delete), and an orphan row
 * is harmless anyway since it is never read for a missing record.
 */
export async function deleteRecordTranslations(model: string, recordId: string): Promise<void> {
  try {
    await db.translation.deleteMany({ where: { model, recordId } });
  } catch {
    // Swallow — orphaned translation rows are never read for a missing record.
  }
}

