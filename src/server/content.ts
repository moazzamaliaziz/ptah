/**
 * Landing content service (Phase 2, Q4 — "the Admin Panel IS the CMS").
 *
 * getLandingContent() returns the EXACT same shapes the landing components
 * consumed directly from src/content/landing.ts in Phase 1 (the contract in
 * AGENTS.md: "prop shapes must NOT change"). Each of the 7 landing sections can
 * be overridden by a `ContentSection` row (type PAGE_SECTION, one stable row
 * per section, `data = { key: "landing.<section>", payload }`). Resolution:
 *
 *   enabled override row + payload passes its zod schema  → use the override
 *   otherwise (no row / disabled / invalid / DB down)      → SSOT default
 *
 * So the seed/default is always a working fallback, and a bad edit degrades to
 * the default section instead of breaking the page.
 */
import "server-only";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import {
  fiftyCtas as defFiftyCtas,
  heroSlides as defHeroSlides,
  inspiredTabs as defInspiredTabs,
  kbygItems as defKbygItems,
  planCta as defPlanCta,
  stories as defStories,
  tourTypes as defTourTypes,
} from "@/content/landing";
import type { HeroSlide, InspiredTab, PlanCtaBlock, Story } from "@/content/landing";
import { landingSchemas, type LandingSectionKey } from "@/content/landing-schema";

/* Tuple-typed sections must keep their exact tuple shape (the components take
   fixed-length tuples, not open arrays) — mirror the SSOT export types. */
type TourTypeTuple = typeof defTourTypes;
type FiftyCtaTuple = typeof defFiftyCtas;
type KbygTuple = typeof defKbygItems;

export interface LandingContent {
  heroSlides: HeroSlide[];
  inspiredTabs: InspiredTab[];
  planCta: PlanCtaBlock;
  fiftyCtas: FiftyCtaTuple;
  kbygItems: KbygTuple;
  tourTypes: TourTypeTuple;
  stories: Story[];
}

interface SectionMeta {
  /** Stable ContentSection.id so admin edits upsert one row per section. */
  stableId: string;
  label: string;
}

/** Fixed row ids (hand-assigned UUIDs) — one CMS row per landing section. */
export const LANDING_SECTIONS: Record<LandingSectionKey, SectionMeta> = {
  hero: { stableId: "a1000000-0000-4000-8000-000000000001", label: "Hero — inspiration slides" },
  getInspired: { stableId: "a1000000-0000-4000-8000-000000000002", label: "Get Inspired — tabs & cards" },
  planCta: { stableId: "a1000000-0000-4000-8000-000000000003", label: "Plan Your Dream Trip — CTA" },
  fiftyCtas: { stableId: "a1000000-0000-4000-8000-000000000004", label: "50/50 CTA pair" },
  kbyg: { stableId: "a1000000-0000-4000-8000-000000000005", label: "Know Before You Go" },
  tourTypes: { stableId: "a1000000-0000-4000-8000-000000000006", label: "Tour Types" },
  stories: { stableId: "a1000000-0000-4000-8000-000000000007", label: "Featured Stories" },
};

const dataKey = (key: LandingSectionKey): string => `landing.${key}`;

/** Read enabled overrides, indexed by their `data.key`. Empty on any DB error. */
async function readOverrides(): Promise<Map<string, unknown>> {
  const map = new Map<string, unknown>();
  try {
    const rows = await db.contentSection.findMany({
      where: { type: "PAGE_SECTION", enabled: true },
      select: { data: true },
    });
    for (const row of rows) {
      const d = row.data as { key?: unknown; payload?: unknown } | null;
      if (d && typeof d.key === "string" && "payload" in d) {
        map.set(d.key, d.payload);
      }
    }
  } catch (error) {
    logger.warn("landing content overrides unreadable — using defaults", { error });
  }
  return map;
}

/** Validate one override payload against its schema, else fall back. */
function resolve<K extends LandingSectionKey>(
  key: K,
  overrides: Map<string, unknown>,
  fallback: unknown,
): unknown {
  if (!overrides.has(dataKey(key))) return fallback;
  const parsed = landingSchemas[key].safeParse(overrides.get(dataKey(key)));
  if (parsed.success) return parsed.data;
  logger.warn("landing override failed validation — using default", { section: key });
  return fallback;
}

