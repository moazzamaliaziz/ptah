"use client";

import { useActionState, type JSX } from "react";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  createDestinationAction,
  updateDestinationAction,
  type DestinationFormState,
} from "./actions";
import type { DestinationInput } from "@/content/catalog-admin-schema";
import type { DestinationFormDict } from "@/i18n/admin/dictionary";

export interface DestinationEditorProps {
  /** Present → edit mode (update); absent → create mode. */
  destination?: DestinationInput & { id: string };
  labels: DestinationFormDict;
  savingLabel: string;
}

/** Shared create/edit form for a destination. Chrome copy arrives localized via
    `labels`; the server validation error in `state.error` stays verbatim. */
export default function DestinationEditor({ destination, labels, savingLabel }: DestinationEditorProps): JSX.Element {
  const isEdit = destination !== undefined;
  const [state, formAction, pending] = useActionState<DestinationFormState, FormData>(
    isEdit ? updateDestinationAction : createDestinationAction,
    {},
  );

  return (
    <form action={formAction} className="admin-card">
      {isEdit ? <input type="hidden" name="id" value={destination.id} /> : null}
      {state.error ? (
        <div className="admin-alert admin-alert--error" role="alert">{state.error}</div>
      ) : null}
      {state.ok ? (
        <div className="admin-alert admin-alert--ok" role="status">{labels.saved}</div>
      ) : null}

      <div className="admin-row" style={{ gap: "1rem" }}>
        <label className="admin-field" style={{ flex: "2 1 240px" }}>
          <span>{labels.name}</span>
          <input className="admin-input" type="text" name="name" defaultValue={destination?.name ?? ""} maxLength={160} required />
        </label>
        <label className="admin-field" style={{ flex: "1 1 200px" }}>
          <span>{labels.slug}</span>
          <input className="admin-input" type="text" name="slug" defaultValue={destination?.slug ?? ""} maxLength={191} placeholder="cairo" required />
        </label>
        <label className="admin-field" style={{ flex: "1 1 160px" }}>
          <span>{labels.region}</span>
          <input className="admin-input" type="text" name="region" defaultValue={destination?.region ?? ""} maxLength={160} />
        </label>
      </div>

      <label className="admin-field">
        <span>{labels.description}</span>
        <textarea className="admin-textarea" name="description" defaultValue={destination?.description ?? ""} style={{ minHeight: "7rem" }} />
      </label>

      <div className="admin-row" style={{ gap: "1rem" }}>
        <MediaPicker name="heroImage" emit="url" initialUrl={destination?.heroImage ?? null} folder="destinations" label={labels.heroImage} />
        <MediaPicker name="ogImage" emit="url" initialUrl={destination?.ogImage ?? null} folder="destinations" label={labels.ogImage} />
      </div>

      <label className="admin-field">
        <span>{labels.metaTitle}</span>
        <input className="admin-input" type="text" name="metaTitle" defaultValue={destination?.metaTitle ?? ""} maxLength={255} />
      </label>
      <label className="admin-field">
        <span>{labels.metaDesc}</span>
        <textarea className="admin-textarea" name="metaDesc" defaultValue={destination?.metaDesc ?? ""} maxLength={320} style={{ minHeight: "4rem" }} />
      </label>

      <div className="admin-row" style={{ marginTop: "0.75rem" }}>
        <button className="admin-btn" type="submit" disabled={pending}>
          {pending ? savingLabel : isEdit ? labels.saveDestination : labels.createDestination}
        </button>
      </div>
    </form>
  );
}
