/**
 * Server boot hook (Next 16 file convention: instrumentation.ts, register()).
 *
 * Responsibilities at boot:
 *   1. Fail-fast environment validation — importing src/lib/env.ts throws with
 *      a readable message when required variables are missing/invalid, so a
 *      misconfigured deployment never starts serving traffic.
 *   2. Log a boot summary: environment + which integrations are currently
 *      ENABLED in the registry (lazy DB read; a missing DB at boot logs a
 *      warning but does not prevent startup, so migrations/seeds can run).
 */
export async function register(): Promise<void> {
  // Only run on the Node.js server (instrumentation also loads for edge builds).
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  // 1. Environment validation (throws on invalid config — intentional).
  const { env } = await import("@/lib/env");
  const { logger } = await import("@/lib/logger");

  logger.info("ptah-tours boot", {
    appEnv: env.APP_ENV,
    nodeEnv: env.NODE_ENV,
    siteUrl: env.NEXT_PUBLIC_SITE_URL,
    features: {
      signup: env.FEATURE_SIGNUP_ENABLED,
      login: env.FEATURE_LOGIN_ENABLED,
      stripePayments: env.FEATURE_STRIPE_PAYMENTS_ENABLED,
      maintenanceMode: env.FEATURE_MAINTENANCE_MODE,
    },
  });

  // 2. Integration registry snapshot (lazy, best-effort).
  try {
    const { db } = await import("@/lib/db");
    const enabled = await db.integration.findMany({
      where: { enabled: true },
      select: { key: true },
    });
    logger.info("integration registry loaded", {
      enabled: enabled.map((row) => row.key),
    });
  } catch {
    logger.warn(
      "integration registry unreadable (database offline or migrations pending) — continuing boot",
    );
  }

  // 3. Admin bootstrap from env (ADMIN_EMAIL + ADMIN_PASSWORD/_HASH). No-op when
  //    unset; self-guards against a missing DB so it never blocks startup.
  const { syncAdminFromEnv } = await import("@/server/auth/admin-sync");
  await syncAdminFromEnv();
}

/**
 * Server-side error hook (Next 16 `onRequestError`, file convention). Fires for
 * every uncaught error in a Server Component, route handler, or server action.
 *
 * Phase 5: we forward to the structured logger with request context. This is
 * the seam where a production Sentry SDK would `captureException` — but the
 * `@sentry/nextjs` SDK is a BUILD-TIME integration (wraps next.config, uploads
 * source maps, needs the DSN at build), so it cannot be driven by the runtime
 * vault toggle the way the client Loader Script is. Client-side errors + RUM
 * ARE captured live via the toggle-driven Sentry loader in AnalyticsScripts.
 * Wiring the server SDK is a documented deploy-time upgrade (set SENTRY_DSN +
 * enable the build plugin); until then server errors are captured in the logs.
 */
export async function onRequestError(
  error: unknown,
  request: { path: string; method: string; headers: NodeJS.Dict<string | string[]> },
  context: {
    routerKind: "Pages Router" | "App Router";
    routePath: string;
    routeType: "render" | "route" | "action" | "proxy";
    renderSource?: string;
    revalidateReason?: "on-demand" | "stale";
  },
): Promise<void> {
  const { logger } = await import("@/lib/logger");
  logger.error("unhandled server error", {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    path: request.path,
    method: request.method,
    routerKind: context.routerKind,
    routePath: context.routePath,
    routeType: context.routeType,
  });
}