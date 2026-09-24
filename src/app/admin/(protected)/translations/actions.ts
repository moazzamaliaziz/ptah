"use server";

import { revalidatePath } from "next/cache";
import { requireCapability } from "@/server/auth/rbac";
import { writeAudit } from "@/server/audit";
import { saveRecordTranslations } from "@/server/admin/translations-admin";
import { getTranslatableModel } from "@/content/translatable-fields";

export type TranslationFormState = { ok?: boolean; error?: string };

const str = (fd: FormData, key: string): string => String(fd.get(key) ?? "");

/**
 * Save one record's translations for one locale.
 *
 * Field inputs are namespaced `field.<name>` in the form so they never collide
 * with the control inputs (`model`/`recordId`/`locale`); we read them back
 * using the registry field list for the posted model. `saveRecordTranslations`
 * enforces the real rules (unknown model, English rejected, per-field
 * upsert/clear) — this action only adapts the form, authorizes, audits and
 * revalidates.
 */
export async function saveTranslationsAction(
  _prev: TranslationFormState,
  fd: FormData,
): Promise<TranslationFormState> {
  const user = await requireCapability("content.edit");
  const model = str(fd, "model");
  const recordId = str(fd, "recordId");
  const locale = str(fd, "locale");

  const def = getTranslatableModel(model);
  if (!def) return { error: "Unknown content type." };

  const values: Record<string, string> = {};
  for (const f of def.fields) values[f.name] = str(fd, `field.${f.name}`);

  const result = await saveRecordTranslations(model, recordId, locale, values);
  if (!result.ok) return { error: result.error };

  await writeAudit({
    actorId: user.id,
    action: "translation.save",
    entity: model,
    entityId: recordId,
    meta: { locale },
  });

  // A translation can surface on any localized public page for this record
  // (list + detail across models), and the slug isn't carried here. Purge all
  // cached data so every locale's pages pick up the change on next visit — this
  // is a rare, admin-only write, so the broad invalidation is acceptable.
  revalidatePath("/", "layout");
  revalidatePath(`/admin/translations/${model}/${recordId}`);
  return { ok: true };
}
