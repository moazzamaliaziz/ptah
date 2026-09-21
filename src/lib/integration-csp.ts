/**
 * CSP origin map for client-injected integrations (Phase 5).
 *
 * PURE DATA + PURE FUNCTIONS ONLY — no DB, no secrets, no `server-only`. This
 * module is imported by BOTH `src/proxy.ts` (the request boundary, which must
 * not import Prisma/server-only) and the internal site-state route. The vendor
 * origins below are public knowledge, so keeping them here is safe.
 *
 * The proxy adds ONLY the origins for integrations that are actually enabled
 * (learned via the site-state poll), so a disabled vendor never widens the CSP.
 * Note: the proxy's default `script-src` already carries `'unsafe-inline'` for
 * Next's inline bootstrap, so script-injection protection is limited there
 * regardless; the tight, integration-gated origins matter most for
 * `connect-src` / `img-src` / `frame-src` (where data actually egresses).
 */

/** The integrations whose client tags we inject + gate in the CSP. */
export const CSP_INTEGRATION_KEYS = ["GA4", "GTM", "META_PIXEL", "HOTJAR", "SENTRY"] as const;
export type CspIntegrationKey = (typeof CSP_INTEGRATION_KEYS)[number];

/** CSP directive → origins each integration needs. Omitted directive = none. */
interface OriginSet {
  script?: readonly string[];
  connect?: readonly string[];
  img?: readonly string[];
  frame?: readonly string[];
  font?: readonly string[];
}

const ORIGINS: Record<CspIntegrationKey, OriginSet> = {
  GA4: {
    script: ["https://www.googletagmanager.com"],
    connect: [
      "https://www.google-analytics.com",
      "https://*.google-analytics.com",
      "https://www.googletagmanager.com",
    ],
    img: ["https://www.google-analytics.com", "https://www.googletagmanager.com"],
  },
  GTM: {
    script: ["https://www.googletagmanager.com"],
    connect: ["https://www.googletagmanager.com", "https://www.google-analytics.com"],
    img: ["https://www.googletagmanager.com"],
    frame: ["https://www.googletagmanager.com"],
  },
  META_PIXEL: {
    script: ["https://connect.facebook.net"],
    connect: ["https://www.facebook.com"],
    img: ["https://www.facebook.com"],
  },
  HOTJAR: {
    script: ["https://static.hotjar.com", "https://script.hotjar.com"],
    connect: ["https://*.hotjar.com", "wss://*.hotjar.com"],
    img: ["https://*.hotjar.com"],
    font: ["https://*.hotjar.com"],
  },
  SENTRY: {
    script: ["https://js.sentry-cdn.com", "https://browser.sentry-cdn.com"],
    connect: ["https://*.sentry.io", "https://*.ingest.sentry.io"],
  },
};

export interface IntegrationCspOrigins {
  script: string[];
  connect: string[];
  img: string[];
  frame: string[];
  font: string[];
}

/**
 * Union the CSP origins for the given enabled integration keys. Unknown keys
 * are ignored. Returns de-duplicated, stable-ordered arrays per directive.
 */
export function integrationCspOrigins(enabledKeys: readonly string[]): IntegrationCspOrigins {
  const acc: Record<keyof IntegrationCspOrigins, Set<string>> = {
    script: new Set(),
    connect: new Set(),
    img: new Set(),
    frame: new Set(),
    font: new Set(),
  };

  for (const key of enabledKeys) {
    const set = ORIGINS[key as CspIntegrationKey];
    if (!set) continue;
    set.script?.forEach((o) => acc.script.add(o));
    set.connect?.forEach((o) => acc.connect.add(o));
    set.img?.forEach((o) => acc.img.add(o));
    set.frame?.forEach((o) => acc.frame.add(o));
    set.font?.forEach((o) => acc.font.add(o));
  }

  return {
    script: [...acc.script],
    connect: [...acc.connect],
    img: [...acc.img],
    frame: [...acc.frame],
    font: [...acc.font],
  };
}
