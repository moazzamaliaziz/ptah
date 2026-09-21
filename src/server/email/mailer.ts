/**
 * Transactional mailer (Phase 5).
 *
 * DB-driven, per the integrations vault: the active email provider is whichever
 * of SENDGRID / AWS_SES / MAILCHIMP is enabled AND configured (checked in that
 * priority order). NOTHING is hardcoded — no API key, from-address, or provider
 * choice lives in code; they all come from the encrypted vault
 * (src/server/integrations.ts). If no email integration is active, sendEmail is
 * a clean no-op that returns { ok: false, reason: "NO_PROVIDER" } and logs an
 * info line, so callers (password reset, booking confirmation) never throw when
 * email simply isn't set up yet.
 *
 * Delivery uses the providers' plain HTTPS REST APIs via `fetch` (no vendor SDK
 * dependency). Each provider adapter builds its own request from a normalized
 * EmailMessage. Secrets (API keys, SES signing keys) are read here and used to
 * sign/authorize the outbound request only — never logged, never returned.
 *
 * MAILCHIMP here means Mailchimp Transactional (Mandrill); the marketing
 * Mailchimp API is not a transactional sender. Until a Mandrill key is the
 * configured provider it simply isn't selected.
 */
import "server-only";
import { getActiveIntegrationConfig, type StoredConfig } from "@/server/integrations";
import { logger } from "@/lib/logger";
import { sesV4AuthHeaders } from "@/server/email/ses-signer";

export interface EmailMessage {
  to: string;
  subject: string;
  /** Plain-text body (always sent — the accessible/deliverable baseline). */
  text: string;
  /** Optional HTML body; when present it is sent alongside the text part. */
  html?: string;
  /** Optional reply-to; defaults to the provider's configured from-address. */
  replyTo?: string;
}

export type SendResult =
  | { ok: true; provider: EmailProvider }
  | { ok: false; reason: "NO_PROVIDER" | "SEND_FAILED"; provider?: EmailProvider };

export type EmailProvider = "SENDGRID" | "AWS_SES" | "MAILCHIMP";

/** Providers in selection-priority order. First enabled+configured one wins. */
const PROVIDER_ORDER: EmailProvider[] = ["SENDGRID", "AWS_SES", "MAILCHIMP"];

/**
 * Whether a usable email provider is currently enabled + configured. Callers
 * that GATE on deliverable email (email verification) use this to fail OPEN:
 * when no provider is set up there is no way to deliver — or receive — a
 * verification link, so verification is skipped rather than locking users out.
 */
export async function hasActiveEmailProvider(): Promise<boolean> {
  return (await resolveProvider()) !== null;
}

interface ResolvedProvider {
  provider: EmailProvider;
  config: StoredConfig;
}

