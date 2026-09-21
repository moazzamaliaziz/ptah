/**
 * Public account operations (Phase 4) — registration, password reset request &
 * completion, password change. Built on the existing custom session registry
 * (see session.ts); Auth.js v5 was intentionally NOT adopted because its
 * Credentials provider forces non-revocable JWT sessions, which conflicts with
 * the locked "absolutely revocable server-side session registry" requirement.
 *
 * Enumeration- & timing-safety is a first-class concern here:
 *   - Registration relies on the DB unique constraint (P2002) and returns a
 *     generic message on conflict, never "email already in use".
 *   - Password-reset REQUEST always returns the same result regardless of
 *     whether the email exists; a token is only minted when it does.
 *   - Password-reset COMPLETION and change map every failure to one generic
 *     message.
 *
 * Tokens (reset links) are stored HASHED (sha256) and are single-use + short
 * lived. A password reset or change revokes ALL of the user's sessions.
 */
import "server-only";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword, generateToken, sha256Hex } from "@/lib/crypto";
import { revokeAllForUser } from "@/server/auth/session";
import { sendEmail, hasActiveEmailProvider } from "@/server/email/mailer";
import { passwordResetEmail, emailVerificationEmail } from "@/server/email/templates";
import { logger } from "@/lib/logger";

/** Password policy — deliberately simple + strong: length is the main lever. */
export const PASSWORD_MIN = 10;
export const PASSWORD_MAX = 200;
/** Reset links live for one hour. */
const RESET_TTL_MS = 1000 * 60 * 60;
/** Email-verification links live for 24 hours. */
const VERIFY_TTL_MS = 1000 * 60 * 60 * 24;

export type RegisterResult =
  | { ok: true; userId: string; verificationRequired: boolean }
  | { ok: false; message: string };

/**
 * Create a new customer (role USER). Enumeration-safe: on a duplicate email the
 * unique constraint throws P2002 and we return a generic message rather than
 * confirming the address exists. Email is lower-cased.
 *
 * Email verification is CONDITIONAL on a deliverable email provider: when one
 * is active the account is created UNVERIFIED and a verification email is sent
 * (verificationRequired = true, so login is gated until confirmed); when no
 * provider is configured there is no way to deliver/receive a link, so the
 * account is auto-verified (`emailVerifiedAt = now`) and immediately usable.
 */
export async function registerUser(input: {
  name: string;
  email: string;
  password: string;
  /** Absolute site origin, used to build the verification link. */
  baseUrl: string;
}): Promise<RegisterResult> {
  const email = input.email.trim().toLowerCase();
  const passwordHash = await hashPassword(input.password);
  const emailActive = await hasActiveEmailProvider();

  try {
    const user = await db.user.create({
      data: {
        name: input.name.trim(),
        email,
        passwordHash,
        role: "USER",
        status: "ACTIVE",
        // Auto-verify only when we cannot send a verification email at all.
        emailVerifiedAt: emailActive ? null : new Date(),
      },
      select: { id: true },
    });

    if (emailActive) {
      await sendVerificationEmail(user.id, email, input.baseUrl);
    }
    return { ok: true, userId: user.id, verificationRequired: emailActive };
  } catch (error) {
    if (isUniqueViolation(error)) {
      // Do NOT reveal that the email is taken (enumeration oracle). Generic,
      // actionable, and true whether or not the account exists.
      return {
        ok: false,
        message: "We couldn't create an account with those details. If you already have one, try logging in or resetting your password.",
      };
    }
    logger.error("registerUser failed", { error });
    return { ok: false, message: "Something went wrong creating your account. Please try again." };
  }
}

/**
 * Mint a single-use hashed email-verification token and email the link. The
 * token is stored in VerificationToken (identifier = email, token = sha256 of
 * the raw value) so a DB leak never yields a usable link. Best-effort delivery;
 * the raw token never leaves the server except inside the emailed URL.
 */
