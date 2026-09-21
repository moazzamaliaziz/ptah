# Ptah Tours — Admin CMS Completion Pass (Design Spec)

> **Date:** 2026-09-20 · **Status:** proposed, awaiting review
> **Base:** Phases 0–6 complete + audited (see `..\..\..\..\HANDOFF.md`).
> This spec adds **6 net-new subsystems + 2 verification passes** so that
> tours, cities, media, branding, social links, and floating widgets are all
> managed from the admin panel — **no code edits for routine content changes.**

---

## 1. Locked decisions (from the kickoff Q&A)

| # | Decision | Rationale |
|---|---|---|
| D1 | **Media stored in MySQL** (WordPress-style library, upload+manage in admin) | User directive; fits Hostinger Business (persistent DB, possibly-ephemeral app FS) + white-label portability. Bytes in a split blob table, served via a cached `/api/media/<id>` route that `next/image` optimizes. |
| D2 | **Continuous full pass** | Build all 6 subsystems in dependency order, report per subsystem, keep tsc/lint/build green throughout. No stop-for-approval between subsystems. |
| D3 | **Tour extras as flexible JSON fields** | `faqs`, `travelNotes`, `ctaLabel`, `ctaHref` on `Tour` — matches existing `inclusions/exclusions/gallery` pattern. One migration. |
| D4 | **Granular RBAC capabilities** | `catalog.*`, `media.*`, `branding.*`, `widgets.*` — matches the existing capability matrix + multi-tenant goal. |

**Verified environment facts driving the design** (from reconnaissance):
- No settings/branding abstraction exists today — `SiteSetting` is greenfield.
- Logo is a pure inline SVG wordmark in `SiteLogo.tsx`; favicon is a physical `src/app/favicon.ico`; socials are a hardcoded array in `content/landing.ts:826-834`.
- `WHATSAPP`/`TRIPADVISOR` integrations store **API credentials, not click-to-chat destinations** → floating widgets are a **separate presentational model**.
- `--z-chat: 2147483640` token exists but is **unused** — reserved slot for the widget cluster (above header, below dialogs/cookie-sheet).
- `Icon.tsx` has **no** phone/whatsapp/star icons — must add.
- `next/image` optimizes same-origin extensionless `/api/media/<id>` with **zero config**; CSP `img-src 'self'` already allows it; external `<a href>` widget links need **no CSP change**.
- Admin convention: RSC page (`requireCapability`) → `server-only` service → `useActionState` client editor → Server Action (re-`requireCapability` → validate → mutate → `writeAudit` → `revalidatePath`). No component kit — use `admin.css` classes. No cache wrapper — route ISR + `revalidatePath`; `toggles.ts` globalThis 10s cache is the hot-read template.

---

## 2. Approaches considered (and why this one)

- **Media on local disk** (rejected): simplest for a fixed VPS, but files aren't in the DB, break on ephemeral FS, and don't match the user's explicit "store in database like WordPress" directive.
- **External CDN/S3** (rejected): scales, but adds a cloud dependency + credentials + network hop, unjustified at ~10k/day.
- **Media bytes in MySQL, split metadata/blob** (chosen): satisfies D1, single `mysqldump` backup captures everything, survives redeploys, and the metadata/blob split keeps library listings blob-free. Prisma `Bytes @db.LongBlob` maps cleanly through `@prisma/adapter-mariadb` (confirmed against current Prisma docs).

---

## 3. Subsystem 1 — Foundations (media + settings + capabilities)

**Everything else depends on this. Built first.**

### 3.1 Data model

```prisma
model MediaAsset {
  id        String   @id @default(uuid()) @db.Char(36)
  filename  String   @db.VarChar(255)      // original name (display only)
  mimeType  String   @db.VarChar(100)      // allowlist: webp|png|jpeg|gif|svg+xml|x-icon
  byteSize  Int
  width     Int?                            // parsed from header when cheap
  height    Int?
  checksum  String   @db.Char(64)           // sha256 hex of bytes — ETag + dedupe
  altText   String?  @db.VarChar(512)
  folder    String   @default("general") @db.VarChar(64) // tours|destinations|branding|favicon|general
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  blob      MediaBlob?
  @@index([folder, createdAt])
  @@index([checksum])
  @@map("media_assets")
}

model MediaBlob {
  mediaId String     @id @db.Char(36)
  bytes   Bytes      @db.LongBlob
  media   MediaAsset @relation(fields: [mediaId], references: [id], onDelete: Cascade)
  @@map("media_blobs")
}

model SiteSetting {
  key       String   @id @db.VarChar(100)  // dotted: branding.siteName, contact.phone, ...
  value     String   @db.Text              // JSON-encoded; zod-validated on read
  updatedAt DateTime @updatedAt
  @@map("site_settings")
}
```

