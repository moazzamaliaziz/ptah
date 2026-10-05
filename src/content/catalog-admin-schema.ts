/**
 * Catalog admin contract (Phase 7 — Subsystem 2). Pure module: zod input
 * schemas + parsing helpers for the tour/destination management UI. No
 * `server-only` / DB / Next imports so it is unit-testable in the Phase 7 probe
 * and importable from client editors.
 *
 * SECURITY: every href field is scheme-allowlisted via safe-url (blocks
 * javascript:/data:); image `src` fields must be a site-relative path or an
 * https:// URL (an image element never executes a "javascript:" URL, but we
 * still forbid other schemes). Money is entered in major units by the editor
 * and converted to integer cents (`dollarsToCents`) at the boundary — never
 * stored as a float.
 */
import { z } from "zod";
import { SAFE_URL_RE } from "@/lib/safe-url";
import { TOUR_TAGS } from "@/content/tour-tags";
import type { Difficulty, TourStatus } from "@prisma/client";

export const DIFFICULTIES = ["EASY", "MODERATE", "CHALLENGING"] as const;
export const TOUR_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export const DEPARTURE_STATUSES = ["OPEN", "CLOSED", "CANCELED"] as const;

/** lowercase, url-safe slug (letters/digits/hyphen; no leading/trailing/double hyphen). */
const slug = z
  .string()
  .trim()
  .toLowerCase()
  .min(1)
  .max(191)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, digits and single hyphens (e.g. nile-cruise).");

/** An image source: a site-relative path (/…, incl. /api/media/<id>) or https:// URL. */
const imageSrc = z
  .string()
  .trim()
  .max(512)
  .refine((v) => v.startsWith("/") && !v.startsWith("//") ? true : /^https:\/\//i.test(v), {
    message: "Image must be a site path (/…) or an https:// URL.",
  });

/** A navigation href (relative, https://, mailto:, tel:) — scheme-allowlisted. */
const safeHref = z
  .string()
  .trim()
  .max(512)
  .refine((v) => SAFE_URL_RE.test(v), {
    message: "Link must be a relative path (/…), https://, mailto:, or tel:.",
  });

/** ISO calendar date (YYYY-MM-DD), the value an <input type="date"> posts. */
const isoDate = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format.");

const faqItem = z.object({
  q: z.string().trim().min(1, "Question is required.").max(300),
  a: z.string().trim().min(1, "Answer is required.").max(2000),
});
export type FaqItem = z.infer<typeof faqItem>;

/**
 * One "price per person by group size" band (P8). `maxPax` null = the
 * open-ended top band ("7 or more").
 */
export const groupPriceTierSchema = z
  .object({
    minPax: z.number().int().min(1, "A band starts at one traveler.").max(1000),
    maxPax: z.number().int().min(1).max(1000).nullable(),
    pricePerPersonCents: z.number().int().min(0, "Price cannot be negative.").max(1_000_000_00),
  })
  .refine((t) => t.maxPax == null || t.maxPax >= t.minPax, {
    message: "The band's largest size must be at least its smallest.",
    path: ["maxPax"],
  });
export type GroupPriceTierInput = z.infer<typeof groupPriceTierSchema>;

/**
 * The whole band set for a tour, validated as a unit.
 *
 * Overlaps are rejected HERE rather than tolerated, because a party size that
 * falls in two bands has two advertised prices — the customer reads one off the
 * table and the engine may charge the other. (`resolveTierPriceCents` still
 * picks deterministically for legacy rows, but we never let new ones in.) Gaps
 * are allowed on purpose: a size no band covers falls back to the tour's base
 * price, which is a sensible way to price, say, only groups of 4+.
 */
export const groupPriceTiersSchema = z
  .array(groupPriceTierSchema)
  .max(20, "Up to 20 group-size bands.")
  .superRefine((tiers, ctx) => {
    const sorted = [...tiers].sort((a, b) => a.minPax - b.minPax);
    for (let i = 0; i < sorted.length; i++) {
      const current = sorted[i];
      const next = sorted[i + 1];
      if (!current) continue;
      if (next && current.minPax === next.minPax) {
        ctx.addIssue({
          code: "custom",
          message: `Two group-size bands both start at ${current.minPax} travelers.`,
        });
        return;
      }
      // An open-ended band swallows everything above it, so it must be last.
      if (current.maxPax == null && next) {
        ctx.addIssue({
          code: "custom",
          message: `The "${current.minPax}+" band has to be the last one.`,
        });
        return;
      }
      if (next && current.maxPax != null && current.maxPax >= next.minPax) {
        ctx.addIssue({
          code: "custom",
          message: `Group-size bands overlap: ${current.minPax}–${current.maxPax} and ${next.minPax}${next.maxPax == null ? "+" : `–${next.maxPax}`}.`,
        });
        return;
      }
    }
  });

