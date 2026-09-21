## 🗄️ Locked Production Database Schema (Prisma ORM v7 Syntax)

> **⚠ SUPERSEDED (Phase 0 audit).** Do NOT place the sketch below into
> `prisma/schema.prisma` — the authoritative, intentionally-evolved schema is
> already implemented in `prisma/schema.prisma`. Key deltas, all deliberate:
> money is stored as integer `*Cents` + `currency CHAR(3)` (never Decimal),
> `SiteToggle` replaces `SystemToggle`, `ContentSection` replaces
> `LandingCMSSection`, `Booking.userId` is nullable guest-checkout with
> `onDelete: SetNull`, and `Session` is a revocable app-level registry
> (hashed token), not the Auth.js adapter shape. See README.md ADR log.

You must place this exact schema into `prisma/schema.prisma`. It utilizes MySQL 8 native types, optimized indexes, explicit relational boundaries, and global platform state management toggles:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  SUPER_ADMIN
  ADMIN
  EDITOR
  SUPPORT
  USER
}

enum BookingStatus {
  PENDING
  CONFIRMED
  CANCELLED
  REFUNDED
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique @db.VarChar(255)
  passwordHash  String    @db.VarChar(255)
  firstName     String    @db.VarChar(100)
  lastName      String    @db.VarChar(100)
  role          Role      @default(USER)
  isActive      Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  bookings      Booking[]
  sessions      Session[]

  @@index([email])
  @@map("users")
}

model Session {
  id           String   @id @default(uuid())
  userId       String
  token        String   @unique @db.VarChar(512)
  expiresAt    DateTime
  createdAt    DateTime @default(now())
  
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([token])
  @@map("sessions")
}

model Tour {
  id           String             @id @default(uuid())
  title        String             @db.VarChar(255)
  slug         String             @unique @db.VarChar(255)
  description  String             @db.Text
  durationDays Int
  coverImage   String             @db.VarChar(512)
  isActive     Boolean            @default(true)
  createdAt    DateTime           @default(now())
  updatedAt    DateTime           @updatedAt
  
  departures   TourDeparture[]
  sections     LandingCMSSection[] @relation("TourCMS")

  @@index([slug])
  @@map("tours")
}

model TourDeparture {
  id            String        @id @default(uuid())
  tourId        String
  departureDate DateTime      @db.Date
  priceUSD      Decimal       @db.Decimal(10, 2)
  maxCapacity   Int
  bookedCount   Int           @default(0)
  createdAt     DateTime      @default(now())
  updatedAt     DateTime      @updatedAt
  
  tour          Tour          @relation(fields: [tourId], references: [id], onDelete: Cascade)
  bookings      Booking[]

  @@index([tourId])
  @@index([departureDate])
  @@map("tour_departures")
}

model Booking {
  id              String        @id @default(uuid())
  userId          String
  departureId     String
  status          BookingStatus @default(PENDING)
  totalAmountUSD  Decimal       @db.Decimal(10, 2)
  stripeIntentId  String?       @unique @db.VarChar(255)
  passengerNames  Json          // Stores array of passenger meta details securely
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  
  user            User          @relation(fields: [userId], references: [id], onDelete: Restrict)
  departure       TourDeparture @relation(fields: [departureId], references: [id], onDelete: Restrict)

  @@index([userId])
  @@index([departureId])
  @@map("bookings")
}

model SystemToggle {
  key         String   @id @db.VarChar(100)
  value       Boolean  @default(true)
  description String?  @db.VarChar(255)
  updatedAt   DateTime @updatedAt

  @@map("system_toggles")
}

