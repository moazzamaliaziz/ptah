"use server";

/**
 * Resend an email-verification link (Phase 5). Enumeration-safe: ALWAYS returns
 * the same "if your account needs confirming, a link is on its way" result,
 * whether or not the address exists / is already verified. resendVerificationEmail
 * only sends when the account exists, is ACTIVE, is unverified, AND an email
 * provider is active. Rate-limited per IP (minting + sending is relatively
 * costly and must not be a spray target).
 */
import { headers } from "next/headers";
import { z } from "zod";
import { resendVerificationEmail } from "@/server/auth/accounts";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/client-ip";
import { env } from "@/lib/env";

export type ResendState = { done: boolean; error: string | null };

const schema = z.object({ email: z.string().email().max(255) });

export async function resendVerificationAction(_prev: ResendState, formData: FormData): Promise<ResendState> {
  const h = await headers();
  const ip = getClientIp(h);

  if (!(await checkRateLimit(`verify-resend:${ip}`, 5, 60_000)).allowed) {
    return { done: false, error: "Too many requests. Please wait a minute and try again." };
  }

  const parsed = schema.safeParse({ email: formData.get("email") });
  // Even an invalid email returns the generic done message — no signal either way.
  if (parsed.success) {
    await resendVerificationEmail(parsed.data.email, env.NEXT_PUBLIC_SITE_URL);
  }

  return { done: true, error: null };
}
