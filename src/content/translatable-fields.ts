/**
 * Translatable-field registry (Phase 3 / item #11) — the single source of truth
 * for WHICH fields are translatable on each model and how they are edited.
 *
 * Dependency-free (no `server-only`, no DB, no React) so both the admin editor
 * (client) and the save action (server) import the same definitions and the
 * same serialize/parse helpers — the on-disk shape can never drift between the
 * two. The field `name`s here MUST match both the source model column and the
 * `Translation.field` value the public read overlay looks up (see
 * `src/server/translations.ts`), so a translated row overlays the right field.
 *
 * Scope note: only the five catalog/editorial models the public read layer
 * currently overlays are listed. ContentSection / SiteSetting / FloatingWidget
 * / MediaAsset are intentionally deferred (see HANDOFF / P3 Track C).
 */

/**
 * How a field is edited and stored:
 *  - `line`  → single-line string (title, name, CTA, meta title).
 *  - `text`  → multi-line string (summary, description, meta description).
 *  - `list`  → string[], one item per line in the editor.
 *  - `faq`   → {q,a}[], one `question :: answer` per line in the editor.
 */
export type TranslatableFieldKind = "line" | "text" | "list" | "faq";

export interface TranslatableField {
  /** Column name on the source model AND the `Translation.field` value. */
  name: string;
  label: string;
  kind: TranslatableFieldKind;
}

export interface TranslatableModelDef {
  /** The `Translation.model` value, e.g. "Tour". */
  model: string;
  /** Human label (plural) for nav/lists. */
  label: string;
  /** Human label (singular) for headings. */
  singular: string;
  fields: TranslatableField[];
}

/** Field lists mirror exactly what the public read overlay localizes today. */
export const TRANSLATABLE_MODELS: readonly TranslatableModelDef[] = [
  {
    model: "Tour",
    label: "Tours",
    singular: "Tour",
    fields: [
      { name: "title", label: "Title", kind: "line" },
      { name: "summary", label: "Summary", kind: "text" },
      { name: "descriptionLong", label: "Full description", kind: "text" },
      { name: "inclusions", label: "What's included", kind: "list" },
      { name: "exclusions", label: "What's not included", kind: "list" },
      { name: "faqs", label: "FAQs", kind: "faq" },
      { name: "travelNotes", label: "Travel notes", kind: "list" },
      { name: "ctaLabel", label: "Call-to-action label", kind: "line" },
      { name: "metaTitle", label: "SEO meta title", kind: "line" },
      { name: "metaDesc", label: "SEO meta description", kind: "text" },
    ],
  },
  {
    model: "Destination",
    label: "Destinations",
    singular: "Destination",
    fields: [
      { name: "name", label: "Name", kind: "line" },
      { name: "region", label: "Region", kind: "line" },
    ],
  },
  {
    model: "Event",
    label: "Events",
    singular: "Event",
    fields: [
      { name: "title", label: "Title", kind: "line" },
      { name: "summary", label: "Summary", kind: "text" },
      { name: "description", label: "Description", kind: "text" },
      { name: "location", label: "Location", kind: "line" },
      { name: "metaTitle", label: "SEO meta title", kind: "line" },
      { name: "metaDesc", label: "SEO meta description", kind: "text" },
    ],
  },
  {
    model: "TripIdea",
    label: "Trip ideas",
    singular: "Trip idea",
    fields: [
      { name: "title", label: "Title", kind: "line" },
      { name: "summary", label: "Summary", kind: "text" },
      { name: "descriptionLong", label: "Full description", kind: "text" },
      { name: "metaTitle", label: "SEO meta title", kind: "line" },
      { name: "metaDesc", label: "SEO meta description", kind: "text" },
    ],
  },
  {
    model: "ItineraryDay",
    label: "Itinerary days",
    singular: "Itinerary day",
    fields: [
      { name: "title", label: "Title", kind: "line" },
      { name: "description", label: "Description", kind: "text" },
    ],
  },
];

/** Look up a model definition by its `Translation.model` name. */
export function getTranslatableModel(model: string): TranslatableModelDef | undefined {
  return TRANSLATABLE_MODELS.find((m) => m.model === model);
}

// ── Serialize (stored JSON → editor text) / parse (editor text → stored JSON) ──
//
// The editor works in plain text per field; these helpers convert to/from the
// Json shape the read overlay expects. `parseFieldValue` returns `null` when the
// field is blank — the caller deletes that translation row so the field falls
// back to English rather than storing an empty override.

/** Convert a stored translation value to the text shown in the editor. */
export function serializeFieldValue(kind: TranslatableFieldKind, value: unknown): string {
  switch (kind) {
    case "line":
    case "text":
      return typeof value === "string" ? value : "";
    case "list":
      return Array.isArray(value) ? value.filter((x) => typeof x === "string").join("\n") : "";
    case "faq":
      return Array.isArray(value)
        ? value
            .flatMap((item) => {
              if (item && typeof item === "object" && !Array.isArray(item)) {
                const { q, a } = item as Record<string, unknown>;
                if (typeof q === "string" && typeof a === "string") return [`${q} :: ${a}`];
              }
              return [];
            })
            .join("\n")
        : "";
  }
}

/**
 * Convert editor text back to the stored Json shape, or `null` when blank
 * (blank ⇒ remove the override, fall back to English). Malformed lines are
 * dropped; the public read overlay independently re-validates and falls back to
 * English on any bad shape, so a bad save can only ever revert to English.
 */
export function parseFieldValue(kind: TranslatableFieldKind, raw: string): unknown {
  switch (kind) {
    case "line":
    case "text": {
      const v = raw.trim();
      return v.length > 0 ? v : null;
    }
    case "list": {
      const arr = raw
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
      return arr.length > 0 ? arr : null;
    }
    case "faq": {
      const arr = raw
        .split("\n")
        .flatMap((line) => {
          const idx = line.indexOf("::");
          if (idx === -1) return [];
          const q = line.slice(0, idx).trim();
          const a = line.slice(idx + 2).trim();
          return q && a ? [{ q, a }] : [];
        });
      return arr.length > 0 ? arr : null;
    }
  }
}