model LandingCMSSection {
  id         String   @id @default(uuid())
  sectionKey String   @unique @db.VarChar(100) // e.g., "hero_slides", "destination_tabs"
  contentPayload Json     // Hierarchical content layout data 
  updatedAt  DateTime @updatedAt
  associatedTourId String?
  
  tour       Tour?    @relation("TourCMS", fields: [associatedTourId], references: [id], onDelete: SetNull)

  @@map("landing_cms_sections")
}
```

---

## 🔒 Security Headers & Request Filtering Framework (Next.js Middleware)
To safeguard endpoints, generate the comprehensive file at **`src/proxy.ts`** (Next.js 16 renamed the `middleware.ts` convention to `proxy.ts` with a named `proxy` export — the sketch below shows the legacy shape and its CSP `upgrade-insecure-requests`/`block-all-mixed-content` details differ from the implemented version; the implemented, authoritative version is `src/proxy.ts`). It forces **Strict HTTPS (HSTS)**, blocks UI redressings, and provisions a **Dynamic per-request CSP Nonce** ensuring third-party payment scripts run cleanly without exposing vulnerabilities:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 1. Generate cryptographic per-request Nonce for strict CSP hydration
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  // 2. Comprehensive Content Security Policy Architecture
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://stripe.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://unsplash.com;
    font-src 'self' data:;
    connect-src 'self' https://stripe.com https://vercel-insights.com;
    frame-src 'self' https://stripe.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // 3. Absolute Security Infrastructure Header Set Injection
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), camera=(), microphone=(), interest-cohort=()');
  
  // Strict Transport Security (HSTS) - Enforce 2-Year Lifetime with Subdomains & Preload mapping
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  return response;
}

export const config = {
  matcher: [
    /*
     * Intercept all operational request pathways except static physical file assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)\$).*)',
  ],
};
```

 Technical Resource Matrix for Your AI AgentNext.js strict CSP Dynamic Interception Configuration: Next.js Official CSP GuidelinesPrisma Schema Best Practices and Model Design Patterns: Prisma Engine Performance OptimizationStrict Application-Level Cryptography Headers: OWASP Secure Headers Integration Protocol  {https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html}

 https://www.prisma.io/docs/orm/more/best-practices, 
 https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy




 ## 🔌 Dynamic Integration Management System (Admin Panel architecture)
To handle the top 20 integrations modularly, you must treat integrations as pluggable features driven by database configuration. Do not hardcode scripts directly into layouts.

1. **Database-Driven Strategy:** 
   Utilize a polymorphic or key-value storage pattern via the `SystemToggle` table or an extended configuration table to store integration settings securely:
   ```prisma
   // Concept to extend integration metadata
   model IntegrationRegistry {
     id           String   @id @default(uuid())
     name         String   @unique // e.g., "GOOGLE_ANALYTICS_4", "STRIPE", "SENTRY"
     isEnabled    Boolean  @default(false)
     configKeys   Json     // Encrypted or structured keys: { "MEASUREMENT_ID": "G-XXXXX" }
     updatedAt    DateTime @updatedAt
     
     @@map("integration_registry")
   }
   ```
2. **Conditional Injection:** Use wrapper components or centralized hooks that check if an integration toggle is set to `true` and if credentials exist before rendering the script tag or invoking server hooks.
3. **Admin UI Layout:** Build a single dedicated dashboard route (`/admin/integrations`) featuring isolated card elements for each third-party tool. Every integration must have an **On/Off dynamic switch**, an execution status visual indicator, and custom form input fields that obscure sensitive keys.

---

## 🏢 Enterprise Core Multi-Tenant Architecture & Component Reusability
This platform is engineered to serve as a **White-Label / Core Base Engine** for deployment across multiple tourism and travel websites in the future. Architectural requirements for reusability:

1. **Design System and Tailwind CSS 4 Separation:**
   - Abstract all core brand attributes (colors, typography scales, border radii) using native CSS variables or global design tokens within your theme directory.
   - Design visual elements using semantic token variations (e.g., `bg-primary`, `text-heading`) rather than hardcoded tailwind color strings (`bg-amber-700`). Switching sites must be as seamless as swapping a root configuration file or injecting a different theme class.
2. **Highly Decoupled Components (`src/components/core/`):**
   - **Presentational vs. Behavioral Splitting:** Keep presentation entirely decoupled from data fetch logic. UI components (such as `TourCard`, `HeroSlider`, and `TabSwitcher`) must accept clean typescript interfaces and primitive data items.
   - **Slots Pattern:** Leverage React's structural layout patterns (children props and rendering slots) heavily inside complex blocks like `Modal`, `DataGrid`, or `AdminFormWrapper` so they can easily display differing styles across other web architectures.
3. **Feature Isolation Strategy:** Group domain logic distinctly inside domain-specific subfolders (`src/features/tours`, `src/features/bookings`, `src/features/cms`). This isolation ensures that full functional features can be extracted or deactivated without causing regressions in core app files.

---

