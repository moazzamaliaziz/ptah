# Phase 7 — Admin CMS Completion: Verification & Audit

**Date:** 2026-09-21
**Scope:** Subsystems 1–6 of the admin-CMS completion pass (spec:
`docs/superpowers/specs/2026-09-20-admin-cms-completion-design.md`).
**Goal:** a production-ready site where major content, branding, media, tours,
cities, social links, and floating widgets are managed from the admin panel
without code changes.

**Verification methods used in this document:**
- **BUILD** — `npx tsc --noEmit` (exit 0) → `npx eslint` (clean) → `next build`
  (exit 0, route registered) per subsystem.
- **PROBE** — a `scripts/phase7-*.mts` probe run against the live MySQL.
- **SSR** — `curl` against `next start` on `http://localhost:3000`, asserting the
  rendered HTML.
- **VISUAL (pending user)** — pixel/responsive confirmation at 375 / 744 / 1440
  in a real browser. A headless browser was not available in this environment;
  these items are called out for the user to confirm on localhost. Nothing below
  is claimed as visually verified that was not.

---

## 1. Subsystem status

| # | Subsystem | tsc | eslint | build | probe | live (SSR) |
|---|-----------|-----|--------|-------|-------|-----------|
| 1 | Foundations (media in MySQL + settings + MediaPicker) | 0 | clean | exit 0 | 17/17 | — |
| 2 | Catalog CRUD (tours + destinations) | 0 | clean | exit 0 | 12/12 | — |
| 3 | Global branding | 0 | clean | exit 0 | 7/7 | ✓ |
| 4 | Floating widgets | 0 | clean | exit 0 | 8/8 | ✓ |
| 5 | Frontend ↔ admin verification | — | — | — | — | ✓ (matrix §2) |
| 6 | 3-pass UI/UX audit + backlog | — | — | — | — | §3 |

---

## 2. Subsystem 5 — Frontend ↔ admin integration matrix

Every admin-editable setting → the live surface it drives → how it was verified.
Rule: **no setting exists in admin that does not move the live site.**

### Branding (`/admin/branding`, `SiteSetting` store)

| Setting | Live surface | Mechanism | Verification |
|---|---|---|---|
| `branding.siteName` | `<title>`, OG/twitter, footer aria, header/footer logo alt | `generateMetadata()` + `getSettings()` | SSR: `<title>Ptah Tours — …</title>` |
| `branding.tagline` | default `<title>` suffix, OG description context | `generateMetadata()` | SSR: title contains tagline |
| `branding.legalName` | available to legal surfaces via settings | `getSettings()` | BUILD (typed read) |
| `branding.logoMediaId` | header logo (3 slots) | `SiteHeader`→`SiteHeaderChrome` `logoSrc`; `<img>` else SVG | code + SSR (SVG fallback renders when unset) |
| `branding.footerLogoMediaId` | footer legal bar brand mark | `SiteFooter`; `<img>` else SVG | SSR: `footer-legal__brand` present |
| `branding.faviconMediaId` | `<link rel=icon>` (overrides physical favicon.ico) | `generateMetadata().icons` | code (emitted only when set) |
| `branding.socials` | footer social row | `SiteFooter` maps settings array → `<Icon>` | SSR: `social-disc` present |
| `branding.copyrightLine` | footer legal bar (`{year}` substituted) | `SiteFooter` | code + SSR |
| `contact.email` | privacy-policy contact mailto | `getSetting("contact.email")` | SSR: `mailto:hello@ptahtours.com` (typo fixed) |
| `contact.phone` / `contact.whatsapp` | floating widgets (S4) | admin enters as widget href | SSR (widgets, below) |
| `seo.ogImageMediaId` | OG/twitter image | `generateMetadata()` | code (falls back to hero when unset) |
| `seo.themeColor` | `<meta name=theme-color>` | `generateViewport()` | SSR: `content="#1a2340"` |

### Floating widgets (`/admin/widgets`, `FloatingWidget` table)

| Field | Live surface | Verification |
|---|---|---|
| enabled / type / label / href / iconKey | bottom-anchored cluster on every public page | SSR: 4 seed widgets render with correct `tel:` / `wa.me` / `https` / `mailto:` hrefs + labels |
| bgColor | pill background | code (inline style, hex-validated) |
| position (right/left) | which stack | SSR: both `fw-cluster--bottom-right` and `fw-cluster--bottom-left` render |
| showDesktop / showMobile | `@media` visibility gate at 744px | code + VISUAL (pending user at 375/1440) |
| sortOrder | stack order (lowest at bottom) | PROBE: ordered query asserts PHONE→WHATSAPP→TRIPADVISOR |

### Catalog (`/admin/tours`, `/admin/destinations`)

| Action | Live surface | Verification |
|---|---|---|
| create/update/publish tour | `/tours`, `/tours/[slug]` | BUILD (routes `ƒ`) + PROBE (D3 fields round-trip) |
| tour faqs / travelNotes / CTA (D3) | `/tours/[slug]` FAQ accordion + FAQPage JSON-LD + "Good to know" + sticky CTA | PROBE 12/12 |
| destination create/update | `/cities`, `/countries`, destination pages | BUILD |
| destination ↔ tour links | tour + destination cross-refs | PROBE (M:N link/unlink) |

### Media (`/admin/media`, `MediaAsset`/`MediaBlob`)

