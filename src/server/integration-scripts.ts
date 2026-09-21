/**
 * Client-injectable integration config (Phase 5).
 *
 * Reads the vault and returns ONLY the non-secret public identifiers needed to
 * render each vendor's client tag (GA4 measurement id, GTM container id, Meta
 * Pixel id, Hotjar site id, Sentry DSN). Secret fields are never touched here.
 *
 * Consumed by:
 *   - src/components/site/AnalyticsScripts.tsx (renders the tags), and
 *   - the /api/internal/site-state route (reports which CSP keys are active so
 *     the proxy can widen the CSP for exactly those vendors).
 *
 * An integration is ACTIVE only when it is enabled AND its required public id
 * is present — so a toggle flipped on without an id injects nothing (and does
 * not widen the CSP). Results are cached per-process for a short TTL (the same
 * eventual-consistency contract as site toggles); a DB error fails safe to "no
 * active integrations" so a DB-less build still pre-renders.
 *
 * server-only: reads Prisma + decrypts config.
 */
import "server-only";
import { db } from "@/lib/db";
import { openJson } from "@/lib/secret-box";
import { CSP_INTEGRATION_KEYS, type CspIntegrationKey } from "@/lib/integration-csp";
import { logger } from "@/lib/logger";

export interface ClientIntegrations {
  ga4?: { measurementId: string };
  gtm?: { containerId: string };
  metaPixel?: { pixelId: string };
  hotjar?: { siteId: string };
  sentry?: { dsn: string };
}

type StoredConfig = Record<string, string>;

const CACHE_TTL_MS = 10_000;
const globalForIntegrationScripts = globalThis as unknown as {
  __ptahClientIntegrations?: { data: ClientIntegrations; expires: number };
};

/** Non-empty string field from a decrypted config, else undefined. */
function field(config: StoredConfig | null, name: string): string | undefined {
  const v = config?.[name]?.trim();
  return v && v.length > 0 ? v : undefined;
}

/**
 * The client-safe public config for every ACTIVE injectable integration.
 * Cached per-process; fails safe to `{}` on any DB/crypto error.
 */
export async function getClientIntegrations(): Promise<ClientIntegrations> {
  const cached = globalForIntegrationScripts.__ptahClientIntegrations;
  if (cached && cached.expires > Date.now()) return cached.data;

  const result: ClientIntegrations = {};
  try {
    const rows = await db.integration.findMany({
      where: { key: { in: [...CSP_INTEGRATION_KEYS] }, enabled: true },
      select: { key: true, configEncrypted: true },
    });

    for (const row of rows) {
      const config = openJson<StoredConfig>(row.configEncrypted);
      switch (row.key as CspIntegrationKey) {
        case "GA4": {
          const measurementId = field(config, "MEASUREMENT_ID");
          if (measurementId) result.ga4 = { measurementId };
          break;
        }
        case "GTM": {
          const containerId = field(config, "CONTAINER_ID");
          if (containerId) result.gtm = { containerId };
          break;
        }
        case "META_PIXEL": {
          const pixelId = field(config, "PIXEL_ID");
          if (pixelId) result.metaPixel = { pixelId };
          break;
        }
        case "HOTJAR": {
          const siteId = field(config, "SITE_ID");
          if (siteId) result.hotjar = { siteId };
          break;
        }
        case "SENTRY": {
          const dsn = field(config, "DSN");
          if (dsn) result.sentry = { dsn };
          break;
        }
      }
    }
  } catch (error) {
    logger.warn("client integrations read failed — injecting none", { error });
    return {};
  }

  globalForIntegrationScripts.__ptahClientIntegrations = {
    data: result,
    expires: Date.now() + CACHE_TTL_MS,
  };
  return result;
}

/** The CSP keys that are currently active — for the proxy's origin allowlist. */
export async function getActiveCspIntegrationKeys(): Promise<CspIntegrationKey[]> {
  const c = await getClientIntegrations();
  const keys: CspIntegrationKey[] = [];
  if (c.ga4) keys.push("GA4");
  if (c.gtm) keys.push("GTM");
  if (c.metaPixel) keys.push("META_PIXEL");
  if (c.hotjar) keys.push("HOTJAR");
  if (c.sentry) keys.push("SENTRY");
  return keys;
}