The metadata/blob split means the media-library grid (`MediaAsset.findMany`) **never** loads image bytes; only the serving route selects `MediaBlob.bytes`.

### 3.2 Upload pipeline (security-critical)

- Server Action receives `FormData` with a `File`. **`next.config.ts` needs `serverActions.bodySizeLimit: "10mb"`** (default is 1 MB — a real, noted config change; upload is gated by `media.manage` so only staff hit it).
- Validation, in order: (1) MIME in allowlist; (2) **magic-byte sniff** of the buffer (PNG `89504E47`, JPEG `FFD8FF`, `RIFF…WEBP`, GIF, SVG `<?xml`/`<svg`) and **reject on declared-vs-actual mismatch**; (3) size cap (8 MB raster / 512 KB SVG); (4) cheap header parse for width/height (PNG/JPEG/WebP offsets; null otherwise).
- **SVG sanitization:** strip `<script>`, `on*` handlers, and external refs before storage; serve with `X-Content-Type-Options: nosniff` + a restrictive response CSP; rendered only via `<img>` (never inlined as active markup). Raster preferred for favicon.
- Random UUID id; `checksum` enables dedupe (reuse an existing asset with the same hash).

### 3.3 Serving route — `src/app/api/media/[id]/route.ts`

GET → select `{mimeType, checksum}` + `blob.bytes` → respond with `Content-Type`, `Cache-Control: public, max-age=31536000, immutable` (id is immutable), `ETag: "<checksum>"`, and `304` on `If-None-Match`. Extensionless id → passes the proxy, gets CSP (harmless for image bytes). Missing row → 404. No traversal risk (uuid PK lookup, not a path). `sha256Hex` gets a `Buffer` overload for the ETag.

### 3.4 Read layer — `src/server/settings.ts`

Mirrors `toggles.ts` exactly: `globalThis` cache, `CACHE_TTL_MS = 10_000`, fail-safe try/catch returning **typed defaults from `content/landing.ts` `siteMeta`/`footerContent`** on any DB error, `invalidateSettingsCache()` called by the write helper. zod-validated per key.

### 3.5 Capabilities — `src/server/auth/capabilities.ts`

```
catalog.view  → SUPER_ADMIN, ADMIN, EDITOR, SUPPORT
catalog.edit  → SUPER_ADMIN, ADMIN, EDITOR
media.view    → SUPER_ADMIN, ADMIN, EDITOR, SUPPORT
media.manage  → SUPER_ADMIN, ADMIN, EDITOR
branding.view → SUPER_ADMIN, ADMIN
branding.edit → SUPER_ADMIN, ADMIN
widgets.view  → SUPER_ADMIN, ADMIN
widgets.edit  → SUPER_ADMIN, ADMIN
```

### 3.6 Admin UI

- `/admin/media` — WP-style library grid (thumbnails via `/api/media/<id>`, folder filter, upload, edit alt-text, delete-with-usage-guard).
- **`<MediaPicker>`** client component — "Select or upload" modal returning a `mediaId` + preview URL. Reused by tours, destinations, branding, widgets. This is the keystone reusable unit.

---

## 4. Subsystem 2 — Catalog CRUD (tours + destinations)

### 4.1 Schema additions to `Tour`
```prisma
faqs        Json?   // [{ q: string, a: string }]
travelNotes Json?   // string[]
ctaLabel    String? @db.VarChar(120)
ctaHref     String? @db.VarChar(512)   // validated via safeUrl
```
Migration `add_tour_content_fields`. Surfaced in `catalog.ts` `TourDetail` + rendered on `/tours/[slug]` (hidden when empty).

