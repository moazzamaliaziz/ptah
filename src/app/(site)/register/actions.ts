"use server";

/**
 * Public customer registration (Phase 4). Gated by SIGNUP_ENABLED. CSRF-safe
 * server action, rate-limited per IP. Enumeration-safe: registerUser returns a
 * generic message on a duplicate email (never "email in use"). On success the
 * account is auto-logged-in (new session) and the guest wishlist is merged.
 */
import { headers } from "next/headers";
import { z } from "zod";
import { registerUser, PASSWORD_MIN, PASSWORD_MAX } from "@/server/auth/accounts";
import { createSession } from "@/server/auth/session";
import { mergeGuestWishlist, listWishlistSlugs } from "@/server/wishlist";
import { getToggle } from "@/server/toggles";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/client-ip";
import { writeAudit } from "@/server/audit";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

export type RegisterState =
  | { ok: false; error: string | null }
  | { ok: true; redirectTo: string; wishlist: string[] };

const schema = z
  .object({
    name: z.string().trim().min(2, "Please enter your name").max(160),
    email: z.string().email("Enter a valid email address").max(255),
    password: z
      .string()
      .min(PASSWORD_MIN, `Use at least ${PASSWORD_MIN} characters`)
      .max(PASSWORD_MAX),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

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

export async function registerAction(_prev: RegisterState, formData: FormData): Promise<RegisterState> {
  if (!(await getToggle("SIGNUP_ENABLED"))) {
    return { ok: false, error: "New account registration is temporarily unavailable." };
  }

  const h = await headers();
  const ip = getClientIp(h);
  const userAgent = h.get("user-agent");

  if (!checkRateLimit(`register:${ip}`, 5, 60_000).allowed) {
    return { ok: false, error: "Too many attempts. Please wait a minute and try again." };
  }

  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check your details." };
  }

  const result = await registerUser({
    name: parsed.data.name,
    email: parsed.data.email,
    password: parsed.data.password,
    baseUrl: env.NEXT_PUBLIC_SITE_URL,
  });
  if (!result.ok) {
    return { ok: false, error: result.message };
  }

  const guestSlugs = parseSlugs(formData.get("wishlist"));
  // Merge the guest wishlist into the (already-created) account so it survives
  // regardless of whether we auto-login now or after verification.
  if (guestSlugs.length > 0) {
    await mergeGuestWishlist(result.userId, guestSlugs).catch((error) =>
      logger.warn("wishlist merge on register failed", { userId: result.userId, error }),
    );
  }

  await writeAudit({ actorId: result.userId, action: "auth.register", entity: "user", entityId: result.userId, meta: { ip, verificationRequired: result.verificationRequired } });

  // Verification gate: when a confirmation email was sent we do NOT auto-login;
  // route to the "check your inbox" page. The local (guest) wishlist is left
  // untouched on the client until they verify + sign in.
  if (result.verificationRequired) {
    return { ok: true, redirectTo: "/verify-email", wishlist: guestSlugs };
  }

  // No email provider → account is auto-verified and immediately usable.
  await createSession(result.userId, { ip, userAgent });
  const wishlist = await listWishlistSlugs(result.userId).catch(() => guestSlugs);
  return { ok: true, redirectTo: safeReturn(formData.get("from")), wishlist };
}
