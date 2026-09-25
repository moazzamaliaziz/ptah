"use client";

import { useEffect, useRef, useState, useActionState, type JSX } from "react";
import { useBeforeUnloadWarning } from "@/hooks/use-beforeunload-warning";
import { localeNames } from "@/i18n/config";
import { saveTranslationsAction, type TranslationFormState } from "../../actions";
import type { TranslationEditorDict } from "@/i18n/admin/dictionary";
import type {
  TranslatableRecordView,
  TranslatableFieldView,
} from "@/server/admin/translations-admin";

/** Editor hint per field kind (line/text are self-explanatory → none). */
function helpFor(kind: string, labels: TranslationEditorDict): string | undefined {
  if (kind === "list") return labels.helpList;
  if (kind === "faq") return labels.helpFaq;
  return undefined;
}

function rowsFor(kind: string): number {
  if (kind === "text") return 4;
  if (kind === "list") return 5;
  if (kind === "faq") return 6;
  return 2;
}

/**
 * One field: the editable translation box (empty ⇒ falls back to English) with
 * the English source shown beneath for reference. `field.<name>` naming keeps
 * these inputs clear of the control inputs the action also reads.
 */
function FieldControl({ field, labels }: { field: TranslatableFieldView; labels: TranslationEditorDict }): JSX.Element {
  const name = `field.${field.name}`;
  const help = helpFor(field.kind, labels);
  return (
    <label className="admin-field">
      <span>{field.label}</span>
      {help ? <small className="admin-card__meta">{help}</small> : null}
      {field.kind === "line" ? (
        <input className="admin-input" type="text" name={name} defaultValue={field.translatedText} />
      ) : (
        <textarea
          className="admin-textarea"
          name={name}
          rows={rowsFor(field.kind)}
          defaultValue={field.translatedText}
        />
      )}
      <small
        className="admin-card__meta"
        style={{ whiteSpace: "pre-wrap", marginTop: "0.25rem", opacity: 0.8 }}
      >
        {labels.englishLabel} {field.sourceText || labels.emptyPlaceholder}
      </small>
    </label>
  );
}

export default function TranslationEditor({
  record,
  labels,
}: {
  record: TranslatableRecordView;
  labels: TranslationEditorDict;
}): JSX.Element {
  const [state, action, pending] = useActionState<TranslationFormState, FormData>(
    saveTranslationsAction,
    {},
  );
  const [dirty, setDirty] = useState(false);
  const savedRef = useRef(state.ok);

  // Clear the unsaved-changes flag once a save succeeds.
  useEffect(() => {
    if (state.ok && !savedRef.current) setDirty(false);
    savedRef.current = state.ok;
  }, [state.ok]);

  useBeforeUnloadWarning(dirty && !pending);

  return (
    <form
      action={action}
      className="admin-form admin-card"
      onInput={() => setDirty(true)}
      onChange={() => setDirty(true)}
    >
      <input type="hidden" name="model" value={record.model} />
      <input type="hidden" name="recordId" value={record.recordId} />
      <input type="hidden" name="locale" value={record.locale} />

      {state.error ? (
        <div className="admin-alert admin-alert--error" role="alert">{state.error}</div>
      ) : null}
      {state.ok ? (
        <div className="admin-alert admin-alert--ok" role="status">{labels.savedNote}</div>
      ) : null}
      {dirty ? (
        <div className="admin-alert admin-alert--warn" role="status">
          {labels.unsavedChanges}
        </div>
      ) : null}

      {record.fields.map((f) => (
        <FieldControl key={f.name} field={f} labels={labels} />
      ))}

      <div className="admin-row" style={{ marginTop: "0.5rem" }}>
        <button className="admin-btn" type="submit" disabled={pending}>
          {pending ? labels.saving : `${labels.saveTranslationPre}${localeNames[record.locale]}${labels.saveTranslationPost}`}
        </button>
      </div>
    </form>
  );
}
