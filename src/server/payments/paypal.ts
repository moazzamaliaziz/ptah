/**
 * Server-side PayPal REST client (Wave 2, SP3) — Orders v2, server-to-server.
 *
 * Mirrors the Stripe integration's posture:
 *   - credentials are VAULT-FIRST (admin Integrations → key "PAYPAL", AES-256-GCM
 *     at rest); there is no env fallback (PayPal is admin-configured only),
 *   - everything returns null / throws cleanly when PayPal is not configured so
 *     the commerce flow degrades gracefully,
 *   - card data never touches this app — the buyer approves on PayPal's hosted
 *     pages (redirect), so there is no client SDK and no CSP change.
 *
 * Money crosses the PayPal API as decimal strings; internally we stay in integer
 * cents and convert only at the boundary.
 */
import "server-only";
import { getActiveIntegrationConfig } from "@/server/integrations";
import { logger } from "@/lib/logger";

const LIVE_BASE = "https://api-m.paypal.com";
const SANDBOX_BASE = "https://api-m.sandbox.paypal.com";

export interface PaypalCredentials {
  clientId: string;
  clientSecret: string;
  baseUrl: string;
  /** Needed to verify inbound webhook signatures; null disables the webhook. */
  webhookId: string | null;
}

/** Resolve PayPal credentials from the vault, or null when not enabled/configured. */
export async function resolvePaypalCredentials(): Promise<PaypalCredentials | null> {
  const cfg = await getActiveIntegrationConfig("PAYPAL");
  if (!cfg) return null;
  const clientId = cfg.CLIENT_ID?.trim();
  const clientSecret = cfg.CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return null;
  const live = (cfg.ENVIRONMENT?.trim().toLowerCase() ?? "sandbox") === "live";
  return {
    clientId,
    clientSecret,
    baseUrl: live ? LIVE_BASE : SANDBOX_BASE,
    webhookId: cfg.WEBHOOK_ID?.trim() || null,
  };
}

/** Whether PayPal is configured enough to start a checkout. */
export async function isPaypalConfigured(): Promise<boolean> {
  return (await resolvePaypalCredentials()) !== null;
}

// ── OAuth token (cached per-process until shortly before expiry) ─────────────

const globalForPaypal = globalThis as unknown as {
  __ptahPaypalToken?: { key: string; token: string; expires: number };
};

/**
 * Fetch (and cache) an OAuth token, or null when PayPal will not issue one.
 *
 * Returns null rather than throwing, which is this module's whole contract:
 * every exported function promises null/false when PayPal cannot be reached, so
 * the commerce flow degrades. It previously threw on a non-OK response, and
 * nothing up the stack caught it — a wrong client id, a secret rotated in the
 * PayPal dashboard, or a sandbox key set to "live" (all of which answer 401
 * here) took the whole checkout page down with the generic error boundary,
 * AFTER the booking row and its seat claim already existed. The customer saw a
 * crash and never learned they had a held booking.
 */
