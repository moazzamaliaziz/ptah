/**
 * Admin bootstrap from the environment (Hostinger-friendly).
 *
 * When ADMIN_EMAIL is set, this ensures a single SUPER_ADMIN user exists whose
 * email and password are driven by the environment, so the owner can set or
 * change the admin login purely through platform env vars + a redeploy — no DB
 * console needed. Run once at boot from src/instrumentation.ts.
 *
 * Password source (pick one):
 *   - ADMIN_PASSWORD_HASH — a pre-computed argon2id hash (preferred; no plaintext
 *     secret ever sits in the environment).
 *   - ADMIN_PASSWORD — plaintext, hashed here at boot.
 *
 * Verify-first: an existing admin is only re-hashed/updated when the stored hash
 * does not already match the env password, so a normal boot does not pay the
 * (intentionally slow) argon2 cost. Best-effort: any failure is logged and
 * swallowed so a transient DB issue never blocks server startup.
 */
import "server-only";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/crypto";
import { logger } from "@/lib/logger";

export async function syncAdminFromEnv(): Promise<void> {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!email) return; // feature off unless an admin email is configured

  const name = process.env.ADMIN_NAME?.trim() || "Ptah Platform Admin";
  const envHash = process.env.ADMIN_PASSWORD_HASH?.trim();
  const envPassword = process.env.ADMIN_PASSWORD;

  if (!envHash && !envPassword) {
    logger.warn("ADMIN_EMAIL is set but neither ADMIN_PASSWORD nor ADMIN_PASSWORD_HASH is — skipping admin sync");
    return;
  }

  try {
    const existing = await db.user.findUnique({
      where: { email },
      select: { id: true, passwordHash: true, role: true, status: true },
    });

    // Resolve the hash to store, only when it needs to change.
    let targetHash: string | null = null;
    if (envHash) {
      if (!existing || existing.passwordHash !== envHash) targetHash = envHash;
    } else if (envPassword) {
      const alreadyMatches = existing?.passwordHash
        ? await verifyPassword(existing.passwordHash, envPassword)
        : false;
      if (!alreadyMatches) targetHash = await hashPassword(envPassword);
    }

    if (!existing) {
      await db.user.create({
        data: {
          email,
          name,
          passwordHash: targetHash,
          role: "SUPER_ADMIN",
          status: "ACTIVE",
          emailVerifiedAt: new Date(),
        },
      });
      logger.info("admin user created from env", { email });
      return;
    }

    const data: { passwordHash?: string; role?: "SUPER_ADMIN"; status?: "ACTIVE" } = {};
    if (targetHash) data.passwordHash = targetHash;
    if (existing.role !== "SUPER_ADMIN") data.role = "SUPER_ADMIN";
    if (existing.status !== "ACTIVE") data.status = "ACTIVE";

    if (Object.keys(data).length > 0) {
      await db.user.update({ where: { id: existing.id }, data });
      logger.info("admin user synced from env", { email, updated: Object.keys(data) });
    }
  } catch (err) {
    logger.warn("admin env-sync skipped (database unavailable or not migrated)", {
      message: err instanceof Error ? err.message : String(err),
    });
  }
}
