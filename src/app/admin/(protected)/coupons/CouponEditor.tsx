"use client";

import { useActionState, useState, type JSX } from "react";
import {
  createCouponAction,
  updateCouponAction,
  type CouponFormState,
} from "./actions";
import {
  centsToMoney,
  toDateInput,
  type CouponInput,
} from "@/content/coupon-admin-schema";
import { SITE_CURRENCY } from "@/content/currency";
import type { CouponFormDict } from "@/i18n/admin/dictionary";

export interface CouponEditorProps {
  /** Present → edit mode (update); absent → create mode. */
  coupon?: Omit<CouponInput, "currency"> & { id: string; currency: string | null };
  /** View-only for staff who can see but not edit coupons (disables the form). */
  readOnly?: boolean;
  /** Localized field labels/hints (passed from the server page). */
  labels: CouponFormDict;
  /** Localized "Saving…" pending-button label (the generic `common.saving`). */
  savingLabel: string;
}

/** Shared create/edit form for a discount coupon. */
export default function CouponEditor({ coupon, readOnly = false, labels, savingLabel }: CouponEditorProps): JSX.Element {
  const isEdit = coupon !== undefined;
  const [state, formAction, pending] = useActionState<CouponFormState, FormData>(
    isEdit ? updateCouponAction : createCouponAction,
    {},
  );

  // The `type` drives what the single "value" field means, so track it live.
  const [type, setType] = useState<CouponInput["type"]>(coupon?.type ?? "PERCENT");
  const isPercent = type === "PERCENT";

  // Initial value string: percent stays as-is, fixed amounts render as money.
  const initialValue =
    coupon === undefined ? "" : coupon.type === "FIXED" ? centsToMoney(coupon.value) : String(coupon.value);

  return (
    <form action={formAction} className="admin-card">
      {isEdit ? <input type="hidden" name="id" value={coupon.id} /> : null}
      {state.error ? (
        <div className="admin-alert admin-alert--error" role="alert">{state.error}</div>
      ) : null}
      {state.ok ? (
        <div className="admin-alert admin-alert--ok" role="status">{labels.saved}</div>
      ) : null}

      <fieldset disabled={readOnly} style={{ border: "none", padding: 0, margin: 0, minInlineSize: "auto" }}>
      <div className="admin-row" style={{ gap: "1rem" }}>
        <label className="admin-field" style={{ flex: "2 1 220px" }}>
          <span>{labels.code}</span>
          <input
            className="admin-input"
            type="text"
            name="code"
            defaultValue={coupon?.code ?? ""}
            maxLength={40}
            placeholder="SUMMER-2026"
            style={{ textTransform: "uppercase" }}
            required
          />
          <small className="admin-card__meta">{labels.codeHint}</small>
        </label>
        <label className="admin-field" style={{ flex: "1 1 160px" }}>
          <span>{labels.discountType}</span>
          <select
            className="admin-input"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as CouponInput["type"])}
          >
            <option value="PERCENT">{labels.typePercent}</option>
            <option value="FIXED">{labels.typeFixed}</option>
          </select>
        </label>
      </div>

      <div className="admin-row" style={{ gap: "1rem" }}>
        <label className="admin-field" style={{ flex: "1 1 180px" }}>
          <span>{isPercent ? labels.valuePercentLabel : labels.valueFixedLabel}</span>
          <input
            className="admin-input"
            type="text"
            name="value"
            inputMode="decimal"
            defaultValue={initialValue}
            placeholder={isPercent ? "10" : "25.00"}
            required
          />
          <small className="admin-card__meta">
            {isPercent ? labels.valuePercentHint : labels.valueFixedHint}
          </small>
        </label>
        <label className="admin-field" style={{ flex: "1 1 140px" }}>
          <span>{labels.currency}</span>
          {/* One site currency, so this is a two-way choice rather than free
              text: leave it unset (a percentage applies to any total) or pin it
              to the currency the shop actually charges in. */}
          <select
            className="admin-input"
            name="currency"
            defaultValue={coupon?.currency ?? ""}
          >
            <option value="">—</option>
            <option value={SITE_CURRENCY}>{SITE_CURRENCY}</option>
          </select>
          <small className="admin-card__meta">
            {isPercent ? labels.currencyPercentHint : labels.currencyFixedHint}
          </small>
        </label>
      </div>

      <div className="admin-row" style={{ gap: "1rem" }}>
        <label className="admin-field" style={{ flex: "1 1 180px" }}>
          <span>{labels.minSpend}</span>
          <input
            className="admin-input"
            type="text"
            name="minSpend"
            inputMode="decimal"
            defaultValue={coupon?.minSpendCents != null ? centsToMoney(coupon.minSpendCents) : ""}
            placeholder="100.00"
          />
          <small className="admin-card__meta">{labels.minSpendHint}</small>
        </label>
        <label className="admin-field" style={{ flex: "1 1 160px" }}>
          <span>{labels.maxUses}</span>
          <input
            className="admin-input"
            type="number"
            name="maxRedemptions"
            min={1}
            step={1}
            defaultValue={coupon?.maxRedemptions ?? ""}
            placeholder={labels.maxUsesPlaceholder}
          />
          <small className="admin-card__meta">{labels.maxUsesHint}</small>
        </label>
      </div>

      <div className="admin-row" style={{ gap: "1rem" }}>
        <label className="admin-field" style={{ flex: "1 1 160px" }}>
          <span>{labels.starts}</span>
          <input className="admin-input" type="date" name="startsAt" defaultValue={toDateInput(coupon?.startsAt ?? null)} />
        </label>
        <label className="admin-field" style={{ flex: "1 1 160px" }}>
          <span>{labels.ends}</span>
          <input className="admin-input" type="date" name="endsAt" defaultValue={toDateInput(coupon?.endsAt ?? null)} />
          <small className="admin-card__meta">{labels.endsHint}</small>
        </label>
      </div>

      <label className="admin-field" style={{ flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
        <input type="checkbox" name="active" defaultChecked={coupon?.active ?? true} />
        <span>{labels.activeLabel}</span>
      </label>
      </fieldset>

      {readOnly ? null : (
        <div className="admin-row" style={{ marginTop: "0.75rem" }}>
          <button className="admin-btn" type="submit" disabled={pending}>
            {pending ? savingLabel : isEdit ? labels.saveCoupon : labels.createCoupon}
          </button>
        </div>
      )}
    </form>
  );
}