## 💎 Production Code Architecture & Engineering Best Practices
Maintain expert human authorship. Your generated code must strictly observe these professional coding standards:

1. **Strict Typescript Boundaries:** 
   - Ban the use of `any` across the codebase. Define type parameters explicitly, use automated utility types (`Pick`, `Omit`, `Partial`) for code reuse, and use structural discriminate union objects for error handling or tracking execution states.
2. **Asynchronous Operations & Performance Routing:**
   - Execute parallel non-blocking requests via `Promise.all()` inside Server Components whenever multiple database calls (such as fetching dynamic slider configurations and tour card catalogs simultaneously) do not rely on each other's parameters.
   - Isolate route execution by declaring explicit dynamic behaviors (`export const dynamic = 'force-dynamic'`) on dashboard items, while utilizing incremental static regeneration hooks or edge-caching on core public marketing itineraries.
3. **Clean Code Mechanics:**
   - Structure single-responsibility helper operations into dedicated micro-utility files (`src/utils`).
   - Group clean error state tracking directly inside localized `error.tsx` sub-files, while applying structured layout loading skeletons using `loading.tsx` to maximize visual layout speed metrics.

---

## 🎨 Phase 1a — Landing design system, global chrome & content SSOT

Durable architectural facts (delivery report lives in the Phase-1a task thread):

### Brand token system (multi-tenant rule above applies)
- `src/styles/tokens.css` is the only place brand values live. Header comment
  carries the full **spec-role → Ptah-hex mapping** (plum→`--color-nile #1a2340`,
  coral→`--color-gold #d9822b`, rust-hover→`--color-rust #9a5c1b`, ink `#262626`
  unchanged, purple→`--color-sand #a07a2a`, lavender→`--color-papyrus #f7f2e3`).
  Components consume semantic aliases (`--color-primary`, `--base-hover-color`);
  retheming = swapping one file. Type ramp is stepped utilities (`text-hero`,
  `text-section-h2`, …) — zero `clamp()` on type, per the reference.

### Global chrome (design.md §2 sections of the agent spec)
- `src/components/site/SiteHeader.tsx` (RSC wrapper) owns
  `SiteHeaderChrome.tsx` (client island): 42px quick-links bar, 102px primary
  bar, 3 mega-menus on the 22-col `--container-22-padding` grid with bezier
  open/close, 73px mobile bar + full-viewport curtain (the two curtain beziers
  verbatim), matchMedia markup swap at 744px (no CSS-hidden duplicates),
  hide-on-scroll backdrop (§2.4 contract), `data-theme="on-dark|on-light"`.
- `SiteFooter.tsx` (RSC), `CookieBanner.tsx` + `CookieManageButton.tsx`
  (bridge: `ptah:open-cookie-preferences` CustomEvent), `SkipLink.tsx`,
  `MultiCropImage.tsx` (aspect-box + breakpoint-switched variants; `priority`
  maps to Next-16 `preload`), `SiteLogo.tsx`, islands `BookmarkPill.tsx`
  and `SearchDialog.tsx`. Icons: `src/components/ui/Icon.tsx` (inline SVG only).

### Content SSOT
- `src/content/landing.ts` — typed hero slides, 5 Get-Inspired tabs, Plan CTA,
  50/50 pair, KBYG, Tour Types (the reference "accommodation" slot), 5 stories,
  nav + footer. Phase 2 swaps reads to `ContentSection` rows; prop shapes must
  not change. Asset provenance documented in its header comment; files live in
  `public/assets/{hero,destinations,itineraries,activities,stories,cta,tour-types}/`.

### Reduced motion (design.md §4.6 MUST)
- CSS clamp in `globals.css` for `prefers-reduced-motion: reduce` AND
  `:root[data-reduced-motion="true"]`; JS hook
  `src/hooks/use-prefers-reduced-motion.ts` mirrors both signals.

### Wishlist scaffold
- `src/lib/wishlist.ts` — versioned localStorage adapter + CustomEvent same-tab
  broadcast + cross-tab `storage` listener. All reads through the adapter;
  Phase-2 account sync happens inside this file only.

---

## 🔄 Continuation

This build is mid-flight. For phase status, verified evidence, environment
conventions and the ordered TODO list (Phase 1 audit → Phase 6 final
validation), read `..\HANDOFF.md` (workspace root, next to `design.md`).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
