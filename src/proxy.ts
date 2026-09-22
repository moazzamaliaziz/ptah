/**
 * Request-boundary security proxy — Next.js 16 EDITION.
 *
 * ⚠ Next 16 convention change (node_modules/next/dist/docs/01-app/03-api-reference/
 *   03-file-conventions/proxy.md): `middleware.ts` is DEPRECATED. The file must be
 *   named `proxy.ts` and export a function named `proxy`. Runtime is Node.js
 *   (edge is not configurable here).
 *
 * What it does on every matched request:
 *   1. Content-Security-Policy — selected PER PATH:
 *      • STRICT NONCE MODE on the sensitive surfaces (`/admin/*` staff panel and
 *        `/booking/*` checkout funnel): a per-request cryptographic nonce is
 *        generated, injected via the `x-nonce` request header (Server Components
 *        read it with `await headers()`; Next also parses the nonce out of the
 *        `Content-Security-Policy` request header to nonce its own framework +
 *        `<Script>` tags), and the CSP is `script-src 'self' 'nonce-<n>'
 *        'strict-dynamic'` — NO 'unsafe-inline' for scripts. These routes are
 *        already dynamically rendered (auth/session + per-request reads), so the
 *        per-request nonce does not conflict with any static/ISR caching.
 *      • COMPATIBLE MODE everywhere else (marketing / catalog): a nonce-free
 *        policy with `script-src 'self' 'unsafe-inline'` — the documented
 *        requirement for Next.js inline bootstrap scripts on STATICALLY
 *        generated pages (docs: guides/content-security-policy — nonces force
 *        "all pages must be dynamically rendered"). This preserves their ISR
 *        caching.
 *      • OVERRIDE: SECURITY_CSP_NONCE=1 forces the strict nonce policy on EVERY
 *        path (backward compatible with the previous global gate). Enable only
 *        together with dynamic rendering on every route.
 *   2. Clickjacking / sniffing / referrer hardening headers (always on).
 *   3. HSTS in production only (2-year, includeSubDomains, preload) — sending
 *      it over plain-http localhost is meaningless.
 *
 * What it deliberately does NOT do yet: per-request DB lookups (auth, feature
 * toggles) — those belong to the auth phase and are enforced in Server
 * Actions / route handlers, per the docs' guidance that proxy logic is a
 * network boundary, not the app.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { integrationCspOrigins } from "@/lib/integration-csp";

/* Env override: force the strict nonce policy on EVERY matched path (backward
 * compatible with the previous global gate). With it unset, the strict policy
 * is selected per-path for the sensitive surfaces (see STRICT_SURFACE_PREFIXES
 * / the selection in `proxy`). */
const STRICT_NONCE_FORCED = process.env.SECURITY_CSP_NONCE === "1";
const IS_PROD = process.env.NODE_ENV === "production";

/* Sensitive surfaces that always receive the strict nonce-based CSP: the staff
 * admin panel and the booking/checkout funnel. Both are dynamically rendered,
 * so per-request nonces here never disable static/ISR caching (which only the
 * compatible-policy marketing/catalog pages rely on). */
const STRICT_SURFACE_PREFIXES = ["/admin", "/booking"] as const;

function isStrictSurface(pathname: string): boolean {
  return STRICT_SURFACE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/* Trusted origin for the internal site-state poll. Pinned to the configured
 * public URL so a spoofed `Host:` header cannot steer this server-side fetch at
 * an attacker origin and poison the process-global maintenance/CSP cache. The
 * proxy may not import the server-only env module, so read NEXT_PUBLIC_* (which
 * Next inlines) directly; fall back to the request origin only when unset. */
const CONFIGURED_ORIGIN: string | null = (() => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
})();

/* ── Site-state poll (Q13 MAINTENANCE_MODE + Phase-5 CSP integrations) ───────
 * The proxy is the network boundary. It does NOT import Prisma; instead it
 * reads the internal /api/internal/site-state route with a 10s stale-while-
 * revalidate cache, so the refresh never blocks a request and there is at most
 * one poll per 10s per worker. Two signals come back:
 *   - `maintenance` — enforced for the public site (admin + APIs exempt).
 *     Fail-OPEN: until the first successful poll (and on error) it is `false`,
 *     i.e. the site stays up.
 *   - `cspIntegrations` — which injectable vendors are enabled, so the CSP is
 *     widened for exactly those origins. Fail-CLOSED: until the first poll (and
 *     on error) it is `[]`, i.e. the tightest CSP.
 * The recursive hit on /api/internal/site-state is safe: `refreshing` is set
 * synchronously before the fetch, so the nested proxy pass returns the cache
 * instead of triggering a second poll. */
const SITE_STATE_TTL_MS = 10_000;
let siteStateCache: {
  maintenance: boolean;
  cspIntegrations: string[];
  expires: number;
  refreshing: boolean;
} = { maintenance: false, cspIntegrations: [], expires: 0, refreshing: false };