/** Minimal RFC-5322-ish sanity check — providers do the real validation. */
function isEmail(value: string | undefined): value is string {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * AWS region allowlist-by-shape (e.g. `us-east-1`, `eu-west-2`). The SES host
 * is built as `email.${region}.amazonaws.com`, so an unvalidated region would
 * be an (admin-only) SSRF lever — this guard means a malformed region simply
 * disqualifies the SES provider rather than reshaping the outbound host.
 */
function isAwsRegion(value: string | undefined): value is string {
  return typeof value === "string" && /^[a-z]{2}-[a-z]+-\d$/.test(value.trim());
}

/**
 * Find the active email provider and its (decrypted) config. Returns null when
 * none is enabled+configured with the fields that provider needs to send.
 */
async function resolveProvider(): Promise<ResolvedProvider | null> {
  for (const provider of PROVIDER_ORDER) {
    const config = await getActiveIntegrationConfig(provider);
    if (!config) continue;

    // A provider is only usable if it has the credentials it needs to send.
    if (provider === "SENDGRID" && config.API_KEY && isEmail(config.FROM_EMAIL)) {
      return { provider, config };
    }
    if (
      provider === "AWS_SES" &&
      config.ACCESS_KEY_ID &&
      config.SECRET_ACCESS_KEY &&
      isAwsRegion(config.REGION) &&
      isEmail(config.FROM_EMAIL)
    ) {
      return { provider, config };
    }
    if (provider === "MAILCHIMP" && config.API_KEY && isEmail(config.FROM_EMAIL)) {
      return { provider, config };
    }
  }
  return null;
}

/**
 * Send one transactional email through the active provider. Never throws for an
 * expected condition (no provider, provider rejects) — returns a discriminated
 * result so callers can decide whether the absence of email is fatal (it isn't,
 * for reset/confirmation: the reset link is still logged; the booking is still
 * confirmed).
 */
export async function sendEmail(message: EmailMessage): Promise<SendResult> {
  const resolved = await resolveProvider();
  if (!resolved) {
    logger.info("sendEmail skipped — no email integration active", { to: maskAddr(message.to) });
    return { ok: false, reason: "NO_PROVIDER" };
  }

  const { provider, config } = resolved;
  try {
    if (provider === "SENDGRID") await sendViaSendgrid(config, message);
    else if (provider === "AWS_SES") await sendViaSes(config, message);
    else await sendViaMandrill(config, message);
    logger.info("email sent", { provider, to: maskAddr(message.to), subject: message.subject });
    return { ok: true, provider };
  } catch (error) {
    // Log the failure WITHOUT the message body or any credential material.
    logger.error("email send failed", {
      provider,
      to: maskAddr(message.to),
      error: error instanceof Error ? error.message : String(error),
    });
    return { ok: false, reason: "SEND_FAILED", provider };
  }
}

/** `john@example.com` → `j***@example.com`; keep the domain, drop the local PII. */
function maskAddr(email: string): string {
  const at = email.lastIndexOf("@");
  if (at <= 0) return `${email[0] ?? ""}***`;
  return `${email[0]}***${email.slice(at)}`;
}

// ── Provider adapters ───────────────────────────────────────────────────────

const SENDGRID_ENDPOINT = "https://api.sendgrid.com/v3/mail/send";

async function sendViaSendgrid(config: StoredConfig, msg: EmailMessage): Promise<void> {
  const content: { type: string; value: string }[] = [{ type: "text/plain", value: msg.text }];
  // SendGrid requires content ordered text/plain BEFORE text/html.
  if (msg.html) content.push({ type: "text/html", value: msg.html });

  const body = {
    personalizations: [{ to: [{ email: msg.to }], subject: msg.subject }],
    from: { email: config.FROM_EMAIL, name: config.FROM_NAME || undefined },
    ...(msg.replyTo ? { reply_to: { email: msg.replyTo } } : {}),
    subject: msg.subject,
    content,
  };

  const res = await fetch(SENDGRID_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  // SendGrid returns 202 Accepted on success.
  if (res.status !== 202) {
    throw new Error(`SendGrid HTTP ${res.status}`);
  }
}

async function sendViaSes(config: StoredConfig, msg: EmailMessage): Promise<void> {
  const region = config.REGION!;
  const host = `email.${region}.amazonaws.com`;
  // SES v2 SendEmail (Simple content). JSON body, SigV4-signed.
  const payload = JSON.stringify({
    FromEmailAddress: config.FROM_NAME
      ? `${config.FROM_NAME} <${config.FROM_EMAIL}>`
      : config.FROM_EMAIL,
    Destination: { ToAddresses: [msg.to] },
    ...(msg.replyTo ? { ReplyToAddresses: [msg.replyTo] } : {}),
    Content: {
      Simple: {
        Subject: { Data: msg.subject, Charset: "UTF-8" },
        Body: {
          Text: { Data: msg.text, Charset: "UTF-8" },
          ...(msg.html ? { Html: { Data: msg.html, Charset: "UTF-8" } } : {}),
        },
      },
    },
  });

  const path = "/v2/email/outbound-emails";
  const headers = await sesV4AuthHeaders({
    accessKeyId: config.ACCESS_KEY_ID!,
    secretAccessKey: config.SECRET_ACCESS_KEY!,
    region,
    service: "ses",
    method: "POST",
    host,
    path,
    body: payload,
  });

  const res = await fetch(`https://${host}${path}`, { method: "POST", headers, body: payload });
  if (!res.ok) {
    throw new Error(`SES HTTP ${res.status}`);
  }
}

async function sendViaMandrill(config: StoredConfig, msg: EmailMessage): Promise<void> {
  // Mailchimp Transactional (Mandrill) messages.send.
  const body = {
    key: config.API_KEY,
    message: {
      from_email: config.FROM_EMAIL,
      from_name: config.FROM_NAME || undefined,
      to: [{ email: msg.to, type: "to" }],
      subject: msg.subject,
      text: msg.text,
      ...(msg.html ? { html: msg.html } : {}),
      ...(msg.replyTo ? { headers: { "Reply-To": msg.replyTo } } : {}),
    },
  };

  const res = await fetch("https://mandrillapp.com/api/1.0/messages/send.json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`Mandrill HTTP ${res.status}`);
  }
  // Mandrill returns 200 with a per-recipient status array even on rejection.
  const results = (await res.json()) as Array<{ status?: string; reject_reason?: string }> | unknown;
  if (Array.isArray(results)) {
    const bad = results.find((r) => r.status && !["sent", "queued", "scheduled"].includes(r.status));
    if (bad) throw new Error(`Mandrill rejected: ${bad.status}`);
  }
}
