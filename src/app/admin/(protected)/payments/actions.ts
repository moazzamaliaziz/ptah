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

/** useActionState shape shared by the payments form. */
export type PaymentsFormState = { ok?: boolean; error?: string };

/** Trimmed string field, or "" when absent. */
function str(fd: FormData, key: string): string {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim() : "";
}

/**
 * Validate one key against its own schema BEFORE any write, so a single bad
 * field fails the whole submit with a friendly message rather than persisting
 * half an account — which, for payment details, is worse than persisting none.
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
 * Persist the bank-transfer account shown to customers on the offline-payment
 * page. Re-checks `integrations.manage` server-side (UI gating is not enough).
 *
 * The audit entry records WHICH fields were written and never their values:
 * these are not secrets, but an audit log that quietly accumulates account
 * numbers is a liability nobody asked for.
 */
export async function updatePaymentsAction(
  _prev: PaymentsFormState,
  fd: FormData,
): Promise<PaymentsFormState> {
  const user = await requireCapability("integrations.manage");

  let values: { [K in SettingKey]?: SettingValue<K> };
  try {
    values = {
      "payments.bankAccountName": parseOrThrow("payments.bankAccountName", str(fd, "bankAccountName"), "Account name"),
      "payments.bankIban": parseOrThrow("payments.bankIban", str(fd, "bankIban"), "IBAN"),
      "payments.bankAccountNumber": parseOrThrow("payments.bankAccountNumber", str(fd, "bankAccountNumber"), "Account number"),
      "payments.bankBic": parseOrThrow("payments.bankBic", str(fd, "bankBic"), "BIC / SWIFT"),
      "payments.bankCurrency": parseOrThrow("payments.bankCurrency", str(fd, "bankCurrency"), "Account currency"),
      "payments.bankNote": parseOrThrow("payments.bankNote", str(fd, "bankNote"), "Note"),
    };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Please check the form values." };
  }

  const keys = Object.keys(values) as SettingKey[];
  for (const key of keys) {
    await setSetting(key, values[key]!);
  }

  await writeAudit({
    actorId: user.id,
    action: "payments.bank.update",
    entity: "site_setting",
    entityId: null,
    meta: { fields: keys },
  });

  // The booking funnel's bank-transfer page reads these on every render.
  revalidatePath("/booking/bank-transfer");
  revalidatePath("/admin/payments");

  return { ok: true };
}
