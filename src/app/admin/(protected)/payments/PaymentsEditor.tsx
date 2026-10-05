"use client";

import { useActionState, useState, type JSX } from "react";
import { updatePaymentsAction, type PaymentsFormState } from "./actions";
import { isValidIban, formatIban } from "@/content/bank-details";
import type { PaymentsEditorDict } from "@/i18n/admin/dictionary";

export interface PaymentsEditorProps {
  labels: PaymentsEditorDict;
  bankAccountName: string;
  bankIban: string;
  bankAccountNumber: string;
  bankBic: string;
  bankCurrency: string;
  bankNote: string;
}

/**
 * Bank-transfer account editor.
 *
 * The IBAN field runs the ISO 7064 checksum as you type and WARNS rather than
 * blocks. That split is deliberate: a failed checksum almost always means a
 * transposed digit — the single most consequential typo on this form, since the
 * money goes somewhere else and nobody notices for days — but hard-blocking on
 * it would also block any account whose format this code does not anticipate.
 * Warn loudly, let a human decide.
 */
export default function PaymentsEditor(props: PaymentsEditorProps): JSX.Element {
  const t = props.labels;
  const [state, formAction, pending] = useActionState<PaymentsFormState, FormData>(
    updatePaymentsAction,
    {},
  );
  const [iban, setIban] = useState(props.bankIban);

  const compactIban = iban.replace(/\s+/g, "").toUpperCase();
  const ibanChecked = compactIban !== "";
  const ibanOk = ibanChecked && isValidIban(compactIban);

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {state.error ? (
        <div className="admin-alert admin-alert--error" role="alert">{state.error}</div>
      ) : null}
      {state.ok ? (
        <div className="admin-alert admin-alert--ok" role="status">{t.saved}</div>
      ) : null}

      <fieldset style={{ border: "1px solid rgba(26,35,64,0.15)", borderRadius: 8, padding: "0.75rem 1rem" }}>
        <legend className="admin-card__meta">{t.bankLegend}</legend>
        <p className="admin-card__meta" style={{ margin: "0.25rem 0 0.75rem" }}>{t.bankNoteHint}</p>

        <label className="admin-field">
          <span>{t.accountName}</span>
          <input className="admin-input" type="text" name="bankAccountName" defaultValue={props.bankAccountName} maxLength={160} />
        </label>

        <label className="admin-field">
          <span>{t.iban}</span>
          <input
            className="admin-input"
            type="text"
            name="bankIban"
            value={iban}
            onChange={(e) => setIban(e.target.value)}
            maxLength={42}
            spellCheck={false}
            style={{ fontFamily: "ui-monospace, monospace", textTransform: "uppercase" }}
          />
          {ibanChecked ? (
            <small className={ibanOk ? "admin-card__meta" : undefined} style={ibanOk ? undefined : { color: "#b3261e", fontWeight: 600 }}>
              {ibanOk
                ? `${t.ibanValid} ${formatIban(compactIban)}`
                : t.ibanInvalid}
            </small>
          ) : null}
        </label>

        <div className="admin-row" style={{ gap: "1rem" }}>
          <label className="admin-field" style={{ flex: "2 1 220px" }}>
            <span>{t.accountNumber}</span>
            <input className="admin-input" type="text" name="bankAccountNumber" defaultValue={props.bankAccountNumber} maxLength={64} style={{ fontFamily: "ui-monospace, monospace" }} />
          </label>
          <label className="admin-field" style={{ flex: "1 1 160px" }}>
            <span>{t.bic}</span>
            <input className="admin-input" type="text" name="bankBic" defaultValue={props.bankBic} maxLength={11} style={{ fontFamily: "ui-monospace, monospace", textTransform: "uppercase" }} />
          </label>
          <label className="admin-field" style={{ flex: "0 1 120px" }}>
            <span>{t.currency}</span>
            <input className="admin-input" type="text" name="bankCurrency" defaultValue={props.bankCurrency} maxLength={3} style={{ textTransform: "uppercase" }} />
          </label>
        </div>

        <label className="admin-field">
          <span>{t.note}</span>
          <textarea className="admin-textarea" name="bankNote" defaultValue={props.bankNote} maxLength={2000} style={{ minHeight: "5rem" }} />
          <small className="admin-card__meta">{t.noteHint}</small>
        </label>
      </fieldset>

      <div className="admin-row">
        <button className="admin-btn" type="submit" disabled={pending}>
          {pending ? t.saving : t.save}
        </button>
      </div>
    </form>
  );
}
