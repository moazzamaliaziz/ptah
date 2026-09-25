"use client";

import { useActionState, useState, type JSX } from "react";
import { saveContentAction, type ContentSaveState } from "../actions";
import type { ContentEditorLabels } from "@/i18n/admin/dictionary";

export interface ContentEditorProps {
  sectionKey: string;
  initialJson: string;
  labels: ContentEditorLabels;
}

/** JSON payload editor for one landing section (validated server-side on save).
    Keeps the edited text across submits and surfaces validation errors inline.
    All chrome copy arrives via `labels` (localized on the server); the JSON
    payload and any server validation error in `state.error` stay verbatim. */
export default function ContentEditor({ sectionKey, initialJson, labels }: ContentEditorProps): JSX.Element {
  const [state, formAction, pending] = useActionState<ContentSaveState, FormData>(
    saveContentAction,
    {},
  );
  const [value, setValue] = useState(initialJson);

  return (
    <form action={formAction}>
      <input type="hidden" name="key" value={sectionKey} />
      {state.error ? (
        <div className="admin-alert admin-alert--error" role="alert">
          {state.error}
        </div>
      ) : null}
      {state.ok ? (
        <div className="admin-alert admin-alert--ok" role="status">
          {labels.saved}
        </div>
      ) : null}
      <textarea
        className="admin-textarea admin-textarea--code"
        name="json"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        spellCheck={false}
        aria-label={labels.payloadAria}
      />
      <div className="admin-row" style={{ marginTop: "0.75rem" }}>
        <button className="admin-btn" type="submit" disabled={pending}>
          {pending ? labels.saving : labels.save}
        </button>
      </div>
    </form>
  );
}
