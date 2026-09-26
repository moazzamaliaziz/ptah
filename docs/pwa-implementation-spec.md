# PWA Implementation Spec — Ptah Tours

**Phase 2 output.** Principal-engineer consolidation of three Phase-1 research reports
(Agent 1 = PWA standards & browser behavior; Agent 2 = production architecture;
Agent 3 = read-only codebase audit). This is the **approval gate**: no code is written
until you sign off on this spec.

- **Stack:** Next.js 16.3.5 (App Router, Turbopack), React 19.2.8, TypeScript, TiDB/Prisma 7, Vercel, HTTPS.
- **Site shape:** 6 locales `/{locale}/…` (en default, ar RTL), multiple root layouts, custom `ptah_session` cookie auth, strict/nonce CSP built in `src/proxy.ts`.
- **Goal:** add a lightweight, production-grade PWA (installable + offline-capable) **without** touching SEO, i18n, auth, API, or the DB build step.

---

## 0. Executive summary + decisions needing your sign-off

**Recommended approach: hand-rolled static `public/sw.js` + Next 16 `app/manifest.ts` + Metadata-API icons. No new dependencies. No change to the `build` script.**

Why not Serwist (Agent 2's default pick): Serwist under Turbopack requires 3 new dev deps
(`serwist`, `@serwist/turbopack`, `esbuild`), a new `serwist build` step appended to the
**DB-touching** `build` script, and a `<SerwistProvider>`. Your standing rules are "no
unnecessary deps / lightweight / don't rewrite unrelated architecture," and the
Turbopack-Serwist path is the newest, least-proven part of that library. Our actual caching
needs are small (the hard part is what to **not** cache), and Next already emits
content-hashed immutable assets. A ~120-line hand-rolled SW covers it with zero deps and
zero build-script risk. **Serwist remains the fallback if you'd rather use a framework.**

**Decisions I need a yes/no or a pick on before Phase 3:**

- **D1 — Service worker: hand-rolled `public/sw.js` (recommended) or Serwist?**
- **D2 — Icon source art.** The repo has an admin-managed favicon/logo but **no square PWA icons** (192/512/maskable). I need one high-res **square** source (ideally ≥512×512 PNG/SVG with padding room). If you don't have one, I can (a) derive from the existing branding logo (quality depends on its resolution), or (b) generate a clean monogram icon at build time via Next's `ImageResponse`. Which?
- **D3 — Install UI in scope for v1?** You listed "custom install UI" as required, so it's IN by default (a small localized install button + iOS "Add to Home Screen" hint). Confirm, or defer to optional.
- **D4 — Web Push is OUT of v1** (needs backend + VAPID + iOS add-to-home-screen). Confirm it stays optional.

**RESOLVED (user sign-off 2026-09-26):**
- **D1 = Serwist framework** (not hand-rolled). **As built:** Serwist ships a runtime
  library (`serwist`) + a manifest generator (`@serwist/build`) but no bundler of its own.
  Under Next 16 Turbopack the classic `@serwist/next` webpack plugin never runs, and
  `@serwist/turbopack` only serves the worker under a `/serwist/` scope (not root). So the
  worker is built by `scripts/build-sw.mjs`: `@serwist/build`'s **`getManifest`** hashes the
  static precache assets (icons + `/offline`), then **`esbuild`** bundles `src/sw.ts` into a
  single classic IIFE worker at **`public/sw.js` (root scope `/`)**, injecting the precache
  list via an esbuild `banner` as `self.__SW_MANIFEST`. `src/sw.ts` uses Serwist's
  `Serwist`/`NetworkOnly`/`CacheFirst`/`StaleWhileRevalidate` runtime. Registration is a
  small custom client component (**not** `<SerwistProvider>`). Dev deps: `serwist`,
  `@serwist/build`, `esbuild` (**no** `@serwist/turbopack`, **no** `@serwist/next`).
- **D2 = Generate a monogram** icon at build time — **as built via `sharp`** (not
  `ImageResponse`): `scripts/gen-pwa-icons.mjs` rasterizes a font-free geometric SVG monogram
  (gold pyramid+sun on navy) to committed static PNGs (192/512/maskable-512 + apple-touch-180).
  No external art needed.
- **D3 = Install UI included in v1.**
- **D4 = Web Push stays OUT of v1** (optional/later).

> Note: because D1 = Serwist, the `build` script gains a **`node scripts/build-sw.mjs`** step
> (appended after `next build`; the DB-touching prefix is untouched) and `.gitignore` excludes
> the generated **`public/sw.js`** + `public/sw.js.map`. All other constraints (never-cache
> list, CSP, SEO/i18n/auth untouched, no-store SW headers, update & offline UX, branch/approval
> gates) are unchanged from the sections below.

---

## 1. Current State (from the codebase audit)

- **No PWA today:** no manifest, no service worker, no PWA icons. `public/` has only starter SVGs + WebP photos. `src/app/favicon.ico` exists; **no** `app/icon.*` or `app/apple-icon.*`, no 192/512/maskable PNGs.
- **Request boundary is `src/proxy.ts`** (Next 16 renamed `middleware.ts`; Node runtime): locale negotiation + 307 redirect, per-path CSP, always-on security headers, maintenance rewrite. Its matcher **excludes** `_next/static`, `_next/image`, `favicon.ico`, and image/txt/xml extensions — but **not** `.js`/`.json`/`.webmanifest`, so `/sw.js` and the manifest pass through and receive CSP + security headers.
- **CSP (built in `src/proxy.ts`):** strict nonce (`script-src 'self' 'nonce-…' 'strict-dynamic'`) on `/admin` + `/booking`; compatible (`'self' 'unsafe-inline'`) elsewhere. Already has `worker-src 'self'`. **Missing `manifest-src`** (currently falls back to `default-src 'self'`, which happens to allow it — we'll make it explicit).
- **Multiple root layouts, no `src/app/layout.tsx`:** public root `src/app/[lang]/layout.tsx` (has `generateMetadata`, `generateViewport` returning **`themeColor` from a SiteSetting**, `metadataBase`); public chrome `src/app/[lang]/(site)/layout.tsx`; admin root `src/app/admin/layout.tsx`; maintenance root `src/app/maintenance/layout.tsx`.
- **Auth:** custom revocable session, cookie **`ptah_session`** (HttpOnly, SameSite=Lax). Any response carrying it is per-user.
- **SEO surface to preserve:** `src/app/sitemap.ts` (hreflang for 6 locales + x-default) and `src/app/robots.ts` (disallows `/admin`, `/api/`, `/account`, auth pages, `/search`, `/booking/`). It does **not** disallow `/_next/`, `/sw.js`, or the manifest — good, they stay reachable.
- **Build script (sensitive):** `prisma generate && node scripts/db-deploy.mjs && next build` — hits the live DB. **We will not modify it.**
- **Theme color is already admin-managed** via SiteSetting → `generateViewport`. The manifest will read the same setting so the two never diverge.
- **Never-cacheable routes (exact list):** `/admin/**`; `/api/**` except `GET /api/media/**`; `/{locale}/booking/**`, `/{locale}/account/**`, `/{locale}/manage/**`, `/{locale}/track-booking`; auth pages `/{locale}/{login,register,forgot-password,reset-password,verify-email}`; `/search`; `/maintenance`; any response bearing `ptah_session`; and the bare non-localized paths that trigger the 307 locale redirect.

## 2. Target PWA Architecture

```
Browser
 ├─ <link rel="manifest"> ......... auto-injected on EVERY root layout by app/manifest.ts
 ├─ <link rel="apple-touch-icon"> . from app/apple-icon.png (Metadata API)
 ├─ <meta name="theme-color">  .... existing generateViewport + light/dark metas
 └─ Service Worker (scope "/") .... registered ONLY from the public [lang] root,
        controls the whole origin but its fetch handler:
          • network-only  → /api (except GET /api/media), /admin, auth, account,
                             booking, manage, track-booking, search, maintenance,
                             any RSC/personalized/ptah_session response
          • cache-first   → /_next/static/** (content-hashed, immutable), self-hosted fonts
          • SWR           → GET /api/media/** and public images
          • network-first → HTML/RSC navigations → fallback to precached /offline
          • precache      → /offline + icon PNGs (+ manifest), versioned, purged on activate
          • no default skipWaiting; update via user-prompted "reload"
          • navigation preload enabled
```

**Control vs registration:** the SW is *registered* only from public pages, but once active at
scope `/` it *controls* `/admin` and `/api` too — that is exactly why the fetch handler must
force those network-only. Registration location cannot substitute for fetch-handler exclusions.

---

## 3. Required Changes (every file / config)

Phase 3 begins by reading `node_modules/next/dist/docs/` for manifest, metadata, and
file-convention guidance (per AGENTS.md — this Next has breaking changes vs training data).

**CREATE** *(annotated with as-built deltas from Phase 3)*

1. `src/app/manifest.ts` — returns `MetadataRoute.Manifest`. Reads `getSettings()` for
   `name`/`short_name`/`description`/`theme_color`/`background_color` (never throws — static
   brand fallbacks on DB error). Fields: stable **`id: "/"`**, `start_url: "/"`, `scope: "/"`,
   `display: "standalone"`, `orientation: "any"`, `lang: "en"`, `dir: "ltr"`,
   `categories: ["travel","lifestyle"]`, 3 `icons` (192 any, 512 any, maskable-512 maskable).
   **As built:** `display_override` was **dropped** (kept to only stable, install-critical
   members per the cross-browser guidance). Next auto-injects the `<link>` on all roots.
2. **Icons — `scripts/gen-pwa-icons.mjs`** (sharp) generates committed PNGs under
   `public/icons/`: `icon-192.png`, `icon-512.png`, `maskable-512.png` (art inside the safe
   circle), and `apple-touch-180.png`. **As built:** the apple icon is a `/public` PNG wired via
   `Metadata.icons.apple` — **not** an `src/app/apple-icon.png` file-convention route. No
   `src/app/icon.png`; the existing `favicon.ico` still serves the tab. No `monochrome` icon (v1).
3. **Service worker source `src/sw.ts` + build `scripts/build-sw.mjs`** — Serwist runtime
   (`NetworkOnly` navigations + `/offline` fallback via `fallbacks`; `CacheFirst` `/_next/static`;
   `StaleWhileRevalidate` images incl. `GET /api/media`; `skipWaiting:false`, `clientsClaim:true`,
   `navigationPreload:true`) bundled by esbuild → **`public/sw.js`** (root scope, git-ignored
   build artifact). `message` listener activates on `SKIP_WAITING`. **Replaces** the spec's
   original "hand-rolled `public/sw.js`" wording (see D1 as-built).
4. `src/components/pwa/ServiceWorkerManager.tsx` — `"use client"`; **merges the spec's separate
   ServiceWorkerRegistrar + UpdatePrompt into one component**. Registers `/sw.js` with
   `updateViaCache:"none"` (prod only, `"serviceWorker" in navigator` guard), shows a localized
   "new version" toast for **genuine** updates only, posts `SKIP_WAITING` on accept, and reloads
   on `controllerchange` **only after an explicit accept** (an `acceptedRef` guard suppresses the
   first-install `clientsClaim` auto-claim). External bundled script → CSP-safe (no inline/nonce).
   Mounted in `src/app/[lang]/layout.tsx`.
5. `src/components/pwa/InstallPrompt.tsx` — `"use client"`; stashes `beforeinstallprompt`, shows a
   localized install card, iOS-Safari "Add to Home Screen" hint, `appinstalled` +
   `display-mode: standalone`/`navigator.standalone` self-hide, `localStorage` dismissal. **As
   built:** mounted in `src/app/[lang]/layout.tsx` (the public root), not `(site)/layout.tsx`.
6. `src/app/offline/page.tsx` + `src/app/offline/layout.tsx` — **self-contained static** root
   layout (own `<html>`, inline CSS, `dynamic = "force-static"`), no DB/settings/chrome, generic
   "You're offline" + precached logo, `robots: { index:false, follow:false }`. SW navigation fallback.
7. **`src/i18n/pwa.ts`** — install/update/offline strings for all 6 locales via a small dedicated
   module (`PwaStrings`, `getPwaStrings(locale)`), **not** the main page-dictionary system.

**MODIFY (small, surgical)** *(annotated with as-built deltas)*

8. `src/proxy.ts` — two tightly-scoped edits: (a) add **`manifest-src 'self'`** to the CSP
   builder (`worker-src 'self'` already present); (b) add `/offline` to `isLocaleExempt` so the
   SW has a **stable, non-redirecting** precache URL (same treatment as `/maintenance`). No change
   to locale logic, security headers, or the matcher.
9. `next.config.mjs` — add a `headers()` block (there was none) for **`/sw.js`** only. **As built:**
   `Cache-Control: no-cache, no-store, must-revalidate` **only** — Content-Type is left to the
   static server (it already serves `.js` as `application/javascript`) and the CSP is left to
   `src/proxy.ts` (whose matcher also matches `/sw.js`), **deliberately avoiding a duplicate
   Content-Type/CSP header**. No other keys touched.
10. `src/app/[lang]/layout.tsx` — mount **`<ServiceWorkerManager />` + `<InstallPrompt />`** (both,
    localized via `getPwaStrings(lang)`). Add `Metadata.icons.apple` → `/icons/apple-touch-180.png`
    and `appleWebApp` (`capable`, `title`, `statusBarStyle`). **As built:** kept the **single**
    admin-managed `themeColor` (via the existing `generateViewport`) — **no** light/dark
    `<meta name="theme-color" media>` array was added. No change to
    `generateMetadata`/`metadataBase`/OG/robots logic.
11. `.gitignore` — **as built:** added **`/public/sw.js`** + `/public/sw.js.map` (Serwist path:
    the worker is a generated build artifact; the committed inputs are `src/sw.ts` +
    `scripts/build-sw.mjs`). *(The `(site)/layout.tsx` mount in the original plan was not needed —
    both PWA components mount in the `[lang]` root instead.)*
12. `package.json` — **as built:** `build` gains a trailing `&& node scripts/build-sw.mjs`; added
    `build:sw` and `gen:pwa-icons` scripts; dev deps `serwist` + `@serwist/build` + `esbuild`, dep
    `sharp`. (The DB-touching build prefix `prisma generate && node scripts/db-deploy.mjs &&
    next build` is unchanged.)

**NOT touched:** `build` script, `scripts/db-deploy.mjs`, `sitemap.ts`, `robots.ts`, auth,
`/api/**` handlers, image config, analytics, fonts, `favicon.ico`, DB schema, Prisma.

## 4. Optional Improvements (separated — not in v1)

- **Web Push** (iOS 16.4+ via Push API; others too) — needs a backend, VAPID keys, a
  subscriptions table, and (iOS) prior add-to-home-screen + user-gesture permission. Real feature, own project.
- **`screenshots`** (wide + narrow) for Chromium's **richer install UI** — needs 1 wide + 1
  narrow real capture; I can grab these from the Vercel preview if you want the nicer install card.
- **`shortcuts`** jump-list ("Browse tours", "My bookings", "Contact") — cheap, localizable; easy add if wanted.
- **`monochrome` icon** for OS notification badges — only useful once Push exists.
- **`getInstalledRelatedApps()`** de-dupe — experimental/Chromium-only; skipped in favor of
  `display-mode`/`navigator.standalone` detection.

---

## 5. Security

- **No cross-user leakage:** the SW never caches responses carrying `ptah_session`, never
  caches `/admin`, `/api` (except `GET /api/media`), auth/account/booking/manage, or RSC
  payloads. HTML navigations are network-first, so a logged-in user is never served a cached
  logged-out shell (or vice-versa). This is the single biggest correctness risk and the fetch
  handler is written deny-by-default: only an explicit allowlist (static assets, media, public
  navigations) is cacheable; everything else is network-only.
- **CSP:** explicit `manifest-src 'self'` + existing `worker-src 'self'` (per MDN, `worker-src`
  falls back to `child-src → default-src`, *not* `script-src`). Registrar is an external
  bundled script, so the strict nonce CSP on `/admin`+`/booking` is satisfied without an inline
  script. `connect-src 'self'` already covers same-origin SW fetches.
- **SW script headers:** `no-store` so a compromised/buggy SW can be replaced fast (feeds §11 rollback).
- **Scope discipline:** one SW at `/`; no `Service-Worker-Allowed` header games; no caching of `Set-Cookie`.
- **Offline page** carries no personalized data and makes no authenticated calls.

## 6. Performance

- **Precache is tiny** (offline page + a few icons) → negligible install cost; no precaching of
  hashed JS chunks (avoids the stale-chunk/white-screen trap — new build = new hashed URLs =
  natural cache miss).
- **Navigation preload** hides SW-boot latency on navigations.
- **Cache-first for `/_next/static/**` and fonts** → instant repeat loads, less bandwidth; old
  versions purged on `activate` by cache-version bump.
- **SWR for media** → fast images without blocking on the network.
- No impact on Core Web Vitals for first visit (SW installs after load, registrar is deferred);
  repeat visits improve. No render-blocking added.

## 7. SEO

- **Nothing in the SEO surface changes.** `sitemap.ts`, `robots.ts`, hreflang, canonical, OG,
  `generateMetadata`, `metadataBase` untouched.
- `/offline` is `robots: noindex` and is **not** added to the sitemap → won't compete in search.
- Manifest/SW/icons are additive `<link>`/`<meta>` tags; they don't alter existing metadata.
- HTML stays network-first, so crawlers and users always get fresh, server-rendered, localized
  markup — no cached-stale-content SEO risk.
- Confirm post-deploy that `robots.txt` still doesn't block `/_next/`, `/sw.js`, or the manifest (it doesn't today).

## 8. Cross-Browser

- **Chrome/Edge desktop + Android:** full install (`beforeinstallprompt`, WebAPK on Android),
  richer install UI if we add screenshots. Update prompt + offline verified here.
- **Safari iOS/iPadOS:** no `beforeinstallprompt` → our **iOS hint** covers Add-to-Home-Screen;
  `apple-icon.png` + `appleWebApp` metadata drive the icon/splash/status bar. Note iOS storage
  eviction + the 7-day cap for *non-installed* sites (installed/home-screen apps are exempt).
- **Safari macOS:** "Add to Dock" works with our manifest.
- **Firefox desktop:** no manifest install (expected; not a bug). Android: shortcut only.
- **Samsung Internet:** WebAPK-style install on Samsung devices.
- Experimental members (`display_override` beyond standalone/minimal-ui, `*_localized`,
  `color_scheme_dark`) are **deliberately avoided** so there's nothing to fall back from.

---

## 9. Testing Plan

**Local reality (from prior sessions):** a full `next build` times out locally *and* hits the
live DB; `preview_*` tools can't exercise auth-gated admin. So local = static/lightweight checks;
the **Vercel preview deploy is the real QA environment**, and a few checks need your device.

- **Local (me):** `npm run typecheck` (tsc), lint; SSR/curl of `/manifest.webmanifest`,
  `/sw.js`, `/offline` for status, MIME, and headers; JSON-validate the manifest fields;
  confirm the CSP header now contains `manifest-src`.
- **Vercel preview (me, via fetch + the browser preview tools where reachable):** manifest
  installability fields present; `/sw.js` served `no-store` + JS MIME; `/offline` static & noindex;
  no console errors on the home page; security headers intact.
- **Vercel preview (you, on real devices — the parts I can't do):** Chrome DevTools →
  Application: Manifest valid + maskable safe-area OK + "installable"; Service Workers register
  at scope `/`; install on Chrome desktop + Android (confirm WebAPK) + Edge; **real iPhone Safari
  Add-to-Home-Screen** (icon, splash, standalone, status bar); **offline** via airplane mode
  (offline page for navigations, cached assets load, `/api` fails gracefully, **no** stale
  personalized content); **update flow** (deploy again → waiting SW → "reload" prompt → new
  version, no white screen); **multi-tab** safety; **auth safety** (log in, cache, log out,
  navigate — never see another session's content; `/admin` never from cache); per-locale `/en`
  and `/ar` (RTL) install + `id` identical (no duplicate installs).
- **Note:** Lighthouse **removed its dedicated PWA category (~v12)** — we use the DevTools
  Application/Manifest installability checks as the source of truth, not a "PWA score."

This is Phase 4 (2 parallel QA agents: Functional; Security/Perf/SEO) → Phase 5 fix/retest loop.

## 10. Deployment Plan

1. All work on a **new branch** (e.g. `feat/pwa`), never `main`. Preview auto-deploys on Vercel.
2. Phase 4/5 QA runs against that preview.
3. Phase 6: final principal-engineer verification checklist (research ✓, architecture ✓,
   implementation ✓, functional QA ✓, security QA ✓, perf ✓, SEO ✓, no critical issues, approval).
4. Phase 7: review the final diff (no unrelated changes, no secrets/debug/temp files), then a
   clean PWA-only commit (**no `Co-Authored-By`/"Generated with" trailers**, per your standing
   rule), push the branch.
5. **PAUSE for your explicit OK before merge to `main`** (merging triggers the Vercel prod
   deploy). After merge: live verification on `https://ptah-five.vercel.app/` — manifest URL,
   SW registration + scope, HTTPS, icons, `start_url`/`scope`, offline, cache, update behavior,
   no broken routes / console errors / SEO regressions.

---

## 11. Rollback Plan

A bad service worker is uniquely dangerous: it can keep serving a broken cached shell to
returning visitors *even after* you fix the server. Mitigations, in order of blast radius:

1. **Design already limits it:** no default `skipWaiting`, HTML is network-first, precache holds
   only the offline page + icons. A returning visitor gets fresh server HTML, not a cached app.
2. **Kill-switch SW:** if something goes wrong, replace `public/sw.js` with a "self-destruct"
   worker that on `install`/`activate` calls `caches.keys()` → delete all, then
   `self.registration.unregister()` and reloads clients. Because the SW script is served
   `no-store` and browsers re-check it on navigation / within 24h, clients pick it up and clean
   themselves. Ship it as a hotfix branch → merge.
3. **Vercel instant rollback:** promote the previous deployment; combined with the kill-switch
   SW this fully reverts.
4. **CSP/manifest** changes are trivially revertible (one-line each).

The kill-switch SW is written and kept ready during Phase 3 so it's on hand, not authored under pressure.

## CEO review notes — claims verified / flagged

- **Serwist vs hand-rolled:** decided hand-rolled on your "no unnecessary deps / lightweight"
  rules + Turbopack-Serwist immaturity + the DB-touching build script. (Reversible: D1.)
- **Auto-install-prompt fetch-handler requirement (Agent 1 flagged uncertain for 2026):** moot —
  we ship a fetch handler regardless (needed for offline).
- **Lighthouse PWA category removed (~v12):** confirmed the testing plan doesn't depend on a PWA score.
- **`app/manifest.ts` auto-injects `<link rel="manifest">` on all roots:** relied upon; Phase 3
  verifies against `node_modules/next/dist/docs/` first (AGENTS.md).
- **iOS EU/DMA web-app volatility (Agent 1, secondary sources):** out of our control; noted as a
  risk, not a blocker.
- **Per-locale manifest:** rejected — manifest is fetched without credentials (cookie locale
  can't apply) and per-locale `id`s would cause duplicate installs. Single neutral manifest.
- **Theme color:** reuse the existing admin SiteSetting instead of hardcoding, so PWA theme and
  site theme never diverge.

## Execution flow after approval

Phase 3 implement (branch `feat/pwa`, read Next docs first) → Phase 4 two parallel QA agents →
Phase 5 fix/retest → Phase 6 final checklist → Phase 7 clean commit + push preview → **pause for
your OK** → merge to `main` → live verification. No merge/prod deploy without your explicit sign-off.

