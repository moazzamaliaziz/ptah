# Ptah Tours

Tour-booking platform for **Ptah Tours** — Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4, with a MySQL 8 database via Prisma 7.

---

## Phase 0 — Foundations (this delivery)

Database schema, environment validation, security boundary, dev infrastructure, and the directory skeleton every later phase builds on. No public UI changes — the pre-existing marketing pages continue to run on their mock data until later phases swap in the database.

## Prerequisites

- Node.js ≥ 20.9 (developed on 24.x)
- Docker Desktop (for the local MySQL container)
- npm

## Setup (first run)

```powershell
# 1. Dependencies
npm install

# 2. Environment: copy the template, keep defaults for local dev
Copy-Item .env.example .env

# 3. Start MySQL 8 (Docker)
npm run db:up            # = docker compose up -d db
docker compose ps        # wait until ptah-tours-db is "healthy"

# 4. Create tables (requires the running DB)
npm run db:migrate       # = prisma migrate dev

# 5. Seed admin user, toggles, integrations, destinations, sample tours
npm run db:seed

# 6. Run
npm run dev              # http://localhost:3000
```

No database handy? `npm run dev` still serves the marketing pages; the boot log
will note that the integration registry is unreadable and continue. The
schema/auth-dependent features arrive in later phases.

Useful scripts:

| Command             | What it does                                             |
| ------------------- | -------------------------------------------------------- |
| `npm run db:generate` | Regenerate the Prisma client after editing the schema  |
| `npm run db:migrate`  | Create/apply a dev migration                           |
| `npm run db:seed`     | Idempotent seed (upserts)                              |
| `npm run db:studio`   | Prisma Studio browser UI                               |
| `npm run db:up` / `db:down` | Start/stop the MySQL container                   |
| `npm run typecheck`   | Strict `tsc --noEmit`                                   |

### Seed credentials (development only)

| Field    | Value                      |
| -------- | -------------------------- |
| Email    | `admin@ptahtours.local`    |
| Password | `ChangeMe!Dev2026`         |
| Role     | `SUPER_ADMIN`              |

Rotate immediately in any environment reachable by anyone else.

---

## Directory layout

```
prisma/
  schema.prisma          # Full platform schema (MySQL 8, InnoDB, utf8mb4)
  seed.ts                # Idempotent seeder (tsx)
prisma.config.ts         # Prisma 7 CLI config (datasource URL, seed command)
docker-compose.yml       # MySQL 8.4 (healthcheck + volume); Redis stub (later)
.env.example             # Documented env template — copy to .env
src/
  instrumentation.ts     # Boot hook: env validation + integration registry log
  proxy.ts               # Next 16 request proxy (security headers + CSP)
  app/
    (site)/              # Public marketing routes (skeleton; existing pages
                         #   migrate here in the landing-page phase)
    (auth)/              # Login/register/reset flows (auth phase)
    admin/               # Admin dashboard routes
    api/v1/              # Versioned API route handlers
  components/
    site/                # Public-facing components
    admin/               # Admin components
    ui/                  # Shared primitives (existing)
    layout/, marketing/  # Existing scaffold (pre-Phase-0)
  lib/
    db.ts                # Prisma client singleton (globalThis, adapter-based)
    env.ts               # zod-validated env — fails fast at boot
    crypto.ts            # argon2id hash/verify, token gen, SHA-256, safeEqual
    rate-limit.ts        # Sliding-window limiter (in-memory; Redis TODO)
    logger.ts            # Tiny structured logger (JSON in prod)
    utils.ts             # cn(), formatPriceCents(), slugify()
  server/
    services/            # Business logic (booking, payments, CMS…)
    repositories/        # Data-access layer over Prisma
```

## Architecture decisions (ADR log)