async function getAccessToken(creds: PaypalCredentials): Promise<string | null> {
  const cacheKey = `${creds.baseUrl}:${creds.clientId}`;
  const cached = globalForPaypal.__ptahPaypalToken;
  if (cached && cached.key === cacheKey && cached.expires > Date.now()) return cached.token;

  const basic = Buffer.from(`${creds.clientId}:${creds.clientSecret}`).toString("base64");
  try {
    const res = await fetch(`${creds.baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    if (!res.ok) {
      // 401 here is nearly always a credential problem; name it in the log so
      // the cause is obvious without reproducing against live PayPal.
      logger.error("paypal token request rejected", {
        status: res.status,
        hint: res.status === 401 ? "check CLIENT_ID/CLIENT_SECRET and the sandbox/live ENVIRONMENT setting" : undefined,
      });
      return null;
    }
    const json = (await res.json()) as { access_token?: string; expires_in?: number };
    if (!json.access_token) {
      logger.error("paypal token response carried no access_token");
      return null;
    }
    // Refresh a minute early to avoid using a token that expires mid-request.
    globalForPaypal.__ptahPaypalToken = {
      key: cacheKey,
      token: json.access_token,
      expires: Date.now() + Math.max(0, ((json.expires_in ?? 60) - 60) * 1000),
    };
    return json.access_token;
  } catch (error) {
    // DNS/TLS/timeout — a network blip must not become a 500 either.
    logger.error("paypal token request failed", { error });
    return null;
  }
}

/** Integer cents → PayPal's 2-decimal string (app currencies are 2-decimal). */
function centsToDecimal(cents: number): string {
  return (cents / 100).toFixed(2);
}

// ── Orders v2 ────────────────────────────────────────────────────────────────

export interface CreateOrderInput {
  amountCents: number;
  currency: string;
  /** Our booking id — echoed back on capture + webhook for correlation. */
  referenceId: string;
  description: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface CreatedOrder {
  orderId: string;
  approveUrl: string;
}

/** Create a CAPTURE-intent order and return its id + buyer approval URL. */
export async function createOrder(input: CreateOrderInput): Promise<CreatedOrder | null> {
  const creds = await resolvePaypalCredentials();
  if (!creds) return null;
  const token = await getAccessToken(creds);
  if (!token) return null;

  try {
  const res = await fetch(`${creds.baseUrl}/v2/checkout/orders`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: input.referenceId,
          custom_id: input.referenceId,
          description: input.description.slice(0, 127),
          amount: {
            currency_code: input.currency.toUpperCase(),
            value: centsToDecimal(input.amountCents),
          },
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            shipping_preference: "NO_SHIPPING",
            user_action: "PAY_NOW",
            return_url: input.returnUrl,
            cancel_url: input.cancelUrl,
          },
        },
      },
    }),
  });

  if (!res.ok) {
    // PayPal explains the rejection in the body (unsupported currency for the
    // account, a malformed amount); without it the log says nothing useful.
    const detail = await res.text().catch(() => "");
    logger.error("paypal createOrder failed", { status: res.status, detail: detail.slice(0, 500) });
    return null;
  }
  const json = (await res.json()) as {
    id: string;
    links?: { rel: string; href: string }[];
  };
  const approve = json.links?.find((l) => l.rel === "approve" || l.rel === "payer-action");
  if (!approve) {
    logger.error("paypal createOrder returned no approve link", { orderId: json.id });
    return null;
  }
  return { orderId: json.id, approveUrl: approve.href };
  } catch (error) {
    logger.error("paypal createOrder threw", { error });
    return null;
  }
}

export interface CaptureResult {
  status: string; // "COMPLETED" on success
  captureId: string | null;
  amountCents: number | null;
  currency: string | null;
  referenceId: string | null;
  raw: unknown;
}

/** Capture an approved order (idempotent enough: a second capture 4xx's). */
export async function captureOrder(orderId: string): Promise<CaptureResult | null> {
  const creds = await resolvePaypalCredentials();
  if (!creds) return null;
  const token = await getAccessToken(creds);
  if (!token) return null;

  const res = await fetch(`${creds.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  const raw = await res.json().catch(() => ({}));
  if (!res.ok) {
    logger.warn("paypal captureOrder non-2xx", { orderId, status: res.status });
    return null;
  }
  return parseCapture(raw);
}

/** Read an order's current state without capturing (used on webhook confirm). */
export async function getOrder(orderId: string): Promise<CaptureResult | null> {
  const creds = await resolvePaypalCredentials();
  if (!creds) return null;
  const token = await getAccessToken(creds);
  if (!token) return null;
  const res = await fetch(`${creds.baseUrl}/v2/checkout/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const raw = await res.json().catch(() => ({}));
  if (!res.ok) return null;
  return parseCapture(raw);
}

interface PaypalOrderShape {
  status?: string;
  purchase_units?: {
    reference_id?: string;
    custom_id?: string;
    payments?: {
      captures?: {
        id?: string;
        status?: string;
        amount?: { value?: string; currency_code?: string };
      }[];
    };
  }[];
}

function parseCapture(raw: unknown): CaptureResult {
  const order = raw as PaypalOrderShape;
  const unit = order.purchase_units?.[0];
  const capture = unit?.payments?.captures?.[0];
  const value = capture?.amount?.value;
  return {
    status: capture?.status ?? order.status ?? "UNKNOWN",
    captureId: capture?.id ?? null,
    amountCents: value !== undefined ? Math.round(Number.parseFloat(value) * 100) : null,
    currency: capture?.amount?.currency_code ?? null,
    referenceId: unit?.reference_id ?? unit?.custom_id ?? null,
    raw,
  };
}

/** Refund a completed capture in full. Returns true on success. */
export async function refundCapture(captureId: string): Promise<boolean> {
  const creds = await resolvePaypalCredentials();
  if (!creds) return false;
  const token = await getAccessToken(creds);
  if (!token) return false;
  const res = await fetch(`${creds.baseUrl}/v2/payments/captures/${captureId}/refund`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: "{}",
  });
  if (!res.ok) {
    logger.error("paypal refundCapture failed", { captureId, status: res.status });
    return false;
  }
  return true;
}

// ── Webhook signature verification ───────────────────────────────────────────

export interface PaypalWebhookHeaders {
  transmissionId: string | null;
  transmissionTime: string | null;
  certUrl: string | null;
  authAlgo: string | null;
  transmissionSig: string | null;
}

/**
 * Verify a webhook via PayPal's verify-webhook-signature API. Returns false when
 * any header is missing, the webhook id is unset, or PayPal does not return
 * "SUCCESS" — the caller then rejects the event (never trusts an unverified one).
 * `rawBody` is the exact bytes received; it is re-parsed as the `webhook_event`.
 */
export async function verifyWebhookSignature(
  headers: PaypalWebhookHeaders,
  rawBody: string,
): Promise<boolean> {
  const creds = await resolvePaypalCredentials();
  if (!creds || !creds.webhookId) return false;
  if (
    !headers.transmissionId ||
    !headers.transmissionTime ||
    !headers.certUrl ||
    !headers.authAlgo ||
    !headers.transmissionSig
  ) {
    return false;
  }

  let event: unknown;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return false;
  }

  const token = await getAccessToken(creds);
  // No token ⇒ the signature cannot be verified. Refuse: an unverified webhook
  // must never be treated as genuine, since it confirms bookings and money.
  if (!token) return false;
  const res = await fetch(`${creds.baseUrl}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      transmission_id: headers.transmissionId,
      transmission_time: headers.transmissionTime,
      cert_url: headers.certUrl,
      auth_algo: headers.authAlgo,
      transmission_sig: headers.transmissionSig,
      webhook_id: creds.webhookId,
      webhook_event: event,
    }),
  });
  if (!res.ok) {
    logger.warn("paypal verify-webhook-signature non-2xx", { status: res.status });
    return false;
  }
  const json = (await res.json()) as { verification_status?: string };
  return json.verification_status === "SUCCESS";
}
