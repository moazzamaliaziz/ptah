/**
 * Shared argon2id parameters — the single source of truth for password
 * hashing strength (OWASP baseline: m=19 MiB, t>=2, p=1; we use t=3).
 *
 * This module must stay dependency-free and MUST NOT import "server-only":
 * prisma/seed.ts runs under plain tsx (outside the RSC bundler), where the
 * server-only package throws. Consumers:
 *   - src/lib/crypto.ts  (request-time hash/verify)
 *   - prisma/seed.ts     (seeded admin password)
 */
export const ARGON2_OPTIONS = {
  memoryCost: 19456, // KiB (19 MiB)
  timeCost: 3,
  parallelism: 1,
} as const;