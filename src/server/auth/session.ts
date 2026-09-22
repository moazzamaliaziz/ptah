/**
 * Server-side session registry (Phase 2).
 *
 * A deliberately small, revocable session layer built on the existing
 * `Session` model (a hashed-token registry, schema §AUTH). It gates the admin
 * area and (Phase 4) the public credential flows. Auth.js v5 was intentionally
 * NOT adopted: its Credentials provider forces non-revocable JWT sessions,
 * which conflicts with the locked absolute server-side revocation requirement
 * (see the ADR in README + audit/phase-4-triple-audit.md). This registry gives
 * absolute revocation by row delete. Contract:
 *
 *   - The raw session token lives ONLY in an HttpOnly, SameSite=Lax cookie.
 *   - The database stores only sha256(token) (`sessions.token`, unique), so a
 *     DB leak yields no usable cookies.
 *   - Sessions have a hard 7-day absolute cap (`expiresAt`) AND a shorter idle
 *     (inactivity) timeout (`SESSION_IDLE_TTL_MS`). The idle window slides
 *     forward on use via `sessions.lastSeenAt`; the absolute cap never moves.
 *     Both are enforced server-side on read, so neither depends on the cookie.
 *   - Sessions are individually revocable by deleting the row (logout, or admin
 *     "revoke session"), and en masse via revokeAllForUser (delete by userId).
 *
 * cookies() is async in Next 16; set/delete only run inside Server Actions or
 * Route Handlers (login/logout). getSessionUser() only reads, so it is safe in
 * render.
 */
import "server-only";
import { cookies } from "next/headers";
import type { Role, UserStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { generateToken, sha256Hex } from "@/lib/crypto";

export const SESSION_COOKIE = "ptah_session";
/** Absolute session lifetime — the hard cap. A session can never outlive this. */
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days
/**
 * Idle (inactivity) timeout for staff/admin sessions. A session unused for
 * longer than this is treated as expired on read, EVEN IF still within the
 * 7-day absolute cap. The window slides forward on use (see `lastSeenAt`), so
 * it is an ADDITIONAL, earlier expiry layered on top of `SESSION_TTL_MS`.
 */
export const SESSION_IDLE_TTL_MS = 1000 * 60 * 60 * 2; // 2 hours
/**
 * Write-throttle for the sliding refresh: getSessionUser only bumps
 * `lastSeenAt` when it is older than this, so an active session triggers at
 * most one small DB write per minute instead of one per render.
 */
const SESSION_TOUCH_THROTTLE_MS = 1000 * 60; // 1 minute

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: UserStatus;
}

interface SessionMeta {
  ip?: string | null;
  userAgent?: string | null;
}

function cookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: env.isProd,
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

/**
 * Create a session for `userId`, persist the hashed token, and set the cookie.
 * Only call from a Server Action / Route Handler.
 */
export async function createSession(userId: string, meta: SessionMeta = {}): Promise<void> {
  const raw = generateToken(32);
  const tokenHash = sha256Hex(raw);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db.session.create({
    data: {
      userId,
      token: tokenHash,
      expiresAt,
      lastSeenAt: new Date(), // start the idle window at creation
      ip: meta.ip ?? null,
      userAgent: meta.userAgent ?? null,
    },
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, raw, cookieOptions(Math.floor(SESSION_TTL_MS / 1000)));
}

/**
 * Resolve the current session's user, or null. Rows past the absolute cap, rows
 * idle past `SESSION_IDLE_TTL_MS`, and non-ACTIVE users never resolve. Safe to
 * call during render: it does not write cookies, and the sliding-refresh bump
 * is a throttled fire-and-forget DB write whose failure is swallowed and can
 * never surface into the render tree.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  const tokenHash = sha256Hex(raw);
  const session = await db.session.findUnique({
    where: { token: tokenHash },
    select: {
      expiresAt: true,
      lastSeenAt: true,
      createdAt: true,
      user: { select: { id: true, email: true, name: true, role: true, status: true } },
    },
  });

  if (!session) return null;

  const now = Date.now();

  // Absolute cap — the hard limit, unchanged.
  if (session.expiresAt.getTime() <= now) return null;

  // Idle (inactivity) timeout — an additional, earlier expiry. `lastSeenAt` is
  // nullable for rows created before this column existed, so fall back to
  // `createdAt` (gives legacy rows a fresh first window rather than nuking them).
  const lastActivity = (session.lastSeenAt ?? session.createdAt).getTime();
  if (now - lastActivity > SESSION_IDLE_TTL_MS) return null;

  if (session.user.status !== "ACTIVE") return null;

  // Sliding refresh. getSessionUser runs during render, where cookies() cannot
  // be written and blocking side effects are undesirable, so we bump the idle
  // window with a throttled, fire-and-forget update: not awaited, rejection
  // swallowed, never thrown into render. It only moves `lastSeenAt` forward and
  // NEVER touches `expiresAt`, so the absolute cap is unaffected. Server Actions
  // / Route Handlers that prefer a guaranteed, awaited bump can call
  // touchSession() instead (or in addition).
  if (now - lastActivity > SESSION_TOUCH_THROTTLE_MS) {
    void db.session
      .updateMany({ where: { token: tokenHash }, data: { lastSeenAt: new Date() } })
      .catch(() => {});
  }

  return session.user;
}

/**
 * Slide the current session's idle window forward (`lastSeenAt = now`) with an
 * explicit, awaited write. Intended for Server Actions / Route Handlers / the
 * admin layout's server path where a guaranteed bump is preferred over
 * getSessionUser's fire-and-forget one. Uses updateMany so it never throws if
 * the row is gone (revoked/expired). Does NOT write cookies and does NOT touch
 * `expiresAt`, so the absolute cap and cookie contract are unaffected.
 */
export async function touchSession(): Promise<void> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (!raw) return;
  const tokenHash = sha256Hex(raw);
  await db.session.updateMany({
    where: { token: tokenHash },
    data: { lastSeenAt: new Date() },
  });
}

/**
 * Revoke the current session (delete the row) and clear the cookie. Idempotent.
 * Only call from a Server Action / Route Handler.
 */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  if (raw) {
    const tokenHash = sha256Hex(raw);
    // deleteMany: never throws if the row is already gone (double logout).
    await db.session.deleteMany({ where: { token: tokenHash } });
  }
  store.delete(SESSION_COOKIE);
}

/** Purge every session for a user (password change, "log out everywhere"). */
export async function revokeAllForUser(userId: string): Promise<number> {
  const { count } = await db.session.deleteMany({ where: { userId } });
  return count;
}
