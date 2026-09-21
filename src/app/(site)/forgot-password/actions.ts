"use server";

/**
 * Request a password reset (Phase 4). Enumeration-safe: ALWAYS returns the same
 * "if an account exists, a link is on its way" result whether or not the email
 * is registered. requestPasswordReset only mints a token when the account
 * exists + is active. Rate-limited per IP (a token mint is relatively costly and
 * this endpoint must not be a spray target).
 *
 * Email delivery goes through the active email integration (SendGrid/SES/
 * Mandrill) resolved from the vault. When no provider is configured the send is
 * a clean no-op and the reset link is logged server-side (see accounts.ts), so
 * the flow stays testable without ever leaking to the client.
 */
import { headers } from "next/headers";
import { z } from "zod";
import { requestPasswordReset } from "@/server/auth/accounts";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/client-ip";
import { env } from "@/lib/env";

export type ForgotState = { done: boolean; error: string | null };

const schema = z.object({ email: z.string().email().max(255) });

export async function forgotPasswordAction(_prev: ForgotState, formData: FormData): Promise<ForgotState> {
  const h = await headers();
  const ip = getClientIp(h);

  if (!checkRateLimit(`forgot:${ip}`, 5, 60_000).allowed) {
    return { done: false, error: "Too many requests. Please wait a minute and try again." };
  }

  const parsed = schema.safeParse({ email: formData.get("email") });
  // Even an invalid email returns the generic done message — no signal either way.
  if (parsed.success) {
    await requestPasswordReset(parsed.data.email, env.NEXT_PUBLIC_SITE_URL);
  }

  return { done: true, error: null };
}
