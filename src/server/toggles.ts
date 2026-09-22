/**
 * Site feature toggles (Phase 2, Q13; schema `SiteToggle`).
 *
 * Four runtime flags: SIGNUP_ENABLED, LOGIN_ENABLED, PAYMENTS_STRIPE_ENABLED,
 * MAINTENANCE_MODE. The DB rows are the runtime source of truth; env FEATURE_*
 * vars are only boot-time defaults used until (and if) a row is read.
 *
 * Reads are cached per-process for a short TTL so hot public paths (every
 * request checks MAINTENANCE_MODE) do not hit the DB each time. A write
 * invalidates the cache immediately in the writing worker; other workers pick
 * the change up within TTL (acceptable eventual consistency for feature flags
 * on this single-VPS topology). If the DB is unreachable, reads fall back to
 * the env defaults so the site keeps serving.
 */
import "server-only";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export const TOGGLE_KEYS = [
  "SIGNUP_ENABLED",
  "LOGIN_ENABLED",
  "PAYMENTS_STRIPE_ENABLED",
  "PAYMENTS_PAYPAL_ENABLED",
  "PAYMENTS_BANK_TRANSFER_ENABLED",
  "MAINTENANCE_MODE",
] as const;

export type ToggleKey = (typeof TOGGLE_KEYS)[number];
export type ToggleMap = Record<ToggleKey, boolean>;

function defaults(): ToggleMap {
  return {
    SIGNUP_ENABLED: env.FEATURE_SIGNUP_ENABLED,
    LOGIN_ENABLED: env.FEATURE_LOGIN_ENABLED,
    PAYMENTS_STRIPE_ENABLED: env.FEATURE_STRIPE_PAYMENTS_ENABLED,
    PAYMENTS_PAYPAL_ENABLED: env.FEATURE_PAYPAL_PAYMENTS_ENABLED,
    PAYMENTS_BANK_TRANSFER_ENABLED: env.FEATURE_BANK_TRANSFER_ENABLED,
    MAINTENANCE_MODE: env.FEATURE_MAINTENANCE_MODE,
  };
}

const CACHE_TTL_MS = 10_000;

const globalForToggles = globalThis as unknown as {
  __ptahToggles?: { data: ToggleMap; expires: number };
};

/** Read all toggles (cached). Falls back to env defaults on any DB error. */
export async function getToggles(): Promise<ToggleMap> {
  const cached = globalForToggles.__ptahToggles;
  if (cached && cached.expires > Date.now()) return cached.data;

  const map = defaults();
  try {
    const rows = await db.siteToggle.findMany({ select: { key: true, value: true } });
    for (const row of rows) {
      if ((TOGGLE_KEYS as readonly string[]).includes(row.key)) {
        map[row.key as ToggleKey] = row.value;
      }
    }
  } catch (error) {
    logger.warn("toggles read failed — using env defaults", { error });
    return map;
  }

  globalForToggles.__ptahToggles = { data: map, expires: Date.now() + CACHE_TTL_MS };
  return map;
}

export async function getToggle(key: ToggleKey): Promise<boolean> {
  return (await getToggles())[key];
}

/** Invalidate the per-process cache (called after a write). */
export function invalidateToggleCache(): void {
  globalForToggles.__ptahToggles = undefined;
}

/**
 * Upsert a toggle value and invalidate the cache. Returns the new value.
 * Authorization + audit are the caller's responsibility (server action).
 */
export async function setToggle(key: ToggleKey, value: boolean, description?: string): Promise<boolean> {
  await db.siteToggle.upsert({
    where: { key },
    update: { value, ...(description ? { description } : {}) },
    create: { key, value, description: description ?? null },
  });
  invalidateToggleCache();
  return value;
}
