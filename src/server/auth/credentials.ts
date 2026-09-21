/**
 * Credential verification (Phase 2; reused by Phase 4 public auth).
 *
 * Enumeration- and timing-safe: an unknown email still runs a full argon2id
 * verify against a fixed dummy hash so response time does not reveal whether
 * the account exists, and callers map every failure to one generic message.
 */
import "server-only";
import type { Role, UserStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/crypto";

/** Real argon2id hash of a throwaway string — never matches a user password. */
const DUMMY_HASH =
  "$argon2id$v=19$m=19456,t=3,p=1$9IYqXYGmosuuoU4s+EYdeg$xsVstLnbJuoxYEJND6IWWZZ3Kd1rtbbN79iDggKYlZ0";

export interface VerifiedUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: UserStatus;
  /** Null when the email address has not been confirmed (login gate). */
  emailVerifiedAt: Date | null;
}

/**
 * Return the user iff the email exists, the password matches, and the account
 * is ACTIVE. Returns null otherwise (no distinction between the failure modes).
 */
export async function verifyCredentials(email: string, password: string): Promise<VerifiedUser | null> {
  const user = await db.user.findUnique({
    where: { email: email.toLowerCase() },
    select: { id: true, email: true, name: true, role: true, status: true, emailVerifiedAt: true, passwordHash: true },
  });

  // Always perform a verify (dummy when no user / no hash) to equalize timing.
  const hashToCheck = user?.passwordHash ?? DUMMY_HASH;
  const passwordOk = await verifyPassword(hashToCheck, password);

  if (!user || !user.passwordHash || !passwordOk || user.status !== "ACTIVE") {
    return null;
  }
  const { passwordHash: _omit, ...safe } = user;
  void _omit;
  return safe;
}
