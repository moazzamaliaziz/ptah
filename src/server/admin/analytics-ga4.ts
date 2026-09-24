/**
 * GA4 Data API client — server-side visitor traffic for admin reports (P7,
 * locked decision 3: website traffic comes from the GA4 Data API).
 *
 * server-only. Self-contained: no extra npm dependency. Google service-account
 * auth is a signed-JWT → access-token exchange (RS256 via node:crypto), then a
 * single `runReport` POST. Credentials live in the existing Integrations vault
 * under the "GA4" key (encrypted at rest), NOT in env — the admin configures
 * Property ID + service-account email + private key in the Integrations screen.
 *
 * EVERY failure path is swallowed into a typed result — this powers one panel on
 * the reports page and must never throw the page. If GA4 isn't set up we say so
 * plainly ("not_configured") so the UI can link the admin to Integrations.
 */
import "server-only";
import crypto from "node:crypto";
import { getActiveIntegrationConfig } from "@/server/integrations";
import { logger } from "@/lib/logger";

export interface Ga4CountryRow {
  country: string;
  sessions: number;
  activeUsers: number;
}

export type Ga4TrafficResult =
  | { ok: true; rows: Ga4CountryRow[] }
  | { ok: false; reason: "not_configured" | "error"; message: string };

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const TIMEOUT_MS = 8000;

function b64url(input: string | Buffer): string {
  return Buffer.from(input).toString("base64url");
}

/** Build + sign the service-account assertion JWT (RS256). */
function makeAssertion(clientEmail: string, privateKeyPem: string): string {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(
    JSON.stringify({
      iss: clientEmail,
      scope: SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  );
  const signingInput = `${header}.${claim}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(signingInput);
  signer.end();
  // A private key pasted from a Google JSON key often has escaped newlines.
  const key = privateKeyPem.includes("\\n") ? privateKeyPem.replace(/\\n/g, "\n") : privateKeyPem;
  const signature = signer.sign(key).toString("base64url");
  return `${signingInput}.${signature}`;
}

async function postJson(
  url: string,
  body: string,
  headers: Record<string, string>,
): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { method: "POST", headers, body, signal: controller.signal });
    const json = (await res.json().catch(() => null)) as unknown;
    if (!res.ok) {
      const detail =
        json && typeof json === "object" && "error" in json ? JSON.stringify(json) : `HTTP ${res.status}`;
      throw new Error(detail);
    }
    return json;
  } finally {
    clearTimeout(timer);
  }
}

/** Exchange the signed assertion for a short-lived OAuth access token. */
async function fetchAccessToken(clientEmail: string, privateKeyPem: string): Promise<string> {
  const assertion = makeAssertion(clientEmail, privateKeyPem);
  const params = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion,
  });
  const json = await postJson(TOKEN_URL, params.toString(), {
    "content-type": "application/x-www-form-urlencoded",
  });
  const token =
    json && typeof json === "object" && "access_token" in json
      ? (json as { access_token: unknown }).access_token
      : null;
  if (typeof token !== "string" || !token) throw new Error("token endpoint returned no access_token");
  return token;
}

/** GA4 accepts either YYYY-MM-DD or NdaysAgo/today. */
function startDateFor(since: Date | null): string {
  if (!since) return "365daysAgo"; // GA4 standard retention caps all-time anyway
  return since.toISOString().slice(0, 10);
}

interface Ga4Row {
  dimensionValues?: { value?: string }[];
  metricValues?: { value?: string }[];
}

/**
 * Visitor sessions + active users by country from GA4, for the given range.
 * Returns a typed result; callers render the panel from `ok`.
 */
export async function getGa4CountryTraffic(since: Date | null): Promise<Ga4TrafficResult> {
  const config = await getActiveIntegrationConfig("GA4");
  const propertyId = config?.PROPERTY_ID?.trim();
  const clientEmail = config?.SA_CLIENT_EMAIL?.trim();
  const privateKey = config?.SA_PRIVATE_KEY;
  if (!propertyId || !clientEmail || !privateKey) {
    return {
      ok: false,
      reason: "not_configured",
      message:
        "Add the GA4 Property ID, service-account email and private key in Integrations, and enable GA4.",
    };
  }

  try {
    const token = await fetchAccessToken(clientEmail, privateKey);
    const numericId = propertyId.replace(/^properties\//, "");
    const json = await postJson(
      `https://analyticsdata.googleapis.com/v1beta/properties/${numericId}:runReport`,
      JSON.stringify({
        dateRanges: [{ startDate: startDateFor(since), endDate: "today" }],
        dimensions: [{ name: "country" }],
        metrics: [{ name: "sessions" }, { name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        limit: 50,
      }),
      { authorization: `Bearer ${token}`, "content-type": "application/json" },
    );

    const rawRows: Ga4Row[] =
      json && typeof json === "object" && Array.isArray((json as { rows?: unknown }).rows)
        ? ((json as { rows: Ga4Row[] }).rows ?? [])
        : [];
    const rows: Ga4CountryRow[] = rawRows.map((r) => ({
      country: r.dimensionValues?.[0]?.value || "(not set)",
      sessions: Number(r.metricValues?.[0]?.value ?? 0) || 0,
      activeUsers: Number(r.metricValues?.[1]?.value ?? 0) || 0,
    }));
    return { ok: true, rows };
  } catch (error) {
    // Log only the message — the failing path handles the SA private key, so the
    // raw error object must never be spread into the logs.
    logger.error("GA4 runReport failed", { error: error instanceof Error ? error.message : "unknown" });
    return {
      ok: false,
      reason: "error",
      message: "Could not reach Google Analytics. Check the GA4 credentials and Property ID.",
    };
  }
}
