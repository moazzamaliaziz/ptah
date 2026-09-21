"use server";

/**
 * Public customer login (Phase 4). Server Action = CSRF-safe (same-origin +
 * encrypted action-id). Built on the custom session registry, so logout/rotation
 * gives absolute server-side revocation (Auth.js JWTs could not).
 *
 * Gated by the LOGIN_ENABLED site toggle. Enumeration-/timing-safe: every
 * failure (toggle off aside) returns the SAME generic error with no cookie, and
 * verifyCredentials runs a full argon2 verify even for unknown emails.
 *
 * On success it merges the guest's localStorage wishlist (submitted as slugs in
 * a hidden field) into the account, then returns the merged slug set so the
 * client can hydrate the header pill; the client performs the navigation.
 */
import { headers } from "next/headers";
import { z } from "zod";
import { verifyCredentials } from "@/server/auth/credentials";
import { createSession } from "@/server/auth/session";
import { mergeGuestWishlist, listWishlistSlugs } from "@/server/wishlist";
import { hasActiveEmailProvider } from "@/server/email/mailer";
import { getToggle } from "@/server/toggles";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/client-ip";
import { writeAudit } from "@/server/audit";
import { logger } from "@/lib/logger";

export type LoginState =
  | { ok: false; error: string | null }
  | { ok: true; redirectTo: string; wishlist: string[] };

const schema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(1).max(200),
});

const GENERIC = "Email or password is incorrect.";

/** Same-site, non-admin return path only (no open redirect / protocol-relative). */
function safeReturn(from: FormDataEntryValue | null): string {
  const v = typeof from === "string" ? from : "";
  if (v.startsWith("/") && !v.startsWith("//") && !v.includes("\\") && !v.startsWith("/admin")) return v;
  return "/account";
}

function parseSlugs(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string" || !raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === "string").slice(0, 200);
  } catch {
    return [];
  }
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!(await getToggle("LOGIN_ENABLED"))) {
    return { ok: false, error: "Sign-in is temporarily unavailable. Please try again later." };
  }

  const h = await headers();
  const ip = getClientIp(h);
  const userAgent = h.get("user-agent");

  if (!checkRateLimit(`login:${ip}`, 10, 60_000).allowed) {
    return { ok: false, error: "Too many attempts. Please wait a minute and try again." };
  }

  const parsed = schema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { ok: false, error: GENERIC };

  const user = await verifyCredentials(parsed.data.email, parsed.data.password);
  if (!user) {
    logger.warn("public login denied", { ip });
    return { ok: false, error: GENERIC };
  }

  // Email-verification gate: block only when the account is unverified AND a
  // deliverable email provider is active (so the user CAN receive a link). This
  // check runs solely for unverified accounts — the common verified path adds
  // no extra work. Fail-open: if email delivery is off, we don't lock them out.
  if (!user.emailVerifiedAt && (await hasActiveEmailProvider())) {
    logger.info("public login blocked — email unverified", { ip });
    return {
      ok: false,
      error: "Please confirm your email before signing in. Check your inbox for the confirmation link, or request a new one.",
    };
  }

  await createSession(user.id, { ip, userAgent });

  // Merge the guest wishlist into the account, then return the merged set.
  const guestSlugs = parseSlugs(formData.get("wishlist"));
  if (guestSlugs.length > 0) {
    await mergeGuestWishlist(user.id, guestSlugs).catch((error) =>
      logger.warn("wishlist merge on login failed", { userId: user.id, error }),
    );
  }
  const wishlist = await listWishlistSlugs(user.id).catch(() => guestSlugs);

  await writeAudit({ actorId: user.id, action: "auth.login", entity: "user", entityId: user.id, meta: { area: "public", ip } });

  return { ok: true, redirectTo: safeReturn(formData.get("from")), wishlist };
}
