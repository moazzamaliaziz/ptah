/**
 * Site settings read/write layer (Phase 7 — Subsystem 1 foundations).
 *
 * Mirrors src/server/toggles.ts exactly: a short-TTL per-process cache over the
 * `site_settings` table so hot public paths (footer, header, metadata) do not
 * hit the DB each request. The DB rows are the runtime source of truth; the
 * typed defaults in content/settings-schema.ts (sourced from content/landing.ts)
 * are the fail-safe fallback used until — and if — a valid row is read.
 *
 * Per-key validation: each stored `value` is JSON-decoded and parsed through its
 * zod schema. A malformed/edited row can never crash a page or violate a prop
 * contract — it silently falls back to that key's typed default (same
 * philosophy as getLandingContent).
 *
 * A write invalidates this worker's cache immediately; other workers pick the
 * change up within TTL (acceptable eventual consistency; branding/contact are
 * not security-sensitive). If the DB is unreachable, reads return defaults so
 * the site keeps serving.
 */
import "server-only";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import {
  SETTINGS_SCHEMA,
  settingsDefaults,
  type SettingKey,
  type SettingValue,
  type SettingsMap,
} from "@/content/settings-schema";

const CACHE_TTL_MS = 10_000;

const globalForSettings = globalThis as unknown as {
  __ptahSettings?: { data: SettingsMap; expires: number };
};

/**
 * Read every setting (cached), each resolved to a valid typed value. Any DB
 * error → full defaults. Any single malformed row → that key's default only.
 */
export async function getSettings(): Promise<SettingsMap> {
  const cached = globalForSettings.__ptahSettings;
  if (cached && cached.expires > Date.now()) return cached.data;

  const map = settingsDefaults();
  let rows: { key: string; value: string }[];
  try {
    rows = await db.siteSetting.findMany({ select: { key: true, value: true } });
  } catch (error) {
    logger.warn("settings read failed — using defaults", { error });
    return map;
  }

  for (const row of rows) {
    if (!(row.key in SETTINGS_SCHEMA)) continue; // ignore unknown/legacy keys
    const key = row.key as SettingKey;
    const parsed = parseStoredValue(key, row.value);
    if (parsed.ok) {
      (map as Record<string, unknown>)[key] = parsed.value;
    } else {
      logger.warn("settings row invalid — using default for key", { key });
    }
  }

  globalForSettings.__ptahSettings = { data: map, expires: Date.now() + CACHE_TTL_MS };
  return map;
}

/** Read one setting (goes through the same cached map). */
export async function getSetting<K extends SettingKey>(key: K): Promise<SettingValue<K>> {
  return (await getSettings())[key];
}

/** Invalidate the per-process cache (called after a write). */
export function invalidateSettingsCache(): void {
  globalForSettings.__ptahSettings = undefined;
}

type ParseResult<K extends SettingKey> =
  | { ok: true; value: SettingValue<K> }
  | { ok: false };

/** JSON-decode a stored string and validate it against the key's zod schema. */
function parseStoredValue<K extends SettingKey>(key: K, raw: string): ParseResult<K> {
  let decoded: unknown;
  try {
    decoded = JSON.parse(raw);
  } catch {
    return { ok: false };
  }
  const result = SETTINGS_SCHEMA[key].schema.safeParse(decoded);
  if (!result.success) return { ok: false };
  return { ok: true, value: result.data as SettingValue<K> };
}

/**
 * Validate + persist one setting, then invalidate the cache. Throws when the
 * value fails its schema (the caller — a server action — catches and returns a
 * safe error). Authorization + audit are the caller's responsibility.
 */
export async function setSetting<K extends SettingKey>(
  key: K,
  value: SettingValue<K>,
): Promise<SettingValue<K>> {
  const result = SETTINGS_SCHEMA[key].schema.safeParse(value);
  if (!result.success) {
    throw new Error(`Invalid value for setting "${key}": ${result.error.issues[0]?.message ?? "validation failed"}`);
  }
  const encoded = JSON.stringify(result.data);
  await db.siteSetting.upsert({
    where: { key },
    update: { value: encoded },
    create: { key, value: encoded },
  });
  invalidateSettingsCache();
  return result.data as SettingValue<K>;
}
