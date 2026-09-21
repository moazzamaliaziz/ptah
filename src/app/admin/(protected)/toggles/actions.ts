"use server";

import { revalidatePath } from "next/cache";
import { requireCapability } from "@/server/auth/rbac";
import { TOGGLE_KEYS, setToggle, type ToggleKey } from "@/server/toggles";
import { writeAudit } from "@/server/audit";

/**
 * Flip a site toggle. Re-checks `toggles.edit` server-side (UI hiding is not
 * enough — a forged POST from a SUPPORT/EDITOR session is rejected here).
 */
export async function setToggleAction(formData: FormData): Promise<void> {
  const user = await requireCapability("toggles.edit");

  const key = String(formData.get("key") ?? "");
  const value = String(formData.get("value") ?? "") === "true";
  if (!(TOGGLE_KEYS as readonly string[]).includes(key)) return;

  await setToggle(key as ToggleKey, value);
  await writeAudit({
    actorId: user.id,
    action: "toggle.update",
    entity: "site_toggle",
    entityId: key,
    meta: { value },
  });

  revalidatePath("/admin/toggles");
}
