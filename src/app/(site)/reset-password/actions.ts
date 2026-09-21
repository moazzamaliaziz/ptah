"use server";

/**
 * Complete a password reset (Phase 4). Validates the token + new password,
 * delegates to resetPassword (single-use token, revokes all sessions on
 * success). Rate-limited per IP. All token failures map to one generic message
 * (no signal about whether the token existed).
 */
import { headers } from "next/headers";
import { z } from "zod";
import { resetPassword, PASSWORD_MIN, PASSWORD_MAX } from "@/server/auth/accounts";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/client-ip";

export type ResetState = { ok: boolean; error: string | null };

const schema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(PASSWORD_MIN, `Use at least ${PASSWORD_MIN} characters`).max(PASSWORD_MAX),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  });

export async function resetPasswordAction(_prev: ResetState, formData: FormData): Promise<ResetState> {
  const h = await headers();
  const ip = getClientIp(h);

  if (!checkRateLimit(`reset:${ip}`, 10, 60_000).allowed) {
    return { ok: false, error: "Too many attempts. Please wait a minute and try again." };
  }

  const parsed = schema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check your details." };
  }

  const result = await resetPassword(parsed.data.token, parsed.data.password);
  if (!result.ok) return { ok: false, error: result.message };

  return { ok: true, error: null };
}
