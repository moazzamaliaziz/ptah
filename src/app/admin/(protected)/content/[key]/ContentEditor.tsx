"use client";

import { useActionState, useState, type JSX } from "react";
import { saveContentAction, type ContentSaveState } from "../actions";

export interface ContentEditorProps {
  sectionKey: string;
  initialJson: string;
}

/** JSON payload editor for one landing section (validated server-side on save).
    Keeps the edited text across submits and surfaces validation errors inline. */
export default function ContentEditor({ sectionKey, initialJson }: ContentEditorProps): JSX.Element {
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
          Saved. The landing page updates within the revalidation window.
        </div>
      ) : null}
      <textarea
        className="admin-textarea"
        name="json"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        spellCheck={false}
        aria-label={`${sectionKey} payload (JSON)`}
      />
      <div className="admin-row" style={{ marginTop: "0.75rem" }}>
        <button className="admin-btn" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save override"}
        </button>
      </div>
    </form>
  );
}
