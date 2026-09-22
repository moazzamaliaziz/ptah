/**
 * Central, zod-validated environment access.
 *
 * Fail-fast: this module THROWS at import time when required variables are
 * missing or malformed. It is imported at server boot from
 * src/instrumentation.ts, so a bad deployment fails loudly before serving
 * traffic instead of midway through a request.
 *
 * server-only: never import from Client Components. For the browser use
 * process.env.NEXT_PUBLIC_* directly (Next inlines those at build time).
 */
import "server-only";
import { z } from "zod";

/** Treat "" (common in .env templates) as "not set" for optional values. */
const optionalString = () =>
  z
    .string()
    .optional()
    .transform((v) => (v === undefined || v.trim() === "" ? undefined : v));

const optionalUrl = () =>
  z
    .string()
    .optional()
    .transform((v) => (v === undefined || v.trim() === "" ? undefined : v))
    .pipe(z.url().optional());

const boolFromString = (defaultValue: boolean) =>
  z
    .string()
    .optional()
    .transform((v) => {
      if (v === undefined || v.trim() === "") return defaultValue;
      return ["1", "true", "yes", "on"].includes(v.trim().toLowerCase());
    });

const envSchema = z
  .object({
    // ── Database ────────────────────────────────────────────────────────────
    DATABASE_URL: z
      .string()
      .min(1, "DATABASE_URL is required (mysql://user:pass@host:3306/db)"),
    DATABASE_URL_DIRECT: optionalString(),

    // ── Auth (Auth.js v5) — at least one secret name must be set ────────────
    AUTH_SECRET: optionalString(),
    NEXTAUTH_SECRET: optionalString(),
    AUTH_URL: optionalUrl(),

    // ── Payments ─────────────────────────────────────────────────────────────
    // Stripe + PayPal credentials are vault-first (admin Integrations), with
    // these env vars as a deployment fallback. See src/lib/stripe.ts /
    // src/server/payments/paypal.ts for resolution order.
    STRIPE_SECRET_KEY: optionalString(),
    STRIPE_WEBHOOK_SECRET: optionalString(),
    // Bank-transfer instructions shown on the offline-payment page. Free text
    // (account name/number/IBAN/reference guidance). Optional — if the bank
    // transfer method is enabled but this is unset, the page shows a safe
    // "we'll email you the details" message rather than any invented numbers.
    BANK_TRANSFER_INSTRUCTIONS: optionalString(),

    // ── Rate limiting (optional shared store) ────────────────────────────────
    // When set, the rate limiter uses this Redis instance so limits are shared
    // across all app processes/instances (correct under horizontal scaling).
    // Unset → the in-memory per-process limiter (correct for a single process).
    // Kept as a plain string (not z.url()) so a redis:// URL never blocks boot.
    REDIS_URL: optionalString(),

    // ── Integrations vault (Phase 2) ─────────────────────────────────────────
    // 32+ byte secret used to derive the AES-256-GCM key that encrypts the 20
    // integration credential blobs at rest. Optional in dev — src/lib/secret-box
    // falls back to deriving from AUTH_SECRET. Set a dedicated value in prod.
    INTEGRATIONS_SECRET: optionalString(),

    // ── Public site URL ─────────────────────────────────────────────────────
    NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),

    // ── Trusted reverse-proxy count for client-IP resolution ─────────────────
    // Number of proxies the app sits behind (nginx/traefik/CDN). Used by
    // src/lib/client-ip.ts to pick the correct X-Forwarded-For entry from the
    // RIGHT. Default 1 (single VPS + one nginx). See that file's header for the
    // spoofing rationale. Coerced from string; clamped to a sane 0–10.
    TRUSTED_PROXY_COUNT: z
      .string()
      .optional()
      .transform((v) => (v === undefined || v.trim() === "" ? 1 : Number.parseInt(v, 10)))
      .pipe(z.number().int().min(0).max(10)),

    // ── Optional observability / analytics ──────────────────────────────────
    SENTRY_DSN: optionalString(),
    NEXT_PUBLIC_GA4_ID: optionalString(),
    NEXT_PUBLIC_GTM_ID: optionalString(),

    // ── App environment ─────────────────────────────────────────────────────
    // Lenient on purpose: trim + lowercase, and treat any other value (e.g. a
    // mis-cased "Production" or a stray platform value) as unset rather than
    // failing the whole boot — it's a cosmetic hint, not a security control.
    APP_ENV: z
      .string()
      .optional()
      .transform((v) => {
        const s = v?.trim().toLowerCase();
        return s === "development" || s === "test" || s === "production" ? s : undefined;
      }),

    // ── Feature flags — boot-time defaults; runtime source of truth is the
    //    site_toggles table (admin-editable). ────────────────────────────────
    FEATURE_SIGNUP_ENABLED: boolFromString(true),
    FEATURE_LOGIN_ENABLED: boolFromString(true),
    FEATURE_STRIPE_PAYMENTS_ENABLED: boolFromString(false),
    FEATURE_PAYPAL_PAYMENTS_ENABLED: boolFromString(false),
    FEATURE_BANK_TRANSFER_ENABLED: boolFromString(false),
    FEATURE_MAINTENANCE_MODE: boolFromString(false),

    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  })
  .superRefine((value, ctx) => {
    if (!value.AUTH_SECRET && !value.NEXTAUTH_SECRET) {
      ctx.addIssue({
        code: "custom",
        path: ["AUTH_SECRET"],
        message:
          "Set AUTH_SECRET (preferred) or NEXTAUTH_SECRET. Generate one with: npx auth secret",
      });
    }
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const lines = parsed.error.issues
    .map((issue) => `  • ${issue.path.join(".") || "(root)"}: ${issue.message}`)
    .join("\n");
  console.error(`\n❌ Invalid environment configuration:\n${lines}\n`);
  throw new Error(
    "Invalid environment configuration — see the error above. Copy .env.example to .env and fill in the required values.",
  );
}

const envData = parsed.data;

export const env = {
  ...envData,
  /** Resolved app environment: APP_ENV takes precedence over NODE_ENV. */
  APP_ENV: envData.APP_ENV ?? envData.NODE_ENV,
  /** Unified auth secret regardless of which variable name was used. */
  AUTH_SECRET: (envData.AUTH_SECRET ?? envData.NEXTAUTH_SECRET) as string,
  isProd: envData.NODE_ENV === "production",
  isDev: envData.NODE_ENV === "development",
} as const;

export type Env = typeof env;