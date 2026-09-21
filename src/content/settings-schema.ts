/**
 * Typed key-value site-settings contract (Phase 7 — Subsystem 1 foundations).
 *
 * The `site_settings` table (schema `SiteSetting`) is the runtime source of
 * truth for editor-controlled globals that are NOT landing sections
 * (`ContentSection`), booleans (`SiteToggle`), or third-party credentials
 * (`Integration`). Each row is `{ key, value }` where `value` is a JSON-encoded
 * string validated against the per-key zod schema below on read.
 *
 * This module is intentionally free of `server-only` / DB / Next imports so the
 * schema + defaults are unit-testable in the Phase 7 probe and importable from
 * both the server read layer (src/server/settings.ts) and client editors.
 *
 * SECURITY: no key here ever stores a secret — credentials stay in the AES
 * vault (`Integration`). Every href-bearing field is scheme-allowlisted via
 * `safeUrl` (blocks javascript:/data:). Defaults mirror the current hardcoded
 * SSOT (content/landing.ts) so a fresh DB (no rows) renders identically.
 */
import { z } from "zod";
import { siteMeta, footerContent } from "@/content/landing";
import { SAFE_URL_RE } from "@/lib/safe-url";

/** Social icon keys the footer can render (subset of Icon.tsx that reads as a brand). */
export const SOCIAL_ICON_KEYS = [
  "facebook",
  "instagram",
  "threads",
  "youtube",
  "pinterest",
  "tiktok",
  "x",
  "mail",
] as const;
export type SocialIconKey = (typeof SOCIAL_ICON_KEYS)[number];

const safeUrl = z
  .string()
  .trim()
  .refine((v) => SAFE_URL_RE.test(v), {
    message: "URL must be a relative path (/…), https://, mailto:, or tel:",
  });

/** One footer social link. */
export const socialLinkSchema = z.object({
  label: z.string().trim().min(1).max(60),
  href: safeUrl.pipe(z.string().max(512)),
  iconKey: z.enum(SOCIAL_ICON_KEYS),
});
export type SocialLink = z.infer<typeof socialLinkSchema>;

/** #rgb / #rrggbb hex color (theme-color meta + widget defaults). */
const hexColor = z
  .string()
  .trim()
  .regex(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Must be a hex color like #1a2340");

/** A MediaAsset id (uuid) or null → fall back to the built-in inline asset. */
const mediaIdOrNull = z.uuid().nullable();

/** Optional contact email — "" clears it; otherwise must be a valid address. */
const optionalEmail = z
  .string()
  .trim()
  .transform((v) => v)
  .pipe(z.union([z.literal(""), z.email()]));

/**
 * The setting registry. Each entry pairs a zod `schema` (validated on write and
 * on read) with a typed `fallback` (returned when the row is absent or invalid).
 * `key` is the DB primary key (dotted namespace).
 */
export const SETTINGS_SCHEMA = {
  "branding.siteName": {
    schema: z.string().trim().min(1).max(120),
    fallback: siteMeta.name,
  },
  "branding.tagline": {
    schema: z.string().trim().min(1).max(200),
    fallback: siteMeta.tagline,
  },
  "branding.legalName": {
    schema: z.string().trim().min(1).max(200),
    fallback: siteMeta.legalName,
  },
  "branding.logoMediaId": {
    schema: mediaIdOrNull,
    fallback: null as string | null,
  },
  "branding.footerLogoMediaId": {
    schema: mediaIdOrNull,
    fallback: null as string | null,
  },
  "branding.faviconMediaId": {
    schema: mediaIdOrNull,
    fallback: null as string | null,
  },
  "branding.socials": {
    schema: z.array(socialLinkSchema).max(12),
    fallback: footerContent.socials.map((s) => ({
      label: s.network,
      href: s.href,
      iconKey: s.iconKey as SocialIconKey,
    })) satisfies SocialLink[],
  },
  "branding.copyrightLine": {
    // `{year}` is substituted at render time.
    schema: z.string().trim().min(1).max(200),
    fallback: footerContent.copyrightLine,
  },
  "contact.email": {
    // Resolves the legacy privacy@ptah-tours.com vs hello@ptahtours.com split:
    // the SSOT footer social uses hello@ptahtours.com — adopt it as canonical.
    schema: optionalEmail,
    fallback: "hello@ptahtours.com",
  },
  "contact.phone": {
    // Empty by default — admin sets the real number; drives footer + widgets.
    schema: z.string().trim().max(40),
    fallback: "",
  },
  "contact.whatsapp": {
    schema: z.string().trim().max(40),
    fallback: "",
  },
  "seo.ogImageMediaId": {
    schema: mediaIdOrNull,
    fallback: null as string | null,
  },
  "seo.themeColor": {
    schema: hexColor,
    fallback: "#1a2340", // --color-nile (tokens.css)
  },
} as const;

export type SettingKey = keyof typeof SETTINGS_SCHEMA;

/** All setting keys as a runtime array (for iteration + membership checks). */
export const SETTING_KEYS = Object.keys(SETTINGS_SCHEMA) as SettingKey[];

/** The resolved value type for a given key (inferred from its zod schema). */
export type SettingValue<K extends SettingKey> = z.infer<
  (typeof SETTINGS_SCHEMA)[K]["schema"]
>;

/** A fully-resolved settings map (every key present with a valid value). */
export type SettingsMap = {
  [K in SettingKey]: SettingValue<K>;
};

/** Build a fresh defaults map (deep-cloned so callers can never mutate the SSOT). */
export function settingsDefaults(): SettingsMap {
  const out = {} as SettingsMap;
  for (const key of SETTING_KEYS) {
    // structuredClone keeps array/object fallbacks (socials) isolated per copy.
    (out as Record<string, unknown>)[key] = structuredClone(
      SETTINGS_SCHEMA[key].fallback,
    );
  }
  return out;
}