async function sendVerificationEmail(userId: string, email: string, baseUrl: string): Promise<void> {
  const rawToken = generateToken(32);
  const tokenHash = sha256Hex(rawToken);
  // Clear any prior outstanding tokens for this identifier (single active link).
  await db.verificationToken.deleteMany({ where: { identifier: email } });
  await db.verificationToken.create({
    data: { identifier: email, token: tokenHash, expires: new Date(Date.now() + VERIFY_TTL_MS) },
  });

  const verifyUrl = `${baseUrl.replace(/\/$/, "")}/verify-email?token=${rawToken}`;
  const built = emailVerificationEmail(verifyUrl);
  const sent = await sendEmail({ to: email, subject: built.subject, text: built.text, html: built.html });
  if (!sent.ok) {
    logger.info("verification link (email not delivered)", { userId, reason: sent.reason, verifyUrl });
  }
}

export type VerifyEmailResult = { ok: true } | { ok: false; message: string };

const GENERIC_VERIFY_FAIL = "This confirmation link is invalid or has expired. Please request a new one.";

/**
 * Consume an email-verification token: validate + expiry-check the hashed
 * token, set the user's emailVerifiedAt, and delete the token (single-use). All
 * failures map to one generic message. Idempotent-ish: a token is deleted on
 * success, so a second click yields the generic message (the account is by then
 * already verified).
 */
export async function verifyEmailToken(rawToken: string): Promise<VerifyEmailResult> {
  if (!rawToken) return { ok: false, message: GENERIC_VERIFY_FAIL };
  const tokenHash = sha256Hex(rawToken);

  const record = await db.verificationToken.findFirst({
    where: { token: tokenHash },
    select: { identifier: true, token: true, expires: true },
  });
  if (!record || record.expires.getTime() <= Date.now()) {
    // Clean up an expired match if present.
    if (record) {
      await db.verificationToken.deleteMany({ where: { identifier: record.identifier, token: record.token } });
    }
    return { ok: false, message: GENERIC_VERIFY_FAIL };
  }

  // Consume the token and mark the account verified. deleteMany scoped to the
  // exact (identifier, token) pair is the single-use guard.
  await db.$transaction(async (tx) => {
    await tx.verificationToken.deleteMany({ where: { identifier: record.identifier, token: record.token } });
    await tx.user.updateMany({
      where: { email: record.identifier, emailVerifiedAt: null },
      data: { emailVerifiedAt: new Date() },
    });
  });
  logger.info("email verified", { identifier: maskEmailForLog(record.identifier) });
  return { ok: true };
}

/**
 * Re-send a verification email. Enumeration-safe: ALWAYS returns void. Only
 * sends when the account exists, is ACTIVE, is still unverified, AND an email
 * provider is active.
 */
export async function resendVerificationEmail(email: string, baseUrl: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  if (!(await hasActiveEmailProvider())) return;
  const user = await db.user.findUnique({
    where: { email: normalized },
    select: { id: true, status: true, emailVerifiedAt: true },
  });
  if (!user || user.status !== "ACTIVE" || user.emailVerifiedAt) return;
  await sendVerificationEmail(user.id, normalized, baseUrl);
}

/** `john@example.com` → `j***@example.com` — used only for log lines. */
function maskEmailForLog(email: string): string {
  const at = email.lastIndexOf("@");
  if (at <= 0) return `${email[0] ?? ""}***`;
  return `${email[0]}***${email.slice(at)}`;
}

/**
 * Begin a password reset. ALWAYS returns void with no signal about whether the
 * email exists. When it does (and the account is ACTIVE), mint a single-use
 * hashed token and hand the raw reset URL to the delivery channel. Email
 * delivery is a Phase 5 integration; until then the link is logged server-side
 * so the flow is testable end-to-end without leaking anything to the client.
 */
