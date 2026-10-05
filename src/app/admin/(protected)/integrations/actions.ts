"use server";

import { revalidatePath } from "next/cache";
import { requireCapability } from "@/server/auth/rbac";
import { INTEGRATIONS, saveIntegration } from "@/server/integrations";
import { writeAudit } from "@/server/audit";
import { diagnosePaypal } from "@/server/payments/paypal";
import { SITE_CURRENCY } from "@/content/currency";

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

/**
 * Run the PayPal connection check and return a readable verdict.
 *
 * Exists so the operator can see WHY checkout will not start without reading
 * server logs — the customer-facing funnel deliberately says only "could not
 * start PayPal checkout", which is correct for them and useless for whoever has
 * to fix it. Gated by `integrations.manage`: it reveals PayPal's response to
 * our credentials, which is operator information.
 */
export async function testPaypalAction(): Promise<PaypalTestResult> {
  await requireCapability("integrations.manage");
  const diagnosis = await diagnosePaypal(SITE_CURRENCY);
  if (diagnosis.ok) {
    return { ok: true, environment: diagnosis.environment };
  }
  return {
    ok: false,
    code: diagnosis.code,
    status: diagnosis.status ?? null,
    detail: diagnosis.detail ?? null,
    environment: diagnosis.environment ?? null,
    currency: SITE_CURRENCY,
  };
}

/** Serializable shape for the client button (no PayPal types cross the wire). */
export type PaypalTestResult =
  | { ok: true; environment: "live" | "sandbox" }
  | {
      ok: false;
      code: "NOT_CONFIGURED" | "AUTH_REJECTED" | "ORDER_REJECTED" | "NETWORK";
      status: number | null;
      detail: string | null;
      environment: "live" | "sandbox" | null;
      currency: string;
    };
