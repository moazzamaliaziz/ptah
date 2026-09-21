"use server";

import { revalidatePath } from "next/cache";
import { requireCapability } from "@/server/auth/rbac";
import {
  LANDING_SECTIONS,
  saveLandingSection,
  resetLandingSection,
} from "@/server/content";
import type { LandingSectionKey } from "@/content/landing-schema";
import { writeAudit } from "@/server/audit";

export type ContentSaveState = { ok?: boolean; error?: string };

function isSectionKey(key: string): key is LandingSectionKey {
  return Object.prototype.hasOwnProperty.call(LANDING_SECTIONS, key);
}

/** useActionState-compatible: validates + persists a landing section override. */
export async function saveContentAction(
  _prev: ContentSaveState,
  formData: FormData,
): Promise<ContentSaveState> {
  const user = await requireCapability("content.edit");

  const key = String(formData.get("key") ?? "");
  const json = String(formData.get("json") ?? "");
  if (!isSectionKey(key)) return { error: "Unknown section." };

  const result = await saveLandingSection(key, json);
  if (!result.ok) return { error: result.error };

  await writeAudit({ actorId: user.id, action: "content.update", entity: "content_section", entityId: `landing.${key}` });
  revalidatePath("/");
  revalidatePath("/admin/content");
  revalidatePath(`/admin/content/${key}`);
  return { ok: true };
}

/** Remove an override so the SSOT default is served again. */
export async function resetContentAction(formData: FormData): Promise<void> {
  const user = await requireCapability("content.edit");
  const key = String(formData.get("key") ?? "");
  if (!isSectionKey(key)) return;

  await resetLandingSection(key);
  await writeAudit({ actorId: user.id, action: "content.reset", entity: "content_section", entityId: `landing.${key}` });
  revalidatePath("/");
  revalidatePath("/admin/content");
  revalidatePath(`/admin/content/${key}`);
}