### 4.2 Admin service — `src/server/admin/catalog-admin.ts` (`server-only`)
- **Tours:** list (all statuses incl. DRAFT/ARCHIVED), getForEdit(id), create, update, publish/unpublish, **delete-guard** (block hard delete when any departure has bookings → force Archive), itinerary CRUD+reorder, departure CRUD (create/edit/close/cancel; **never delete a departure with bookings** — schema `onDelete: Restrict` enforces), destination-link management + `sortOrder`.
- **Destinations:** list, get, create, update, delete-guard (warn/block when tours are linked).
- All money integer `*Cents` + `currency`. Slug auto-generated + uniqueness-checked. zod schemas in `catalog-admin-schema.ts`; `safeUrl` for `ctaHref`. Returns discriminated `SaveResult`.

### 4.3 Admin routes
`/admin/tours` (list) · `/admin/tours/new` · `/admin/tours/[id]` (sectioned editor: basics · media picker for hero+gallery · itinerary · departures · inclusions/exclusions/faqs/notes · SEO · CTA) · `/admin/destinations` (+ `/new`, `/[id]`). Save → `revalidatePath` the tour, `/tours`, `/cities`, `/`.

### 4.4 Frontend
Reads already DB-backed (Phase 3 + image task). New/edited content appears via `force-dynamic`/`revalidate`. **All 12 existing tours + 6 destinations stay intact** — this is additive; seed unchanged.

---

## 5. Subsystem 3 — Global branding

Consume `SiteSetting` (fallback to current hardcoded values everywhere):

| Setting key | Surfaces at | Mechanism |
|---|---|---|
| `branding.logoMediaId` | `SiteLogo.tsx` (header) | render `<img /api/media/id>` else inline SVG |
| `branding.footerLogoMediaId` | `SiteFooter.tsx` | same |
| `branding.faviconMediaId` | root `layout.tsx` | **static `metadata` → async `generateMetadata()`** emitting `icons` (overrides physical `favicon.ico`) |
| `branding.siteName` / `tagline` / `legalName` | title/OG/JSON-LD, footer, sr-only h1 | `generateMetadata()` + settings reads |
| `branding.socials` (JSON `[{iconKey,url,label}]`) | `SiteFooter.tsx` socials | replaces hardcoded array; `iconKey`∈`Icon.tsx`; `url` via `safeUrl` |
| `contact.phone`/`email`/`whatsapp` | footer + widgets | settings |
| `seo.ogImageMediaId` / `seo.themeColor` | OG image, `viewport.themeColor` | `generateMetadata()`/`viewport` |

**Cleanup:** delete the dead `components/layout/{Footer,Header}.tsx` (zero importers); resolve the `privacy@ptah-tours.com` vs `hello@ptahtours.com` inconsistency (point legal pages at `contact.email`).

Admin: `/admin/branding` — one form (logo/footer-logo/favicon/OG via MediaPicker, name/tagline/legal text, social repeater, contact fields, theme color).

---

## 6. Subsystem 4 — Floating widgets

### 6.1 Model
```prisma
enum WidgetType { PHONE  WHATSAPP  TRIPADVISOR  EMAIL  MESSENGER  CUSTOM }
model FloatingWidget {
  id          String     @id @default(uuid()) @db.Char(36)
  type        WidgetType
  enabled     Boolean    @default(true)
  label       String     @db.VarChar(120)   // aria-label / tooltip
  href        String     @db.VarChar(512)    // tel: | mailto: | https://wa.me/.. | https://..
  iconKey     String     @db.VarChar(40)
  bgColor     String?    @db.VarChar(32)     // brand token/hex; default per type
  showDesktop Boolean    @default(true)
  showMobile  Boolean    @default(true)
  position    String     @default("bottom-right") @db.VarChar(20) // bottom-right|bottom-left
  sortOrder   Int        @default(0)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  @@index([enabled, sortOrder])
  @@map("floating_widgets")
}
```

