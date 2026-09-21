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
 *   - Sessions are absolute-expiry (no sliding refresh) and individually
 *     revocable by deleting the row (logout, or admin "revoke session").
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
/** Absolute session lifetime. */
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

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
      ip: meta.ip ?? null,
      userAgent: meta.userAgent ?? null,
    },
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, raw, cookieOptions(Math.floor(SESSION_TTL_MS / 1000)));
}

/**
 * Resolve the current session's user, or null. Expired rows and non-ACTIVE
 * users never resolve. Safe to call during render (read-only).
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
      user: { select: { id: true, email: true, name: true, role: true, status: true } },
    },
  });

  if (!session) return null;
  if (session.expiresAt.getTime() <= Date.now()) return null;
  if (session.user.status !== "ACTIVE") return null;
  return session.user;
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
