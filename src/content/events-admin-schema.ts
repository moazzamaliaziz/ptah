/**
 * Events + Trip Ideas admin contract. Pure module: zod input schemas + parsing
 * helpers for the events/trip-idea management UI. No `server-only` / DB / Next
 * imports, so it is unit-testable and importable from client editors (same
 * boundary rule as catalog-admin-schema.ts).
 *
 * SECURITY: image `src` fields must be a site-relative path (/…) or https:// URL
 * (never other schemes). Reuses the catalog `TOUR_STATUSES` lifecycle.
 */
import { z } from "zod";
import type { TourStatus } from "@prisma/client";

export const CONTENT_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

/** lowercase, url-safe slug (letters/digits/hyphen; no leading/trailing/double hyphen). */
const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(1)
  .max(191)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, digits and single hyphens (e.g. abu-simbel-sun-festival).");

/** A site-relative path (/…, incl. /api/media/<id>) or https:// URL. */
const imageSrc = z
  .string()
  .trim()
  .max(512)
  .refine((v) => (v.startsWith("/") && !v.startsWith("//") ? true : /^https:\/\//i.test(v)), {
    message: "Image must be a site path (/…) or an https:// URL.",
  });

/** ISO calendar date (YYYY-MM-DD), the value an <input type="date"> posts. */
const isoDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format.");

// ── Events ─────────────────────────────────────────────────────────────────────

export const eventInputSchema = z
  .object({
    slug,
    title: z.string().trim().min(1, "Title is required.").max(255),
    summary: z.string().trim().min(1, "Summary is required.").max(512),
    description: z.string().trim().min(1, "Description is required.").max(20000),
    location: z.string().trim().max(200).nullable(),
    startDate: isoDate,
    endDate: isoDate.nullable(),
    recurring: z.boolean(),
    heroImage: imageSrc.nullable(),
    metaTitle: z.string().trim().max(255).nullable(),
    metaDesc: z.string().trim().max(320).nullable(),
    ogImage: imageSrc.nullable(),
    sortOrder: z.number().int().min(0).max(100000),
  })
  .refine((e) => e.endDate === null || e.endDate >= e.startDate, {
    message: "End date must be on or after the start date.",
    path: ["endDate"],
  });
export type EventInput = z.infer<typeof eventInputSchema>;

// ── Trip Ideas ───────────────────────────────────────────────────────────────

export const tripIdeaInputSchema = z.object({
  slug,
  title: z.string().trim().min(1, "Title is required.").max(255),
  summary: z.string().trim().min(1, "Summary is required.").max(512),
  descriptionLong: z.string().trim().min(1, "Description is required.").max(20000),
  heroImage: imageSrc.nullable(),
  metaTitle: z.string().trim().max(255).nullable(),
  metaDesc: z.string().trim().max(320).nullable(),
  ogImage: imageSrc.nullable(),
  sortOrder: z.number().int().min(0).max(100000),
});
export type TripIdeaInput = z.infer<typeof tripIdeaInputSchema>;

// ── Shared parsing helpers ─────────────────────────────────────────────────────

/** "" → null; otherwise the trimmed string. For optional single-line fields. */
export function emptyToNull(raw: string): string | null {
  const t = raw.trim();
  return t === "" ? null : t;
}

// Compile-time guarantee the status union matches the Prisma enum.
const _statusCheck: readonly TourStatus[] = CONTENT_STATUSES;
void _statusCheck;