### 6.2 Read + render
- `src/server/widgets.ts` — 10s globalThis cache, fail-safe (mirror `toggles.ts`).
- `FloatingWidgets.tsx` (RSC, mounted in `(site)/layout.tsx`) reads enabled widgets → renders `FloatingWidgetCluster` (client island: stacked buttons, optional expand/collapse, **reduced-motion honored**).
- **Stacking:** vertical stack at `bottom-right` and/or `bottom-left`, `z-index: var(--z-chat)` (below cookie-sheet so the banner wins when open — correct UX). Spacing tokens; no overlap with header (header hides on scroll; widgets are bottom-anchored).
- **Mobile/desktop:** `showMobile`/`showDesktop` → CSS `@media` gate; ≥44px touch targets.
- Each widget: `<a href>` — `tel:`/`mailto:` same tab, `https:` → `target="_blank" rel="noopener noreferrer"`. **href scheme allowlist (`https`,`tel`,`mailto`); block `javascript:`/`data:`.** WhatsApp number normalized → `https://wa.me/<digits>`.
- Add icons to `Icon.tsx`: `phone`, `whatsapp`, `star` (Tripadvisor), `chat`.

### 6.3 Admin
`/admin/widgets` (list · enable · reorder) · `/new` · `/[id]`. **Explicitly test with 3+ active simultaneously** (Phone + WhatsApp + Tripadvisor + a CUSTOM) — desktop + mobile, no overlap, all reachable.

---

## 7. Subsystem 5 — Frontend ↔ admin integration verification

A written matrix: **every** admin-editable setting → frontend surface → verification method. Then live browser proof for a representative sample: edit in admin → save → confirm DB row → confirm frontend at **desktop (1440) + mobile (375)**. No setting may exist in admin that doesn't move the live site. Evidence recorded in the audit report.

---

## 8. Subsystem 6 — 3-pass UI/UX audit + backlog + final checklist

- **Pass 1 (visual/layout):** typography, spacing, alignment, colors, buttons, cards, images, icons, header/footer/nav, CTAs, tour/city pages, forms, widgets.
- **Pass 2 (responsive/interaction):** 375/744/1440 — layouts, menus, forms, image sizing, widgets, touch targets, sticky elements, overflow, no horizontal scroll, text wrap, CTA positioning.
- **Pass 3 (polish/consistency):** inconsistent spacing/type, broken layouts, wrong icons, missing images, weak hierarchy, duplicate elements, broken links, console errors, a11y, widget conflicts, unfinished sections.
- **Carried backlog:** `/search` results route (chips already point there — 404 today); alert-banner slot (optional, only if trivial).
- **Fix every finding**, re-verify. Then run the user's **Section 8 final checklist** and write `audit\phase-7-admin-cms-audit.md`.

---

## 9. Verification gates (every subsystem)

`npx tsc --noEmit` → `npx eslint` → `npx next build` (all green, MySQL up first per the P2039 race note). UI subsystems additionally: `next start` + browser MCP (command-mode preview, `preview_eval` for ground truth) at 1440 + 375, zero console errors. Migrations via `prisma migrate dev` then `prisma generate` **before** any seed/app read of new fields.

---

## 10. Security summary

- Uploads: MIME allowlist + magic-byte sniff + size cap + SVG sanitization; declared-vs-actual mismatch rejected; UUID names; `media.manage`-gated.
- `serverActions.bodySizeLimit: 10mb` — widened DoS surface mitigated by staff-only capability gate.
- Media route: public read (images are public), uuid lookup (no traversal), immutable cache; SVG served `nosniff` + restrictive CSP.
- Widget `href` + branding social/CTA URLs: scheme allowlist / `safeUrl` (block `javascript:`/`data:`).
- No secrets in `SiteSetting` (those stay in the AES vault); audit records **field names, not values**; every new admin action re-checks its capability + `writeAudit`.
- Additive only — no changes to booking/payment/auth/webhook code; all existing content preserved.

---

## 11. Out of scope (YAGNI)

External CDN/S3 · Redis rate-limiter · multi-tour cart · Arabic/RTL rendering (structure only) · in-browser image cropping (store as-is; `next/image` handles responsive) · any change to Stripe/booking/auth internals.

---

## 12. Build order

1. Foundations (media + settings + capabilities + MediaPicker) →
2. Catalog CRUD →
3. Branding →
4. Floating widgets →
5. Integration verification →
6. 3-pass audit + backlog + final checklist.

Report after each. `HANDOFF.md` updated at the end as the new SSOT (this becomes "Phase 7").
