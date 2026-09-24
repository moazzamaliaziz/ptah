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
import { toLocale } from "@/i18n/config";
import { getPageContent } from "@/i18n/pages";

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
  const t = (await getPageContent(toLocale(String(formData.get("lang") ?? "")))).resetPassword;

  const h = await headers();
  const ip = getClientIp(h);

  if (!(await checkRateLimit(`reset:${ip}`, 10, 60_000)).allowed) {
    return { ok: false, error: t.errorRateLimit };
  }

  const parsed = schema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    const mismatch = parsed.error.issues.some((i) => i.path.includes("confirmPassword"));
    return { ok: false, error: mismatch ? t.errorPasswordMismatch : t.errorCheckDetails };
  }

  const result = await resetPassword(parsed.data.token, parsed.data.password);
  if (!result.ok) return { ok: false, error: t.errorTokenInvalid };

  return { ok: true, error: null };
}