1. **Money as integer cents.** All prices stored as `*Cents` integers + `currency CHAR(3)`. No floats/decimals ever reach money math; formatting lives in `formatPriceCents()`.
2. **RBAC = enum column on `users.role`.** One role per user (`SUPER_ADMIN` > `ADMIN` > `EDITOR` > `SUPPORT` > `USER` semantics enforced in server code). A join table was rejected: no multi-role use case, and single-column checks are simpler and auditable.
3. **DB session registry alongside JWT auth.** Auth.js (v5, next phase) uses JWT credentials sessions; a `sessions` row is also written per login so admins can revoke sessions server-side (JWT alone cannot be revoked). The `Session` model is deliberately NOT the Auth.js adapter shape — OAuth adapter tables (`Account`, `Authenticator`) arrive only if social login does.
4. **Prisma 7 driver-adapter runtime.** The client is Rust-free: `src/lib/db.ts` passes `@prisma/adapter-mariadb` (the MySQL-compatible adapter) with the connection string; the schema intentionally contains no `url`. CLI config lives in `prisma.config.ts` (Prisma 7 no longer auto-loads `.env` — hence `import "dotenv/config"` there).
5. **`proxy.ts`, not `middleware.ts`.** Next 16 deprecated the middleware convention; the security-header layer uses the new `proxy` file/function (Node runtime).
6. **CSP default = strict-but-static-safe.** Nonce-based CSP forces every route to dynamic rendering; until the app is dynamic-first we ship a nonce-free strict policy and keep strict nonce mode behind `SECURITY_CSP_NONCE=1` (see `src/proxy.ts`).
7. **In-memory rate limiter for Phase 0.** Single-process VPS = one Node process, so the sliding-window in-memory limiter is correct. A Redis adapter slot is reserved in `docker-compose.yml` and the swap is isolated to `getRateLimiter()`.
8. **JSON columns where the shape is content, not relations.** Tour inclusions/exclusions, booking contactInfo, CMS payloads, payment webhook raw bodies. Anything we filter or join on is a real column/table; JSON is for opaque payload blobs.
9. **FK behaviors chosen per relationship** (documented inline in the schema): cascade for owned content (tour→departures/itinerary, user→sessions), `Restrict` for financial records (bookings, payments), `SetNull` for audit/retention paths (booking.user, auditlog.actor).
10. **Secrets storage.** Integration credentials land encrypted in `integrations.configEncrypted` (encryption helper ships with the admin integrations UI). At rest in Phase 0 the column stays NULL.

## Security matrix

| Protection                        | Where                                         |
| --------------------------------- | --------------------------------------------- |
| CSP (+ optional strict nonce)     | `src/proxy.ts`                                |
| X-Frame-Options / frame-ancestors | `src/proxy.ts`                                |
| X-Content-Type-Options nosniff    | `src/proxy.ts`                                |
| Referrer-Policy                   | `src/proxy.ts`                                |
| Permissions-Policy                | `src/proxy.ts`                                |
| X-DNS-Prefetch-Control            | `src/proxy.ts`                                |
| HSTS (prod only, 2y, preload)     | `src/proxy.ts`                                |
| Password hashing (argon2id)       | `src/lib/crypto.ts`                           |
| Token hashing (SHA-256 at rest)   | `src/lib/crypto.ts` + `password_reset_tokens` |
| Constant-time secret compare      | `src/lib/crypto.ts`                           |
| Rate limiting (fail-closed API)   | `src/lib/rate-limit.ts`                       |
| Webhook replay protection         | `webhook_events.eventId` unique               |
| Env validation / no silent boot   | `src/lib/env.ts` + `src/instrumentation.ts`   |
| Race-safe seat claiming           | `tour_departures.remainingCapacity` (atomic UPDATE — see schema comment) |
| Audit trail                       | `audit_logs`                                  |
| Secrets in git                    | `.env*` ignored; `.env.example` allow-listed  |

## Integration registry (seeded, all disabled)

GA4, GTM, META_PIXEL, STRIPE, PAYMOB, PAYPAL, RECAPTCHA, TURNSTILE, MAILCHIMP,
SENDGRID, AWS_SES, TWILIO, WHATSAPP, GOOGLE_MAPS, MAPBOX, TRIPADVISOR,
TRUSTPILOT, HOTJAR, SENTRY, ZAPIER — toggled per-instance from the admin panel
(later phase); credentials stored encrypted.

## Not in Phase 0 (by design)

- Landing-page imagery: the WebP library at `../images` gets copied into `public/assets/` by the landing phase; seed rows already reference `/assets/...` paths.
- Redis service (commented-out in compose).
- Auth.js wiring (`next-auth` + `@auth/prisma-adapter` are installed and the schema is compatible; configuration is the auth phase).
- Stripe SDK (env keys + webhook tables are in place).