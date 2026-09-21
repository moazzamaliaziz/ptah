"use client";

import { useActionState, type JSX } from "react";
import MediaPicker from "@/components/admin/MediaPicker";
import {
  createDestinationAction,
  updateDestinationAction,
  type DestinationFormState,
} from "./actions";
import type { DestinationInput } from "@/content/catalog-admin-schema";

export interface DestinationEditorProps {
  /** Present → edit mode (update); absent → create mode. */
  destination?: DestinationInput & { id: string };
}

/** Shared create/edit form for a destination. */
export default function DestinationEditor({ destination }: DestinationEditorProps): JSX.Element {
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
        <div className="admin-alert admin-alert--ok" role="status">Saved.</div>
      ) : null}

      <div className="admin-row" style={{ gap: "1rem" }}>
        <label className="admin-field" style={{ flex: "2 1 240px" }}>
          <span>Name</span>
          <input className="admin-input" type="text" name="name" defaultValue={destination?.name ?? ""} maxLength={160} required />
        </label>
        <label className="admin-field" style={{ flex: "1 1 200px" }}>
          <span>Slug</span>
          <input className="admin-input" type="text" name="slug" defaultValue={destination?.slug ?? ""} maxLength={191} placeholder="cairo" required />
        </label>
        <label className="admin-field" style={{ flex: "1 1 160px" }}>
          <span>Region (optional)</span>
          <input className="admin-input" type="text" name="region" defaultValue={destination?.region ?? ""} maxLength={160} />
        </label>
      </div>

      <label className="admin-field">
        <span>Description (optional)</span>
        <textarea className="admin-textarea" name="description" defaultValue={destination?.description ?? ""} style={{ minHeight: "7rem" }} />
      </label>

      <div className="admin-row" style={{ gap: "1rem" }}>
        <MediaPicker name="heroImage" emit="url" initialUrl={destination?.heroImage ?? null} folder="destinations" label="Hero image" />
        <MediaPicker name="ogImage" emit="url" initialUrl={destination?.ogImage ?? null} folder="destinations" label="Social share image (OG)" />
      </div>

      <label className="admin-field">
        <span>Meta title (SEO)</span>
        <input className="admin-input" type="text" name="metaTitle" defaultValue={destination?.metaTitle ?? ""} maxLength={255} />
      </label>
      <label className="admin-field">
        <span>Meta description (SEO)</span>
        <textarea className="admin-textarea" name="metaDesc" defaultValue={destination?.metaDesc ?? ""} maxLength={320} style={{ minHeight: "4rem" }} />
      </label>

      <div className="admin-row" style={{ marginTop: "0.75rem" }}>
        <button className="admin-btn" type="submit" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Save destination" : "Create destination"}
        </button>
      </div>
    </form>
  );
}
