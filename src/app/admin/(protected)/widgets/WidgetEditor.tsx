"use client";

import { useActionState, useState, type JSX } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  WIDGET_TYPES,
  WIDGET_POSITIONS,
  WIDGET_ICON_KEYS,
  WIDGET_TYPE_META,
  type WidgetInput,
} from "@/content/widget-admin-schema";
import { createWidgetAction, updateWidgetAction, type WidgetFormState } from "./actions";

export interface WidgetEditorProps {
  /** Present → edit (update); absent → create with sensible defaults. */
  widget?: WidgetInput & { id: string };
}

/**
 * Shared create/edit form for a floating widget. Picking a type seeds the
 * icon/label/color from its preset (client-side convenience only — the server
 * re-validates + normalizes the href regardless). The href is normalized per
 * type on save (phone→tel:, WhatsApp→wa.me, email→mailto:).
 */
export default function WidgetEditor({ widget }: WidgetEditorProps): JSX.Element {
  const isEdit = widget !== undefined;
  const [state, formAction, pending] = useActionState<WidgetFormState, FormData>(
    isEdit ? updateWidgetAction : createWidgetAction,
    {},
  );

  const [type, setType] = useState<WidgetInput["type"]>(widget?.type ?? "PHONE");
  const [iconKey, setIconKey] = useState<WidgetInput["iconKey"]>(widget?.iconKey ?? WIDGET_TYPE_META.PHONE.icon);
  const [bgColor, setBgColor] = useState<string>(widget?.bgColor ?? WIDGET_TYPE_META.PHONE.bgColor);

  const meta = WIDGET_TYPE_META[type];

  function onTypeChange(next: WidgetInput["type"]): void {
    setType(next);
    // Only auto-fill icon/color; leave label/href to the editor.
    setIconKey(WIDGET_TYPE_META[next].icon);
    setBgColor(WIDGET_TYPE_META[next].bgColor);
  }

  return (
    <form action={formAction} className="admin-card" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {isEdit ? <input type="hidden" name="id" value={widget.id} /> : null}
      {state.error ? <div className="admin-alert admin-alert--error" role="alert">{state.error}</div> : null}
      {state.ok ? <div className="admin-alert admin-alert--ok" role="status">Saved. Widgets update on the live site within seconds.</div> : null}

      <div className="admin-row" style={{ gap: "1rem", flexWrap: "wrap" }}>
        <label className="admin-field" style={{ flex: "1 1 180px" }}>
          <span>Type</span>
          <select className="admin-input" name="type" value={type} onChange={(e) => onTypeChange(e.target.value as WidgetInput["type"])}>
            {WIDGET_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <label className="admin-field" style={{ flex: "2 1 220px" }}>
          <span>Label (tooltip / aria-label)</span>
          <input className="admin-input" type="text" name="label" defaultValue={widget?.label ?? meta.label} maxLength={120} required />
        </label>
      </div>

      <label className="admin-field">
        <span>Link</span>
        <input className="admin-input" type="text" name="href" defaultValue={widget?.href ?? ""} maxLength={512} required placeholder="+20 100 000 0000 / hello@… / https://…" />
        <small className="admin-card__meta">{meta.hrefHint}</small>
      </label>

      <div className="admin-row" style={{ gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
        <label className="admin-field" style={{ flex: "1 1 160px" }}>
          <span>Icon</span>
          <select className="admin-input" name="iconKey" value={iconKey} onChange={(e) => setIconKey(e.target.value as WidgetInput["iconKey"])}>
            {WIDGET_ICON_KEYS.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </label>
        <label className="admin-field" style={{ flex: "1 1 160px" }}>
          <span>Background color</span>
          <input className="admin-input" type="text" name="bgColor" value={bgColor} onChange={(e) => setBgColor(e.target.value)} pattern="^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$" placeholder="#1a2340" />
        </label>
        {/* Live preview of the pill */}
        <div style={{ flex: "0 0 auto" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              height: "3rem",
              padding: "0 1rem",
              borderRadius: 999,
              color: "#fff",
              backgroundColor: /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(bgColor) ? bgColor : "#1a2340",
              boxShadow: "0 6px 20px rgb(0 0 0 / 0.22)",
            }}
          >
            <Icon name={iconKey} size={22} />
            <span style={{ fontWeight: 700 }}>Preview</span>
          </span>
        </div>
      </div>

      <div className="admin-row" style={{ gap: "1.5rem", flexWrap: "wrap" }}>
        <label className="admin-field" style={{ flex: "1 1 160px" }}>
          <span>Position</span>
          <select className="admin-input" name="position" defaultValue={widget?.position ?? "bottom-right"}>
            {WIDGET_POSITIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="admin-field" style={{ flex: "0 1 120px" }}>
          <span>Sort order</span>
          <input className="admin-input" type="number" name="sortOrder" defaultValue={widget?.sortOrder ?? 0} min={0} max={9999} />
        </label>
      </div>

      <div className="admin-row" style={{ gap: "1.5rem", flexWrap: "wrap" }}>
        <label className="admin-row" style={{ gap: "0.5rem", alignItems: "center" }}>
          <input type="checkbox" name="enabled" defaultChecked={widget?.enabled ?? true} /> <span>Enabled</span>
        </label>
        <label className="admin-row" style={{ gap: "0.5rem", alignItems: "center" }}>
          <input type="checkbox" name="showDesktop" defaultChecked={widget?.showDesktop ?? true} /> <span>Show on desktop</span>
        </label>
        <label className="admin-row" style={{ gap: "0.5rem", alignItems: "center" }}>
          <input type="checkbox" name="showMobile" defaultChecked={widget?.showMobile ?? true} /> <span>Show on mobile</span>
        </label>
      </div>

      <div>
        <button className="admin-btn" type="submit" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Save widget" : "Create widget"}
        </button>
      </div>
    </form>
  );
}
