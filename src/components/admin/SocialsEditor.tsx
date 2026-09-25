"use client";

import { useState, type JSX } from "react";
import { SOCIAL_ICON_KEYS, type SocialLink } from "@/content/settings-schema";
import type { SocialsEditorDict } from "@/i18n/admin/dictionary";

export interface SocialsEditorProps {
  /** Hidden field name the serialized JSON array posts under. */
  name: string;
  /** Initial social rows (edit form). */
  initial?: SocialLink[];
  /** Localized labels (supplied by the branding editor). */
  labels: SocialsEditorDict;
}

/**
 * Footer social-link repeater: add/remove {label, href, iconKey} rows.
 * Serializes to a hidden JSON field (`name`) that the branding action parses +
 * validates against `branding.socials` (array of socialLinkSchema). Imports the
 * pure settings-schema module only — no server/db value crosses the boundary.
 *
 * `href` is validated server-side by the schema's scheme allowlist (blocks
 * javascript:/data:); the visible hint tells the editor what is accepted.
 */
export default function SocialsEditor({ name, initial, labels }: SocialsEditorProps): JSX.Element {
  const [rows, setRows] = useState<SocialLink[]>(initial ?? []);

  function update(i: number, patch: Partial<SocialLink>): void {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  function add(): void {
    setRows((prev) => [...prev, { label: "", href: "", iconKey: SOCIAL_ICON_KEYS[0] }]);
  }
  function remove(i: number): void {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  // Only fully-filled rows post (matches socialLinkSchema min(1) on label+href).
  const serialized = JSON.stringify(rows.filter((r) => r.label.trim() && r.href.trim()));

  return (
    <div className="admin-field">
      <span>{labels.fieldLabel}</span>
      <input type="hidden" name={name} value={serialized} />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {rows.map((row, i) => (
          <div key={i} className="admin-card" style={{ padding: "0.75rem" }}>
            <div className="admin-row admin-row--between" style={{ marginBottom: "0.4rem" }}>
              <span className="admin-card__meta">{labels.linkPre}{i + 1}</span>
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => remove(i)}>
                {labels.remove}
              </button>
            </div>
            <div className="admin-row" style={{ gap: "0.5rem", flexWrap: "wrap" }}>
              <label className="admin-field" style={{ flex: "1 1 140px", marginBottom: 0 }}>
                <span>{labels.label}</span>
                <input
                  className="admin-input"
                  type="text"
                  value={row.label}
                  maxLength={60}
                  placeholder="Instagram"
                  aria-label={`${labels.ariaPre}${i + 1}${labels.ariaLabelSuffix}`}
                  onChange={(e) => update(i, { label: e.target.value })}
                />
              </label>
              <label className="admin-field" style={{ flex: "1 1 140px", marginBottom: 0 }}>
                <span>{labels.icon}</span>
                <select
                  className="admin-input"
                  value={row.iconKey}
                  aria-label={`${labels.ariaPre}${i + 1}${labels.ariaIconSuffix}`}
                  onChange={(e) => update(i, { iconKey: e.target.value as SocialLink["iconKey"] })}
                >
                  {SOCIAL_ICON_KEYS.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </label>
              <label className="admin-field" style={{ flex: "2 1 240px", marginBottom: 0 }}>
                <span>{labels.url}</span>
                <input
                  className="admin-input"
                  type="text"
                  value={row.href}
                  maxLength={512}
                  placeholder="https://… or mailto:… or tel:…"
                  aria-label={`${labels.ariaPre}${i + 1}${labels.ariaUrlSuffix}`}
                  onChange={(e) => update(i, { href: e.target.value })}
                />
              </label>
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="admin-btn admin-btn--ghost" onClick={add} style={{ marginTop: "0.5rem" }}>
        {labels.addLink}
      </button>
    </div>
  );
}
