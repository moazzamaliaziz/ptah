/**
 * Server-side Stripe client (Phase 3, Q8).
 *
 * Key resolution is VAULT-FIRST, then env:
 *   1. the admin integrations vault (Phase 2 — `Integration` key "STRIPE",
 *      AES-256-GCM at rest) so keys are rotatable from the admin UI, then
 *   2. `env.STRIPE_SECRET_KEY` / `env.STRIPE_WEBHOOK_SECRET` as a fallback for
 *      deployments that inject secrets purely through the environment.
 *
 * Everything returns `null` when Stripe is not configured, so the whole
 * commerce flow degrades gracefully (the UI shows "payments unavailable"
 * instead of throwing) rather than crashing a render or a webhook.
 *
 * The client itself is memoized per resolved secret key: a key rotation in the
 * vault produces a fresh client on the next call without a process restart.
 */
import "server-only";
import Stripe from "stripe";
import { env } from "@/lib/env";
import { getIntegrationConfig, isIntegrationActive } from "@/server/integrations";

/** Pinned to the version stripe@19.x was generated against (its type surface). */
const STRIPE_API_VERSION = "2025-09-30.clover" as const;

const globalForStripe = globalThis as unknown as {
  __ptahStripe?: { key: string; client: Stripe };
};

export interface StripeCredentials {
  secretKey: string;
  webhookSecret: string | null;
  publishableKey: string | null;
}

/**
 * Resolve Stripe credentials, vault-first. Returns null when no usable secret
 * key exists anywhere. The vault is only consulted when the STRIPE integration
 * is enabled AND has stored config (so a half-configured, disabled row never
 * shadows a working env key).
 */
export async function resolveStripeCredentials(): Promise<StripeCredentials | null> {
  let secretKey: string | undefined;
  let webhookSecret: string | undefined;
  let publishableKey: string | undefined;

  if (await isIntegrationActive("STRIPE")) {
    const cfg = await getIntegrationConfig("STRIPE");
    if (cfg) {
      secretKey = cfg.SECRET_KEY?.trim() || undefined;
      webhookSecret = cfg.WEBHOOK_SECRET?.trim() || undefined;
      publishableKey = cfg.PUBLISHABLE_KEY?.trim() || undefined;
    }
  }

  // Env fallback (fills any gap the vault did not provide).
  secretKey ??= env.STRIPE_SECRET_KEY;
  webhookSecret ??= env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey) return null;
  return {
    secretKey,
    webhookSecret: webhookSecret ?? null,
    publishableKey: publishableKey ?? null,
  };
}

/** Build (or reuse) a Stripe client for the given secret key. */
function clientFor(secretKey: string): Stripe {
  const cached = globalForStripe.__ptahStripe;
  if (cached && cached.key === secretKey) return cached.client;
  const client = new Stripe(secretKey, {
    apiVersion: STRIPE_API_VERSION,
    typescript: true,
    appInfo: { name: "Ptah Tours", version: "0.1.0" },
  });
  globalForStripe.__ptahStripe = { key: secretKey, client };
  return client;
}

/**
 * Get a ready Stripe client, or null when unconfigured. Callers MUST handle
 * null (payments not set up) rather than assuming a client exists.
 */
export async function getStripe(): Promise<Stripe | null> {
  const creds = await resolveStripeCredentials();
  if (!creds) return null;
  return clientFor(creds.secretKey);
}

/** The webhook signing secret (vault-first, then env), or null. */
export async function getWebhookSecret(): Promise<string | null> {
  const creds = await resolveStripeCredentials();
  return creds?.webhookSecret ?? null;
}

export { STRIPE_API_VERSION };
export type { Stripe };
