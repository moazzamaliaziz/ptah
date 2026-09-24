"use server";

/**
 * Account-area server actions (Phase 4): logout, wishlist toggle, change
 * password. All CSRF-safe server actions; the mutating ones re-resolve the
 * session user server-side (never trust a client-supplied user id).
 */
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { requireUser } from "@/server/auth/rbac";
import { getSessionUser, destroySession, createSession } from "@/server/auth/session";
import { changePassword, PASSWORD_MIN, PASSWORD_MAX } from "@/server/auth/accounts";
import { setWishlist } from "@/server/wishlist";
import { getClientIp } from "@/lib/client-ip";
import { writeAudit } from "@/server/audit";
import { localizePath } from "@/i18n/routing";
import { toLocale } from "@/i18n/config";

/** Destroy the current session + clear the cookie, then go home (localized). */
export async function logoutAction(formData: FormData): Promise<void> {
  const user = await getSessionUser();
  await destroySession();
  if (user) {
    await writeAudit({ actorId: user.id, action: "auth.logout", entity: "user", entityId: user.id, meta: {} });
  }
  const raw = formData.get("lang");
  redirect(localizePath("/", toLocale(typeof raw === "string" ? raw : null)));
}

export type WishlistToggleState = { on: boolean };

/**
 * Add/remove a tour (by slug) on the logged-in user's wishlist. Best-effort
 * account sync: localStorage is the source of truth for the pill, so if the
 * session has expired we no-op rather than redirect to login (a wishlist heart
 * must never bounce the user off the page). A later login re-merges guest slugs.
 */
export async function toggleWishlistAction(slug: string, on: boolean): Promise<WishlistToggleState> {
  const user = await getSessionUser();
  if (!user) return { on };
  const result = await setWishlist(user.id, slug, on);
  return { on: result };
}

export type ChangePasswordState = { ok: boolean; error: string | null };

const pwSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    password: z.string().min(PASSWORD_MIN, `Use at least ${PASSWORD_MIN} characters`).max(PASSWORD_MAX),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"], message: "Passwords don't match" });

/**
 * Change password for the logged-in user. changePassword revokes ALL sessions
 * (log out everywhere); we then re-mint THIS session so the user stays signed in
 * on the current device while every other session is invalidated.
 */
export async function changePasswordAction(_prev: ChangePasswordState, formData: FormData): Promise<ChangePasswordState> {
  const user = await requireUser();

  const parsed = pwSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check your details." };

  const result = await changePassword(user.id, parsed.data.currentPassword, parsed.data.password);
  if (!result.ok) return { ok: false, error: result.message };

  // All sessions were revoked; re-establish the current device's session.
  const h = await headers();
  const ip = getClientIp(h);
  await createSession(user.id, { ip, userAgent: h.get("user-agent") });

  await writeAudit({ actorId: user.id, action: "auth.password_change", entity: "user", entityId: user.id, meta: { ip } });
  return { ok: true, error: null };
}
