"use server";

/**
 * Public contact-form submission (Wave 1). Defense in depth:
 *  - per-IP rate limit (spam/abuse throttle),
 *  - hidden honeypot field (`website`) — bots fill it, humans never see it,
 *  - zod validation of every field,
 *  - persist-first via the contact service (never lost), best-effort admin email.
 * Returns a discriminated state for useActionState; never throws to the client.
 */
import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/rate-limit";
import { getClientIp } from "@/lib/client-ip";
import { contactInputSchema } from "@/content/contact-schema";
import { submitContactMessage } from "@/server/contact";
import { logger } from "@/lib/logger";

export type ContactState = { ok: boolean; error: string | null };

export async function submitContactAction(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const h = await headers();
  const ip = getClientIp(h);

  // Honeypot: a real user's browser never fills this hidden field.
  if (String(formData.get("website") ?? "").trim() !== "") {
    // Pretend success so bots get no signal.
    return { ok: true, error: null };
  }

  if (!(await checkRateLimit(`contact:${ip}`, 5, 300_000)).allowed) {
    return { ok: false, error: "Too many messages. Please wait a few minutes and try again." };
  }

  const parsed = contactInputSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please check the form and try again." };
  }

  try {
    await submitContactMessage(parsed.data, {
      ip,
      userAgent: h.get("user-agent"),
    });
  } catch (error) {
    logger.error("contact submission failed to persist", { error });
    return { ok: false, error: "Something went wrong sending your message. Please try again shortly." };
  }

  return { ok: true, error: null };
}