export async function requestPasswordReset(email: string, baseUrl: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  const user = await db.user.findUnique({
    where: { email: normalized },
    select: { id: true, status: true },
  });
  if (!user || user.status !== "ACTIVE") return;

  const rawToken = generateToken(32);
  const tokenHash = sha256Hex(rawToken);
  await db.passwordResetToken.create({
    data: { userId: user.id, tokenHash, expires: new Date(Date.now() + RESET_TTL_MS) },
  });

  const resetUrl = `${baseUrl.replace(/\/$/, "")}/reset-password?token=${rawToken}`;

  // Deliver via the active email integration (SendGrid/SES/Mandrill). When no
  // provider is configured this is a clean no-op returning NO_PROVIDER — we
  // then fall back to server-logging the link so the flow stays testable and
  // an operator can still complete a reset. The raw token is NEVER returned to
  // the caller/client either way (enumeration-safe: the caller sees void).
  const built = passwordResetEmail(resetUrl);
  const sent = await sendEmail({ to: normalized, subject: built.subject, text: built.text, html: built.html });
  if (!sent.ok) {
    logger.info("password reset link (email not delivered)", {
      userId: user.id,
      reason: sent.reason,
      resetUrl,
    });
  }
}

export type ResetResult = { ok: true } | { ok: false; message: string };

const GENERIC_RESET_FAIL = "This reset link is invalid or has expired. Please request a new one.";

/**
 * Complete a password reset. Validates the (hashed) token, enforces single-use
 * and expiry, sets the new password, marks the token used, and revokes ALL of
 * the user's existing sessions (force re-login everywhere). All failures map to
 * one generic message.
 */
export async function resetPassword(rawToken: string, newPassword: string): Promise<ResetResult> {
  if (!rawToken) return { ok: false, message: GENERIC_RESET_FAIL };
  const tokenHash = sha256Hex(rawToken);

  const token = await db.passwordResetToken.findUnique({
    where: { tokenHash },
    select: { id: true, userId: true, expires: true, usedAt: true },
  });
  if (!token || token.usedAt || token.expires.getTime() <= Date.now()) {
    return { ok: false, message: GENERIC_RESET_FAIL };
  }

  const passwordHash = await hashPassword(newPassword);
  // Consume the token atomically. The guarded updateMany (usedAt: null) is the
  // whole race guard: exactly one concurrent submit gets count === 1 and sets
  // the new password inside the same transaction; the loser gets count 0 and
  // the transaction returns false (no password change, generic failure).
  const claimed = await db.$transaction(async (tx) => {
    const claim = await tx.passwordResetToken.updateMany({
      where: { id: token.id, usedAt: null },
      data: { usedAt: new Date() },
    });
    if (claim.count !== 1) return false;
    await tx.user.update({ where: { id: token.userId }, data: { passwordHash } });
    return true;
  });
  if (!claimed) return { ok: false, message: GENERIC_RESET_FAIL };

  // A completed reset invalidates every existing session (force re-login).
  await revokeAllForUser(token.userId);
  logger.info("password reset completed", { userId: token.userId });
  return { ok: true };
}

export type ChangeResult = { ok: true } | { ok: false; message: string };

/**
 * Change password for a logged-in user. Verifies the current password, sets the
 * new one, and revokes every OTHER session (the current session is preserved by
 * the caller re-creating it, or left as-is — caller decides). Returns generic
 * failure on a wrong current password.
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<ChangeResult> {
  const user = await db.user.findUnique({ where: { id: userId }, select: { passwordHash: true } });
  if (!user?.passwordHash) return { ok: false, message: "Unable to change password." };

  const ok = await verifyPassword(user.passwordHash, currentPassword);
  if (!ok) return { ok: false, message: "Your current password is incorrect." };

  const passwordHash = await hashPassword(newPassword);
  await db.user.update({ where: { id: userId }, data: { passwordHash } });
  await revokeAllForUser(userId);
  logger.info("password changed", { userId });
  return { ok: true };
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}
