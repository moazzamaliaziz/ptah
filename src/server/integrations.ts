/**
 * Integrations vault (Phase 2, Q14; schema `Integration`).
 *
 * The 20 third-party integrations are DB-driven: each has an on/off switch and
 * an encrypted credential blob (`integrations.config_encrypted`, AES-256-GCM
 * via src/lib/secret-box). Hard rules:
 *   - SECRET field values NEVER leave the server. The admin view returns only
 *     a "set / not set" flag for secret fields (API keys, tokens, webhook
 *     secrets); non-secret config (public ids, regions) is returned as-is.
 *   - Decrypted credentials are read ONLY by server-side vendor calls
 *     (`getIntegrationConfig`), never serialized into a client payload.
 *   - Saving a secret with an empty input leaves the stored value unchanged
 *     (so re-saving the form does not wipe credentials the admin can't see).
 */
import "server-only";
import { db } from "@/lib/db";
import { openJson, sealJson } from "@/lib/secret-box";

export type IntegrationCategory =
  | "analytics"
  | "payments"
  | "security"
  | "email"
  | "sms"
  | "maps"
  | "reviews"
  | "monitoring"
  | "automation";

export interface IntegrationField {
  name: string;
  label: string;
  /** Secret fields are write-only from the UI: never returned, masked as "set". */
  secret: boolean;
  placeholder?: string;
  /** Optional plain-language help shown as a "?" hint next to the field (P8). */
  help?: string;
  /**
   * Fixed choices. When present the admin renders a <select> instead of a text
   * box, and `fallback` is what an empty stored value means at runtime — so the
   * control shows the value actually in force rather than a greyed-out
   * placeholder that merely looks like one.
   */
  options?: readonly { value: string; label: string }[];
  /** The effective value when nothing is stored. Only meaningful with options. */
  fallback?: string;
}

export interface IntegrationDef {
  key: string;
  label: string;
  category: IntegrationCategory;
  fields: readonly IntegrationField[];
}