export async function getLandingContent(): Promise<LandingContent> {
  const o = await readOverrides();
  return {
    heroSlides: resolve("hero", o, defHeroSlides) as HeroSlide[],
    inspiredTabs: resolve("getInspired", o, defInspiredTabs) as InspiredTab[],
    planCta: resolve("planCta", o, defPlanCta) as PlanCtaBlock,
    fiftyCtas: resolve("fiftyCtas", o, defFiftyCtas) as FiftyCtaTuple,
    kbygItems: resolve("kbyg", o, defKbygItems) as KbygTuple,
    tourTypes: resolve("tourTypes", o, defTourTypes) as TourTypeTuple,
    stories: resolve("stories", o, defStories) as Story[],
  };
}

// ── Admin CMS helpers ─────────────────────────────────────────────────────────

const DEFAULTS: Record<LandingSectionKey, unknown> = {
  hero: defHeroSlides,
  getInspired: defInspiredTabs,
  planCta: defPlanCta,
  fiftyCtas: defFiftyCtas,
  kbyg: defKbygItems,
  tourTypes: defTourTypes,
  stories: defStories,
};

export interface LandingSectionState {
  key: LandingSectionKey;
  label: string;
  overridden: boolean;
  /** Pretty JSON of the current effective payload (override if valid, else default). */
  json: string;
}

export async function getLandingSection(key: LandingSectionKey): Promise<LandingSectionState> {
  const meta = LANDING_SECTIONS[key];
  const row = await db.contentSection.findUnique({
    where: { id: meta.stableId },
    select: { data: true, enabled: true },
  });
  let effective: unknown = DEFAULTS[key];
  let overridden = false;
  if (row) {
    const d = row.data as { payload?: unknown } | null;
    if (d && "payload" in d) {
      const parsed = landingSchemas[key].safeParse(d.payload);
      if (parsed.success) {
        effective = parsed.data;
        overridden = true;
      }
    }
  }
  return { key, label: meta.label, overridden, json: JSON.stringify(effective, null, 2) };
}

export async function listLandingSections(): Promise<Array<{ key: LandingSectionKey; label: string; overridden: boolean }>> {
  const rows = await db.contentSection.findMany({
    where: { type: "PAGE_SECTION", enabled: true },
    select: { data: true },
  });
  const overriddenKeys = new Set<string>();
  for (const row of rows) {
    const d = row.data as { key?: unknown } | null;
    if (d && typeof d.key === "string") overriddenKeys.add(d.key);
  }
  return (Object.keys(LANDING_SECTIONS) as LandingSectionKey[]).map((key) => ({
    key,
    label: LANDING_SECTIONS[key].label,
    overridden: overriddenKeys.has(dataKey(key)),
  }));
}

export type SaveResult = { ok: true } | { ok: false; error: string };

/** Validate + persist a section override. Rejects invalid JSON / bad shape. */
export async function saveLandingSection(key: LandingSectionKey, rawJson: string): Promise<SaveResult> {
  let payload: unknown;
  try {
    payload = JSON.parse(rawJson);
  } catch {
    return { ok: false, error: "Payload is not valid JSON." };
  }
  const parsed = landingSchemas[key].safeParse(payload);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return { ok: false, error: `Shape invalid: ${first ? `${first.path.join(".")} — ${first.message}` : "does not match the section schema"}.` };
  }
  const meta = LANDING_SECTIONS[key];
  const data = { key: dataKey(key), payload: parsed.data } as Prisma.InputJsonValue;
  await db.contentSection.upsert({
    where: { id: meta.stableId },
    update: { data, enabled: true, type: "PAGE_SECTION" },
    create: { id: meta.stableId, type: "PAGE_SECTION", data, enabled: true, sortOrder: 0 },
  });
  return { ok: true };
}

/** Remove a section override so the SSOT default is served again. */
export async function resetLandingSection(key: LandingSectionKey): Promise<void> {
  await db.contentSection.deleteMany({ where: { id: LANDING_SECTIONS[key].stableId } });
}
