/**
 * Password & token cryptography — argon2id via @node-rs/argon2.
 *
 * @node-rs/argon2 is a prebuilt native binding (no node-gyp / Visual Studio
 * toolchain needed on Windows), which is why it is preferred over the
 * reference `argon2` package on this stack.
 *
 * Parameters follow OWASP cheat-sheet guidance for argon2id
 * (m=19 MiB, t=3, p=1) — tune up when hardware allows, never down.
 */
import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { hash, verify } from "@node-rs/argon2";
import { ARGON2_OPTIONS } from "@/lib/argon2-params";

/** Hash a plaintext password for storage in users.password_hash. */
export async function hashPassword(plaintext: string): Promise<string> {
  return hash(plaintext, ARGON2_OPTIONS);
}

/**
 * Constant-time-ish password check. Never throws on malformed input —
 * returns false instead (callers map false → generic 401, no oracle).
 */
export async function verifyPassword(
  passwordHash: string,
  plaintext: string,
): Promise<boolean> {
  try {
    return await verify(passwordHash, plaintext, ARGON2_OPTIONS);
  } catch {
    return false;
  }
}

/** High-entropy opaque token (email verification, password reset links). */
export function generateToken(bytes = 32): string {
  return randomBytes(bytes).toString("base64url");
}

/**
 * SHA-256 hex digest — tokens are stored HASHED in the database so a DB leak
 * does not leak usable reset/verification links.
 */
export function sha256Hex(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

/** Constant-time string comparison for secrets (webhook signatures etc.). */
export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}