/** Registry of all 20 integrations — the seed's INTEGRATION_KEYS, described. */
export const INTEGRATIONS: readonly IntegrationDef[] = [
  { key: "GA4", label: "Google Analytics 4", category: "analytics", fields: [
    { name: "MEASUREMENT_ID", label: "Measurement ID (site tag)", secret: false, placeholder: "G-XXXXXXX", help: "Starts with 'G-'. This turns on visitor tracking on the public site. Found in Google Analytics under Admin → Data streams." },
    // Data API (server-side reporting for the admin Reports page). Optional —
    // only needed to show website traffic by country; the site tag works alone.
    { name: "PROPERTY_ID", label: "Property ID (Data API)", secret: false, placeholder: "123456789", help: "Only needed to show website traffic on the Reports page. The numeric property ID from Google Analytics → Admin → Property settings." },
    { name: "SA_CLIENT_EMAIL", label: "Service-account email (Data API)", secret: false, placeholder: "reporting@project.iam.gserviceaccount.com", help: "From a Google Cloud service-account JSON key file (the 'client_email' field). Give this email 'Viewer' access to the Analytics property." },
    { name: "SA_PRIVATE_KEY", label: "Service-account private key (Data API)", secret: true, placeholder: "-----BEGIN PRIVATE KEY-----", help: "The 'private_key' from the same JSON key file. Paste the whole thing including the BEGIN/END lines. Stored encrypted." },
  ] },
  { key: "GTM", label: "Google Tag Manager", category: "analytics", fields: [{ name: "CONTAINER_ID", label: "Container ID", secret: false, placeholder: "GTM-XXXXXX" }] },
  { key: "META_PIXEL", label: "Meta Pixel", category: "analytics", fields: [{ name: "PIXEL_ID", label: "Pixel ID", secret: false }] },
  { key: "STRIPE", label: "Stripe", category: "payments", fields: [
    { name: "PUBLISHABLE_KEY", label: "Publishable key", secret: false, placeholder: "pk_live_…" },
    { name: "SECRET_KEY", label: "Secret key", secret: true, placeholder: "sk_live_…" },
    { name: "WEBHOOK_SECRET", label: "Webhook signing secret", secret: true, placeholder: "whsec_…", help: "Starts with 'whsec_'. Stripe gives you this when you add the webhook endpoint. It lets the site trust that a payment update really came from Stripe." },
  ] },
  { key: "PAYMOB", label: "Paymob", category: "payments", fields: [
    { name: "API_KEY", label: "API key", secret: true },
    { name: "INTEGRATION_ID", label: "Integration ID", secret: false },
  ] },
  { key: "PAYPAL", label: "PayPal", category: "payments", fields: [
    { name: "CLIENT_ID", label: "Client ID", secret: false },
    { name: "CLIENT_SECRET", label: "Client secret", secret: true },
    {
      name: "ENVIRONMENT",
      label: "Environment",
      secret: false,
      options: [
        { value: "sandbox", label: "Sandbox (testing)" },
        { value: "live", label: "Live (real payments)" },
      ],
      fallback: "sandbox",
      help: "Must match the credentials above: sandbox keys only work with Sandbox, live keys only with Live. A mismatch makes PayPal reject the Client ID and Secret, and checkout cannot start.",
    },
    { name: "WEBHOOK_ID", label: "Webhook ID (for signature verification)", secret: false, help: "The ID of the webhook you created in the PayPal dashboard. Lets the site confirm payment updates really came from PayPal." },
  ] },
  { key: "RECAPTCHA", label: "reCAPTCHA v3", category: "security", fields: [
    { name: "SITE_KEY", label: "Site key", secret: false },
    { name: "SECRET_KEY", label: "Secret key", secret: true },
  ] },
  { key: "TURNSTILE", label: "Cloudflare Turnstile", category: "security", fields: [
    { name: "SITE_KEY", label: "Site key", secret: false },
    { name: "SECRET_KEY", label: "Secret key", secret: true },
  ] },
  { key: "MAILCHIMP", label: "Mailchimp", category: "email", fields: [
    { name: "API_KEY", label: "API key", secret: true },
    { name: "AUDIENCE_ID", label: "Audience ID", secret: false },
  ] },
  { key: "SENDGRID", label: "SendGrid", category: "email", fields: [
    { name: "API_KEY", label: "API key", secret: true, placeholder: "SG.…" },
    { name: "FROM_EMAIL", label: "From address", secret: false, placeholder: "bookings@ptahtours.com" },
    { name: "FROM_NAME", label: "From name", secret: false, placeholder: "Ptah Tours" },
  ] },
  { key: "AWS_SES", label: "AWS SES", category: "email", fields: [
    { name: "ACCESS_KEY_ID", label: "Access key ID", secret: false },
    { name: "SECRET_ACCESS_KEY", label: "Secret access key", secret: true },
    { name: "REGION", label: "Region", secret: false, placeholder: "us-east-1" },
    { name: "FROM_EMAIL", label: "From address", secret: false, placeholder: "bookings@ptahtours.com" },
    { name: "FROM_NAME", label: "From name", secret: false, placeholder: "Ptah Tours" },
  ] },
  { key: "TWILIO", label: "Twilio", category: "sms", fields: [
    { name: "ACCOUNT_SID", label: "Account SID", secret: false },
    { name: "AUTH_TOKEN", label: "Auth token", secret: true },
    { name: "FROM_NUMBER", label: "From number", secret: false, placeholder: "+1…" },
  ] },
  { key: "WHATSAPP", label: "WhatsApp Business API", category: "sms", fields: [
    { name: "PHONE_NUMBER_ID", label: "Phone number ID", secret: false },
    { name: "ACCESS_TOKEN", label: "Access token", secret: true },
  ] },
  { key: "GOOGLE_MAPS", label: "Google Maps", category: "maps", fields: [{ name: "API_KEY", label: "API key", secret: true }] },
  { key: "MAPBOX", label: "Mapbox", category: "maps", fields: [{ name: "ACCESS_TOKEN", label: "Access token", secret: true }] },
  { key: "TRIPADVISOR", label: "Tripadvisor", category: "reviews", fields: [{ name: "API_KEY", label: "API key", secret: true }] },
  { key: "TRUSTPILOT", label: "Trustpilot", category: "reviews", fields: [
    { name: "API_KEY", label: "API key", secret: true },
    { name: "BUSINESS_UNIT_ID", label: "Business unit ID", secret: false },
  ] },
  { key: "HOTJAR", label: "Hotjar", category: "analytics", fields: [{ name: "SITE_ID", label: "Site ID", secret: false }] },
  { key: "SENTRY", label: "Sentry", category: "monitoring", fields: [
    { name: "DSN", label: "DSN", secret: false },
    { name: "AUTH_TOKEN", label: "Auth token", secret: true },
  ] },
  { key: "ZAPIER", label: "Zapier", category: "automation", fields: [{ name: "WEBHOOK_URL", label: "Inbound webhook URL", secret: true }] },
] as const;