function getSiteState(origin: string): { maintenance: boolean; cspIntegrations: string[] } {
  const now = Date.now();
  if (now < siteStateCache.expires) {
    return { maintenance: siteStateCache.maintenance, cspIntegrations: siteStateCache.cspIntegrations };
  }
  if (!siteStateCache.refreshing) {
    siteStateCache.refreshing = true;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 1500);
    fetch(`${origin}/api/internal/site-state`, { cache: "no-store", signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bad status"))))
      .then((d: { maintenance?: unknown; cspIntegrations?: unknown }) => {
        siteStateCache = {
          maintenance: d.maintenance === true,
          cspIntegrations: Array.isArray(d.cspIntegrations)
            ? d.cspIntegrations.filter((k): k is string => typeof k === "string")
            : [],
          expires: Date.now() + SITE_STATE_TTL_MS,
          refreshing: false,
        };
      })
      .catch(() => {
        // Back off for a full TTL; keep the last known values.
        siteStateCache = { ...siteStateCache, expires: Date.now() + SITE_STATE_TTL_MS, refreshing: false };
      })
      .finally(() => clearTimeout(timer));
  }
  return { maintenance: siteStateCache.maintenance, cspIntegrations: siteStateCache.cspIntegrations };
}

function setSecurityHeaders(response: NextResponse, csp: string): void {
  response.headers.set("Content-Security-Policy", csp);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=(), browsing-topics=()",
  );
  response.headers.set("X-DNS-Prefetch-Control", "on");
  if (IS_PROD) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload",
    );
  }
}

function buildCsp(nonce: string | null, cspIntegrations: string[]): string {
  // Origins for the injectable integrations that are currently enabled — added
  // to exactly the directives each vendor needs, so a disabled vendor never
  // widens the policy. (See src/lib/integration-csp.ts.)
  const ext = integrationCspOrigins(cspIntegrations);
  const join = (base: string, extra: string[]) =>
    extra.length > 0 ? `${base} ${extra.join(" ")}` : base;

  const scriptSrc = nonce
    ? // Strict nonce mode: dynamically-rendered pages only.
      `'self' 'nonce-${nonce}' 'strict-dynamic'${IS_PROD ? "" : " 'unsafe-eval'"}`
    : // Default: compatible with statically generated pages (Next inline
      // bootstrap scripts require 'unsafe-inline' here).
      `'self' 'unsafe-inline'${IS_PROD ? "" : " 'unsafe-eval'"}`;

  const directives: string[] = [
    `default-src 'self'`,
    join(`script-src ${scriptSrc}`, ext.script),
    // Tailwind utilities ship as generated CSS; React inline style attributes
    // and next/font need 'unsafe-inline' for styles.
    `style-src 'self' 'unsafe-inline'`,
    // next/image serves optimized images same-origin (/_next/image);
    // data:/blob: cover placeholders & client-generated previews.
    // Remote placeholders (picsum.photos) are fetched server-side by the
    // optimizer, so they do NOT need to be whitelisted here.
    join(`img-src 'self' blob: data:`, ext.img),
    join(`font-src 'self' data:`, ext.font),
    join(`connect-src 'self'`, ext.connect),
    // Stripe.js frames (payments phase). Harmless until enabled.
    join(`frame-src 'self' https://js.stripe.com https://hooks.stripe.com`, ext.frame),
    `worker-src 'self'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
  ];

  if (IS_PROD) {
    // Only meaningful over HTTPS; on plain-http localhost it does nothing but
    // confuse local testing.
    directives.push("upgrade-insecure-requests");
  }

  return directives.join("; ");
}

export function proxy(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  // Per-path policy selection: emit the strict nonce policy on the sensitive
  // surfaces (admin + booking), or everywhere when the env override is set;
  // otherwise the compatible (nonce-free) policy. A nonce is generated only
  // when the strict policy applies, so compatible pages stay nonce-free and
  // cacheable.
  const useStrictCsp = STRICT_NONCE_FORCED || isStrictSurface(pathname);
  const nonce = useStrictCsp
    ? Buffer.from(crypto.randomUUID()).toString("base64")
    : null;

  // Poll the internal endpoint on the CONFIGURED origin in production (so a
  // spoofed `Host:` cannot steer the server-side fetch and poison the cache);
  // in dev, or when no public URL is set, use the request origin so the poll
  // reaches the local server on whatever port it bound. A failed poll degrades
  // safely anyway (maintenance fail-open, CSP fail-closed).
  const pollOrigin = IS_PROD && CONFIGURED_ORIGIN ? CONFIGURED_ORIGIN : origin;
  const { maintenance, cspIntegrations } = getSiteState(pollOrigin);
  const csp = buildCsp(nonce, cspIntegrations);

  // Forward the CSP (and nonce, when in strict mode) to the renderer via request
  // headers — Next.js parses the request-side CSP to nonce its own framework +
  // <Script> tags, and code can read `x-nonce` with `await headers()` (per the
  // CSP guide). Built before the maintenance branch so the rewritten
  // /maintenance render receives the same nonce plumbing under a strict policy.
  const requestHeaders = new Headers(request.headers);
  if (nonce) requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", csp);

  // Maintenance gate: public pages only. /admin (staff), /api (incl. the state
  // endpoint the poll itself hits) and /maintenance are always exempt.
  const publicPath =
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/api") &&
    pathname !== "/maintenance";
  if (publicPath && maintenance) {
    const res = NextResponse.rewrite(new URL("/maintenance", request.url), {
      request: { headers: requestHeaders },
    });
    setSecurityHeaders(res, csp);
    return res;
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  setSecurityHeaders(response, csp);
  return response;
}

export const config = {
  matcher: [
    /*
     * Everything except static assets & framework internals. Phrased as two
     * entries so prefetch requests still receive security headers when the
     * destination page renders dynamically.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|txt|xml)$).*)",
  ],
};