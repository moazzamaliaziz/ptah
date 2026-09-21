"use server";

import { revalidatePath } from "next/cache";
import { requireCapability } from "@/server/auth/rbac";
import { setSetting } from "@/server/settings";
import {
  SETTINGS_SCHEMA,
  type SettingKey,
  type SettingValue,
} from "@/content/settings-schema";
import { writeAudit } from "@/server/audit";

/** useActionState shape shared by the branding form. */
export type BrandingFormState = { ok?: boolean; error?: string };

/** Trimmed string field, or "" when absent. */
function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/**
 * A MediaPicker in "id" mode posts the asset id, or "" when cleared/empty.
 * The `*MediaId` settings are `uuid().nullable()`, so "" must become null.
 */
function mediaId(fd: FormData, key: string): string | null {
  const v = str(fd, key);
  return v === "" ? null : v;
}

/**
 * Validate one key's candidate value against its own zod schema *before* any
 * write, so a single bad field fails the whole submit with a friendly message
 * rather than half-persisting. Returns the parsed value or throws a labelled
 * Error the action catches.
 */
function parseOrThrow<K extends SettingKey>(key: K, candidate: unknown, label: string): SettingValue<K> {
  const result = SETTINGS_SCHEMA[key].schema.safeParse(candidate);
  if (!result.success) {
    const msg = result.error.issues[0]?.message ?? "invalid value";
    throw new Error(`${label}: ${msg}`);
  }
  return result.data as SettingValue<K>;
}

/**
 * Persist every branding / contact / seo setting from one form. Re-checks
 * `branding.edit` server-side (UI gating is not enough). Validates all fields
 * up front, writes them, then records an audit entry naming the fields touched
 * (never their values — copyright/socials are not secret, but the convention
 * stays uniform) and revalidates the public surfaces the settings drive.
 */
export async function updateBrandingAction(
  _prev: BrandingFormState,
  fd: FormData,
): Promise<BrandingFormState> {
  const user = await requireCapability("branding.edit");

  // Parse the socials repeater's hidden JSON payload before validation.
  let socialsRaw: unknown = [];
  try {
    socialsRaw = JSON.parse(str(fd, "socials") || "[]");
  } catch {
    return { error: "Social links are malformed — please re-check the rows." };
  }

  // Build the full key→value set, each validated against its schema.
  let values: { [K in SettingKey]?: SettingValue<K> };
  try {
    values = {
      "branding.siteName": parseOrThrow("branding.siteName", str(fd, "siteName"), "Site name"),
      "branding.tagline": parseOrThrow("branding.tagline", str(fd, "tagline"), "Tagline"),
      "branding.legalName": parseOrThrow("branding.legalName", str(fd, "legalName"), "Legal name"),
      "branding.copyrightLine": parseOrThrow("branding.copyrightLine", str(fd, "copyrightLine"), "Copyright line"),
      "branding.logoMediaId": parseOrThrow("branding.logoMediaId", mediaId(fd, "logoMediaId"), "Header logo"),
      "branding.footerLogoMediaId": parseOrThrow("branding.footerLogoMediaId", mediaId(fd, "footerLogoMediaId"), "Footer logo"),
      "branding.faviconMediaId": parseOrThrow("branding.faviconMediaId", mediaId(fd, "faviconMediaId"), "Favicon"),
      "branding.socials": parseOrThrow("branding.socials", socialsRaw, "Social links"),
      "contact.email": parseOrThrow("contact.email", str(fd, "email"), "Contact email"),
      "contact.phone": parseOrThrow("contact.phone", str(fd, "phone"), "Contact phone"),
      "contact.whatsapp": parseOrThrow("contact.whatsapp", str(fd, "whatsapp"), "WhatsApp number"),
      "seo.ogImageMediaId": parseOrThrow("seo.ogImageMediaId", mediaId(fd, "ogImageMediaId"), "Social share image"),
      "seo.themeColor": parseOrThrow("seo.themeColor", str(fd, "themeColor"), "Theme color"),
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Please check the form values." };
  }

  // All valid — persist. setSetting re-validates + invalidates the cache.
  const keys = Object.keys(values) as SettingKey[];
  for (const key of keys) {
    await setSetting(key, values[key]!);
  }

  await writeAudit({
    actorId: user.id,
    action: "branding.update",
    entity: "site_setting",
    entityId: null,
    meta: { fields: keys },
  });

  // The settings feed the public chrome + document metadata everywhere.
  revalidatePath("/", "layout");
  revalidatePath("/admin/branding");

  return { ok: true };
}
