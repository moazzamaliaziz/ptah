"use server";

/**
 * Newsletter sign-up (Wave 1). No dedicated subscriber table exists yet, so a
 * sign-up is persisted as a ContactMessage tagged with a "Newsletter signup"
 * subject — real capture the team sees in the admin inbox, never a silent stub.
 * Same defense-in-depth as the contact form: honeypot, per-IP rate limit, zod.
 */
import { headers } from "next/headers";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/client-ip";
import { submitContactMessage } from "@/server/contact";
import { logger } from "@/lib/logger";

export type NewsletterState = { ok: boolean; error: string | null };

const emailSchema = z.email("Please enter a valid email address.").max(255);
const nameSchema = z.string().trim().max(120).optional();

export async function subscribeNewsletterAction(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const h = await headers();
  const ip = getClientIp(h);

  // Honeypot: a real user's browser never fills this hidden field.
  if (String(formData.get("website") ?? "").trim() !== "") {
    return { ok: true, error: null };
  }

  if (!checkRateLimit(`newsletter:${ip}`, 5, 300_000).allowed) {
    return { ok: false, error: "Too many attempts. Please wait a few minutes and try again." };
  }

  const email = emailSchema.safeParse(formData.get("email"));
  if (!email.success) {
    return { ok: false, error: email.error.issues[0]?.message ?? "Please enter a valid email address." };
  }
  const nameParsed = nameSchema.safeParse(formData.get("name") ?? "");
  const name = (nameParsed.success ? nameParsed.data : "")?.trim() || "Newsletter subscriber";

  try {
    await submitContactMessage(
      {
        name,
        email: email.data,
        phone: "",
        subject: "Newsletter signup",
        message: "Requested to join the Ptah Tours newsletter from the /newsletter page.",
      },
      { ip, userAgent: h.get("user-agent") },
    );
  } catch (error) {
    logger.error("newsletter signup failed to persist", { error });
    return { ok: false, error: "Something went wrong. Please try again shortly." };
  }

  return { ok: true, error: null };
}