const BY_KEY = new Map(INTEGRATIONS.map((i) => [i.key, i]));

export type StoredConfig = Record<string, string>;

export interface IntegrationFieldView extends IntegrationField {
  /** Value for non-secret fields; always "" for secret fields. */
  value: string;
  /** Whether a (secret or non-secret) value is currently stored. */
  isSet: boolean;
}

export interface IntegrationView {
  key: string;
  label: string;
  category: IntegrationCategory;
  enabled: boolean;
  configured: boolean;
  updatedAt: string | null;
  fields: IntegrationFieldView[];
}

/** Server-only: decrypt an integration's full credential record for vendor use. */
export async function getIntegrationConfig(key: string): Promise<StoredConfig | null> {
  const row = await db.integration.findUnique({ where: { key }, select: { configEncrypted: true } });
  if (!row) return null;
  return openJson<StoredConfig>(row.configEncrypted);
}

/** Whether an integration is enabled AND has stored config (safe to invoke). */
export async function isIntegrationActive(key: string): Promise<boolean> {
  const row = await db.integration.findUnique({ where: { key }, select: { enabled: true, configEncrypted: true } });
  return !!row?.enabled && !!row.configEncrypted;
}

/**
 * Server-only: decrypt an integration's config ONLY when it is enabled (one DB
 * read). Returns null when the integration is disabled or unconfigured — the
 * shape the mailer/vendor callers want ("give me usable credentials or
 * nothing"), so a single disabled vendor never has its config acted on.
 */
export async function getActiveIntegrationConfig(key: string): Promise<StoredConfig | null> {
  const row = await db.integration.findUnique({
    where: { key },
    select: { enabled: true, configEncrypted: true },
  });
  if (!row?.enabled || !row.configEncrypted) return null;
  return openJson<StoredConfig>(row.configEncrypted);
}

/** Admin list — secrets masked to "set/not set", never their values. */
export async function listIntegrationsForAdmin(): Promise<IntegrationView[]> {
  const rows = await db.integration.findMany({
    select: { key: true, enabled: true, configEncrypted: true, updatedAt: true },
  });
  const rowByKey = new Map(rows.map((r) => [r.key, r]));

  return INTEGRATIONS.map((def) => {
    const row = rowByKey.get(def.key);
    const config = row ? openJson<StoredConfig>(row.configEncrypted) ?? {} : {};
    const fields: IntegrationFieldView[] = def.fields.map((f) => {
      const stored = config[f.name] ?? "";
      const isSet = stored.length > 0;
      return { ...f, value: f.secret ? "" : stored, isSet };
    });
    return {
      key: def.key,
      label: def.label,
      category: def.category,
      enabled: row?.enabled ?? false,
      configured: fields.some((f) => f.isSet),
      updatedAt: row?.updatedAt.toISOString() ?? null,
      fields,
    };
  });
}

/**
 * Persist an integration's enabled flag and credential fields.
 * `input` maps field name → new value. Empty/undefined input for a SECRET
 * field leaves the stored value unchanged; for a non-secret field it is set
 * (so non-secret fields are clearable). Unknown field names are ignored.
 */
export async function saveIntegration(
  key: string,
  enabled: boolean,
  input: Record<string, string | undefined>,
): Promise<void> {
  const def = BY_KEY.get(key);
  if (!def) throw new Error(`Unknown integration key: ${key}`);

  const existing = (await getIntegrationConfig(key)) ?? {};
  const next: StoredConfig = { ...existing };

  for (const field of def.fields) {
    const raw = input[field.name];
    const value = typeof raw === "string" ? raw.trim() : undefined;
    if (field.secret) {
      // Only overwrite a secret when a non-empty value was actually typed.
      if (value) next[field.name] = value;
    } else if (value !== undefined) {
      if (value) next[field.name] = value;
      else delete next[field.name];
    }
  }

  const configEncrypted = Object.keys(next).length > 0 ? sealJson(next) : null;
  await db.integration.upsert({
    where: { key },
    update: { enabled, configEncrypted },
    create: { key, enabled, configEncrypted },
  });
}

/** Toggle only the enabled flag (leaves credentials untouched). */
export async function setIntegrationEnabled(key: string, enabled: boolean): Promise<void> {
  if (!BY_KEY.has(key)) throw new Error(`Unknown integration key: ${key}`);
  await db.integration.upsert({
    where: { key },
    update: { enabled },
    create: { key, enabled },
  });
}