/** Shared editable core of a tour (create + update). Money already in cents. */
export const tourInputSchema = z.object({
  slug,
  title: z.string().trim().min(1, "Title is required.").max(255),
  summary: z.string().trim().min(1, "Summary is required.").max(512),
  descriptionLong: z.string().trim().min(1, "Description is required.").max(20000),
  durationDays: z.number().int().min(1, "At least one day.").max(365),
  basePriceCents: z.number().int().min(0, "Price cannot be negative.").max(1_000_000_00),
  // Per-passenger-type prices (P4). null ⇒ that type is NOT offered on this tour
  // (stepper hidden in the funnel); 0 is a valid free price. Adult uses basePriceCents.
  childPriceCents: z.number().int().min(0, "Price cannot be negative.").max(1_000_000_00).nullable(),
  infantPriceCents: z.number().int().min(0, "Price cannot be negative.").max(1_000_000_00).nullable(),
  // NOTE: there is deliberately no `currency` field. Ptah publishes one
  // currency (SITE_CURRENCY, see src/content/currency.ts), so it is not an
  // editable property of a tour — the write path stamps it. Leaving it editable
  // would let an editor quote a price in a currency the checkout and the
  // payment gateways cannot actually take.
  // P8 group-size bands. Empty ⇒ one flat adult price (basePriceCents).
  priceTiers: groupPriceTiersSchema,
  // P8 customer-chosen dates.
  onRequestDates: z.boolean(),
  requestLeadDays: z.number().int().min(0, "Lead time cannot be negative.").max(365),
  requestWindowDays: z.number().int().min(1, "The booking window must be at least a day.").max(1095),
  requestCapacity: z.number().int().min(1, "At least one seat.").max(10000),
  blackoutDates: z.array(isoDate).max(366),
  // When true, the public funnel shows a "booking paused" notice and the
  // transactional core rejects new reservations (defense in depth).
  bookingClosed: z.boolean(),
  difficulty: z.enum(DIFFICULTIES),
  tags: z.array(z.enum(TOUR_TAGS)).max(TOUR_TAGS.length),
  heroImage: imageSrc.nullable(),
  gallery: z.array(imageSrc).max(24),
  inclusions: z.array(z.string().trim().min(1).max(200)).max(60),
  exclusions: z.array(z.string().trim().min(1).max(200)).max(60),
  faqs: z.array(faqItem).max(30),
  travelNotes: z.array(z.string().trim().min(1).max(400)).max(40),
  ctaLabel: z.string().trim().max(120).nullable(),
  ctaHref: safeHref.nullable(),
  metaTitle: z.string().trim().max(255).nullable(),
  metaDesc: z.string().trim().max(320).nullable(),
  ogImage: imageSrc.nullable(),
}).refine((t) => (t.ctaLabel === null) === (t.ctaHref === null), {
  message: "Set both a CTA label and link, or leave both blank.",
  path: ["ctaHref"],
});
export type TourInput = z.infer<typeof tourInputSchema>;

export const destinationInputSchema = z.object({
  slug,
  name: z.string().trim().min(1, "Name is required.").max(160),
  region: z.string().trim().max(160).nullable(),
  description: z.string().trim().max(20000).nullable(),
  heroImage: imageSrc.nullable(),
  metaTitle: z.string().trim().max(255).nullable(),
  metaDesc: z.string().trim().max(320).nullable(),
  ogImage: imageSrc.nullable(),
});
export type DestinationInput = z.infer<typeof destinationInputSchema>;

export const itineraryDaySchema = z.object({
  dayNumber: z.number().int().min(1).max(365),
  title: z.string().trim().min(1, "Title is required.").max(255),
  description: z.string().trim().min(1, "Description is required.").max(5000),
});
export type ItineraryDayInput = z.infer<typeof itineraryDaySchema>;

export const departureInputSchema = z
  .object({
    startDate: isoDate,
    endDate: isoDate,
    maxCapacity: z.number().int().min(1, "At least one seat.").max(10000),
    priceOverrideCents: z.number().int().min(0).max(1_000_000_00).nullable(),
    status: z.enum(DEPARTURE_STATUSES),
  })
  .refine((d) => d.endDate >= d.startDate, {
    message: "End date must be on or after the start date.",
    path: ["endDate"],
  });
export type DepartureInput = z.infer<typeof departureInputSchema>;

// ── Pure parsing helpers (shared by server actions + probe) ────────────────────

/** Convert a major-unit money string ("1,299.50") to integer cents, or null if invalid. */
export function dollarsToCents(raw: string): number | null {
  const cleaned = raw.replace(/[,\s]/g, "").trim();
  if (cleaned === "" || !/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  // Parse as integer cents to dodge float rounding (e.g. 12.30 → 1230, not 1229).
  const [whole, frac = ""] = cleaned.split(".");
  const cents = Number(whole) * 100 + Number(frac.padEnd(2, "0"));
  return Number.isSafeInteger(cents) ? cents : null;
}

/** Render integer cents as a plain major-unit string ("1299.50") for form inputs. */
export function centsToDollars(cents: number): string {
  return (cents / 100).toFixed(2);
}

/** Split a textarea into trimmed, non-empty lines (inclusions, travel notes, gallery). */
export function splitLines(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/** "" → null; otherwise the trimmed string. For optional single-line fields. */
export function emptyToNull(raw: string): string | null {
  const t = raw.trim();
  return t === "" ? null : t;
}

// Compile-time guarantee that the string unions match the Prisma enums.
const _difficultyCheck: readonly Difficulty[] = DIFFICULTIES;
const _statusCheck: readonly TourStatus[] = TOUR_STATUSES;
void _difficultyCheck;
void _statusCheck;
