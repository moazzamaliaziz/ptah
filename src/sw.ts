/// <reference lib="esnext" />
/// <reference lib="webworker" />

// Ptah Tours service worker (spec §2/§3). Built with Serwist (D1) via
// `scripts/build-sw.mjs` (esbuild bundle + @serwist/build manifest injection)
// into public/sw.js, root scope "/". This file is the *source*; it is never
// shipped as-is.
//
// Design goals (from the spec's "must NOT break" list):
//   • Never cache HTML, API, auth, or personalised responses. Only immutable
//     build assets (/_next/static) and images are cached at runtime.
//   • Navigations are always network (NetworkOnly) so crawlers and users never
//     get stale HTML; on network failure they fall back to the precached
//     /offline page.
//   • skipWaiting is OFF — a new worker waits until the user accepts the update
//     (ServiceWorkerManager posts SKIP_WAITING), avoiding surprise reloads.

import {
  CacheableResponsePlugin,
  CacheFirst,
  ExpirationPlugin,
  NetworkOnly,
  Serwist,
  StaleWhileRevalidate,
  type PrecacheEntry,
  type SerwistGlobalConfig,
  type SerwistPlugin,
} from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    // Injected at build time by scripts/build-sw.mjs (icons + /offline).
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const DAY = 24 * 60 * 60;

// Defense-in-depth for the runtime image cache. Cross-user leakage is already
// prevented upstream (navigations are network-only and the allowlist below only
// admits immutable build output + public images), but this response-level guard
// refuses to persist anything the origin marked `private` or `no-store`. So if a
// per-user image path is ever added later, it can't silently populate a cache
// that is shared across sessions on the same device.
const denyPrivateResponses: SerwistPlugin = {
  cacheWillUpdate: async ({ response }) => {
    const cacheControl = response.headers.get("cache-control")?.toLowerCase() ?? "";
    if (cacheControl.includes("private") || cacheControl.includes("no-store")) return null;
    return response;
  },
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: { cleanupOutdatedCaches: true },
  // Wait for an explicit user gesture before activating a new worker.
  skipWaiting: false,
  clientsClaim: true,
  navigationPreload: true,
  disableDevLogs: true,
  runtimeCaching: [
    // 1) Navigations: always hit the network (no stale HTML, SEO-safe). The
    //    `fallbacks` option below attaches the /offline fallback to this route,
    //    so a failed navigation (offline) renders the precached offline page.
    //    Admin/auth/account/booking/etc. are covered here too — network-only,
    //    never cached.
    {
      matcher: ({ request }) => request.mode === "navigate",
      handler: new NetworkOnly(),
    },
    // 2) Immutable Next build output (hashed filenames) — safe to cache hard.
    {
      matcher: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith("/_next/static/"),
      handler: new CacheFirst({
        cacheName: "next-static",
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 30 * DAY }),
        ],
      }),
    },
    // 3) Images: same-origin image responses, including the cached media route
    //    GET /api/media/<id>. Every other /api/* path is excluded so dynamic and
    //    authenticated API responses are never cached. The `/api/media/` prefix
    //    is matched with its trailing slash so sibling paths (e.g. a future
    //    /api/mediahub) can't slip into the image cache.
    {
      matcher: ({ url, request, sameOrigin }) =>
        sameOrigin &&
        request.destination === "image" &&
        (!url.pathname.startsWith("/api/") || url.pathname.startsWith("/api/media/")),
      handler: new StaleWhileRevalidate({
        cacheName: "images",
        plugins: [
          new CacheableResponsePlugin({ statuses: [0, 200] }),
          denyPrivateResponses,
          new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 30 * DAY }),
        ],
      }),
    },
  ],
  // Precached at build time via additionalPrecacheEntries in build-sw.mjs.
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher: ({ request }) => request.destination === "document",
      },
    ],
  },
});

// Manual update handoff: the page (ServiceWorkerManager) posts SKIP_WAITING when
// the user accepts the update; only then does the waiting worker activate.
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

serwist.addEventListeners();