| Action | Live surface | Verification |
|---|---|---|
| upload image | `/api/media/[id]` (cached, ETag) → any MediaPicker slot | PROBE 17/17 (magic-byte sniff, SVG sanitize, dedupe, cascade) |

### Pre-existing (unchanged, still admin-driven)

| Area | Surface |
|---|---|
| Site toggles | SIGNUP / LOGIN / STRIPE / MAINTENANCE (proxy + auth) |
| Content (CMS) | landing `ContentSection` rows |
| Integrations | third-party credentials (AES vault) |

**Live evidence captured (SSR, `next start` @ localhost:3000, 2026-09-21):**
- `/` — `<title>Ptah Tours — Egypt, curated by the people who call it home</title>`,
  `theme-color #1a2340`, both widget stacks, all 4 seed widget hrefs + labels,
  footer social discs + brand mark.
- `/privacy-policy` — `mailto:hello@ptahtours.com` (legacy `privacy@ptah-tours.com` gone).
- `/admin/branding` + `/admin/widgets` → 307 (auth-gated); `/admin/login` → 200;
  `/search?term=nile` → 200. No server errors logged.

---

## 3. Subsystem 6 — UI/UX audit

### 3.1 Backlog items

- **`/search` results route** — RESOLVED. Route is implemented
  (`src/app/(site)/search/page.tsx`): GET form, `searchPublishedTours(term)`,
  `TourCard` grid, `robots: noindex`. The header search dialog `router.push`es
  and the popular-search chips link to `/search?term=…`. SSR: `200`.
- **Alert-banner slot** — not implemented (spec marked optional / only-if-trivial).
  Deferred; no regression.

### 3.2 Pass 1 — visual/layout (code review)

- Widgets reuse brand tokens (nile/gold/rust) via per-type presets; ≥52px pills
  (≥44px touch target); hover-expand label; `Icon.tsx` glyphs added for
  phone/whatsapp/star/chat.
- Footer socials + brand mark integrate into the existing `footer-legal` grid;
  fallback SVG wordmark sized via `.footer-legal__brand svg`.
- Header logo swap preserves the existing `.brand-logo` sizing; `<img>` variant
  constrained by `.brand-logo img` (height-matched, max-width capped).
- Admin editors reuse the established `.admin-*` component classes; branding
  form is sectioned (Identity / Logos / Socials / Contact / SEO); widget editor
  shows a live pill preview.

### 3.3 Pass 2 — responsive/interaction (partly pending user)

- Widget cluster: `@media (max-width:46.4375em)` hides `desktop-only`, tightens
  offsets; `@media (min-width:46.5em)` hides `mobile-only`; `@media (hover:none)`
  shows labels (no hover on touch). **VISUAL confirmation at 375/744/1440 pending
  user on localhost.**
- Reduced motion: both `prefers-reduced-motion` and
  `:root[data-reduced-motion="true"]` remove widget transitions.
- z-index: cluster at `--z-chat` (2147483640) sits **below** the cookie sheet
  (`--z-cookie-banner` 2147483646) so consent wins when open — correct UX.

### 3.4 Pass 3 — polish/consistency

- Dead `src/components/layout/Footer.tsx` deleted (0 importers). `NavDropdown.tsx`
  also has 0 importers but is outside the named cleanup scope — left in place.
- No horizontal-scroll risk introduced (widgets are `position:fixed`, do not
  affect document flow).
- No console errors in SSR logs. Client-side console at 375/1440 **pending user**.
- Security: every new admin action re-checks its capability + `writeAudit`
  (field names, not values); all editable hrefs (socials, widgets) pass the
  `SAFE_URL_RE` allowlist (blocks `javascript:`/`data:`/protocol-relative);
  no secrets in `SiteSetting`.

---

## 4. Final checklist

- [x] Major content (landing sections) — admin-managed (`ContentSection`).
- [x] Branding (name/tagline/legal/logo/footer-logo/favicon/theme) — admin-managed.
- [x] Media — uploaded + picked in admin, served from DB via `/api/media/[id]`.
- [x] Tours — full CRUD incl. itinerary, departures, FAQs, travel notes, CTA.
- [x] Cities/destinations — full CRUD + tour links.
- [x] Social links — admin-managed (`branding.socials`), render in footer.
- [x] Floating widgets — admin-managed, 3+ tested simultaneously (SSR + probe).
- [x] `/search` functional.
- [x] tsc / eslint / build green across all subsystems.
- [x] Security: capability gates + audit + URL allowlist + no secrets in settings.
- [ ] **VISUAL responsive pass at 375/744/1440 in a browser — for the user to
      confirm on localhost** (headless browser unavailable here).

---

## 5. How to review on localhost

Server: `next start` at `http://localhost:3000` (MySQL must be running).

- Public: `/` (widgets bottom-right + bottom-left, footer socials), `/tours`,
  `/tours/<slug>` (FAQ accordion + CTA), `/privacy-policy` (contact email),
  `/search?term=nile`.
- Admin (`/admin/login` first): `/admin/branding`, `/admin/widgets`,
  `/admin/tours`, `/admin/destinations`, `/admin/media`.
- Demo widgets were seeded via `scripts/seed-widgets.mts` (labels tagged
  `[seed]`); delete them from `/admin/widgets` or re-run the seed to reset.
