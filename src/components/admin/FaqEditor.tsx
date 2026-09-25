"use client";

import { useState, type JSX } from "react";
import type { FaqItem } from "@/content/catalog-admin-schema";
import type { FaqEditorDict } from "@/i18n/admin/dictionary";

export interface FaqEditorProps {
  /** Hidden field name the serialized JSON array posts under. */
  name: string;
  /** Initial FAQ rows (edit forms). */
  initial?: FaqItem[];
  /** Localized labels. */
  labels: FaqEditorDict;
}

/**
 * Structured FAQ editor: add/remove question+answer rows. Serializes to a hidden
 * JSON field (`name`) that the server action parses + validates against the
 * catalog schema. Friendlier than raw-JSON editing for a no-code admin.
 */
export default function FaqEditor({ name, initial, labels }: FaqEditorProps): JSX.Element {
  const [rows, setRows] = useState<FaqItem[]>(initial ?? []);

  function update(i: number, patch: Partial<FaqItem>): void {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  function add(): void {
    setRows((prev) => [...prev, { q: "", a: "" }]);
  }
  function remove(i: number): void {
    setRows((prev) => prev.filter((_, idx) => idx !== i));
  }

  // Only rows with both fields filled are posted (matches schema min(1)).
  const serialized = JSON.stringify(rows.filter((r) => r.q.trim() && r.a.trim()));
  // A row with exactly one side filled would be silently dropped — warn instead.
  const incomplete = rows.some((r) => (r.q.trim() === "") !== (r.a.trim() === ""));

  return (
    <div className="admin-field">
      <span>{labels.faqsLabel}</span>
      <input type="hidden" name={name} value={serialized} />
      {incomplete ? (
        <div className="admin-alert admin-alert--warn" role="status" style={{ marginBottom: "0.5rem" }}>
          {labels.incompleteWarn}
        </div>
      ) : null}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        {rows.map((row, i) => (
          <div key={i} className="admin-card" style={{ padding: "0.75rem" }}>
            <div className="admin-row admin-row--between" style={{ marginBottom: "0.4rem" }}>
              <span className="admin-card__meta">{labels.questionWord} {i + 1}</span>
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => remove(i)}>
                {labels.remove}
              </button>
            </div>
            <input
              className="admin-input"
              type="text"
              value={row.q}
              maxLength={300}
              placeholder={labels.questionPlaceholder}
              aria-label={`${labels.questionPlaceholder} ${i + 1}`}
              onChange={(e) => update(i, { q: e.target.value })}
              style={{ marginBottom: "0.4rem" }}
            />
            <textarea
              className="admin-textarea"
              value={row.a}
              maxLength={2000}
              placeholder={labels.answerPlaceholder}
              aria-label={`${labels.answerPlaceholder} ${i + 1}`}
              onChange={(e) => update(i, { a: e.target.value })}
              style={{ minHeight: "5rem" }}
            />
          </div>
        ))}
      </div>
      <button type="button" className="admin-btn admin-btn--ghost" onClick={add} style={{ marginTop: "0.5rem" }}>
        {labels.addFaq}
      </button>
    </div>
  );
}
