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

export interface CouponEditorProps {
  /** Present → edit mode (update); absent → create mode. */
  coupon?: CouponInput & { id: string };
  /** View-only for staff who can see but not edit coupons (disables the form). */
  readOnly?: boolean;
}

/** Shared create/edit form for a discount coupon. */
export default function CouponEditor({ coupon, readOnly = false }: CouponEditorProps): JSX.Element {
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
        <div className="admin-alert admin-alert--ok" role="status">Saved.</div>
      ) : null}

      <fieldset disabled={readOnly} style={{ border: "none", padding: 0, margin: 0, minInlineSize: "auto" }}>
      <div className="admin-row" style={{ gap: "1rem" }}>
        <label className="admin-field" style={{ flex: "2 1 220px" }}>
          <span>Code</span>
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
          <small className="admin-card__meta">Customers type this at checkout. Letters, digits and hyphens.</small>
        </label>
        <label className="admin-field" style={{ flex: "1 1 160px" }}>
          <span>Discount type</span>
          <select
            className="admin-input"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as CouponInput["type"])}
          >
            <option value="PERCENT">Percentage off</option>
            <option value="FIXED">Fixed amount off</option>
          </select>
        </label>
      </div>

      <div className="admin-row" style={{ gap: "1rem" }}>
        <label className="admin-field" style={{ flex: "1 1 180px" }}>
          <span>{isPercent ? "Percentage off (1–100)" : "Amount off"}</span>
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
            {isPercent ? "A whole number, e.g. 10 for 10% off." : "In the currency below, e.g. 25.00."}
          </small>
        </label>
        <label className="admin-field" style={{ flex: "1 1 140px" }}>
          <span>Currency</span>
          <input
            className="admin-input"
            type="text"
            name="currency"
            defaultValue={coupon?.currency ?? ""}
            maxLength={3}
            placeholder="USD"
            style={{ textTransform: "uppercase" }}
          />
          <small className="admin-card__meta">
            {isPercent ? "Optional — leave blank to apply in any currency." : "Required for a fixed amount."}
          </small>
        </label>
      </div>

      <div className="admin-row" style={{ gap: "1rem" }}>
        <label className="admin-field" style={{ flex: "1 1 180px" }}>
          <span>Minimum spend (optional)</span>
          <input
            className="admin-input"
            type="text"
            name="minSpend"
            inputMode="decimal"
            defaultValue={coupon?.minSpendCents != null ? centsToMoney(coupon.minSpendCents) : ""}
            placeholder="100.00"
          />
          <small className="admin-card__meta">Order must reach this before the code applies.</small>
        </label>
        <label className="admin-field" style={{ flex: "1 1 160px" }}>
          <span>Max uses (optional)</span>
          <input
            className="admin-input"
            type="number"
            name="maxRedemptions"
            min={1}
            step={1}
            defaultValue={coupon?.maxRedemptions ?? ""}
            placeholder="Unlimited"
          />
          <small className="admin-card__meta">Total bookings that may use this code.</small>
        </label>
      </div>

      <div className="admin-row" style={{ gap: "1rem" }}>
        <label className="admin-field" style={{ flex: "1 1 160px" }}>
          <span>Starts (optional)</span>
          <input className="admin-input" type="date" name="startsAt" defaultValue={toDateInput(coupon?.startsAt ?? null)} />
        </label>
        <label className="admin-field" style={{ flex: "1 1 160px" }}>
          <span>Ends (optional)</span>
          <input className="admin-input" type="date" name="endsAt" defaultValue={toDateInput(coupon?.endsAt ?? null)} />
          <small className="admin-card__meta">Valid through the whole of this day.</small>
        </label>
      </div>

      <label className="admin-field" style={{ flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
        <input type="checkbox" name="active" defaultChecked={coupon?.active ?? true} />
        <span>Active (customers can use this code)</span>
      </label>
      </fieldset>

      {readOnly ? null : (
        <div className="admin-row" style={{ marginTop: "0.75rem" }}>
          <button className="admin-btn" type="submit" disabled={pending}>
            {pending ? "Saving…" : isEdit ? "Save coupon" : "Create coupon"}
          </button>
        </div>
      )}
    </form>
  );
}
