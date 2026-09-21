"use server";

import { revalidatePath } from "next/cache";
import { requireCapability } from "@/server/auth/rbac";
import { INTEGRATIONS, saveIntegration } from "@/server/integrations";
import { writeAudit } from "@/server/audit";

const BY_KEY = new Map(INTEGRATIONS.map((i) => [i.key, i]));

/**
 * Save one integration's enabled flag + credential fields. Re-checks
 * `integrations.manage` server-side. Secret values are written straight to the
 * encrypted blob (src/server/integrations) and are NEVER echoed back or logged
 * — the audit meta records only WHICH fields were set, not their values.
 */
export async function saveIntegrationAction(formData: FormData): Promise<void> {
  const user = await requireCapability("integrations.manage");

  const key = String(formData.get("key") ?? "");
  const def = BY_KEY.get(key);
  if (!def) return;

  const enabled = formData.get("enabled") === "on";
  const input: Record<string, string | undefined> = {};
  const changedFields: string[] = [];
  for (const field of def.fields) {
    const raw = formData.get(field.name);
    const value = typeof raw === "string" ? raw : undefined;
    input[field.name] = value;
    if (value && value.trim().length > 0) changedFields.push(field.name);
  }

  await saveIntegration(key, enabled, input);
  await writeAudit({
    actorId: user.id,
    action: "integration.save",
    entity: "integration",
    entityId: key,
    // Record intent, never secret values.
    meta: { enabled, fieldsProvided: changedFields },
  });

  revalidatePath("/admin/integrations");
}
