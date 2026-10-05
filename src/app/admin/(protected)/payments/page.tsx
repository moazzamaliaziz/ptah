import type { JSX } from "react";
import { requireCapability, can } from "@/server/auth/rbac";
import { getSettings } from "@/server/settings";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";
import PaymentsEditor from "./PaymentsEditor";

export const dynamic = "force-dynamic";

/**
 * /admin/payments — the bank account customers transfer to.
 *
 * Gated by `integrations.view`; the form only renders with
 * `integrations.manage` (the action re-checks it regardless). It shares those
 * capabilities with Integrations because this is the same job: deciding how the
 * shop gets paid. The values themselves are plain site settings, not vault
 * entries — they are public payment details, printed on every invoice, not
 * credentials.
 */
export default async function PaymentsPage(): Promise<JSX.Element> {
  const user = await requireCapability("integrations.view");
  const editable = can(user, "integrations.manage");
  const s = await getSettings();
  const dict = getAdminDict(await getAdminLocale());
  const t = dict.payments;

  return (
    <>
      <div className="admin-head">
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </div>

      {!editable ? (
        <div className="admin-alert admin-alert--ok" role="status">
          {t.viewOnlyNote}
        </div>
      ) : (
        <PaymentsEditor
          labels={t.editor}
          bankAccountName={s["payments.bankAccountName"]}
          bankIban={s["payments.bankIban"]}
          bankAccountNumber={s["payments.bankAccountNumber"]}
          bankBic={s["payments.bankBic"]}
          bankCurrency={s["payments.bankCurrency"]}
          bankNote={s["payments.bankNote"]}
        />
      )}
    </>
  );
}
