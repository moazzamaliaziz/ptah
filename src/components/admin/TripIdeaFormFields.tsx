"use client";

import { useEffect, useRef, useState, type JSX } from "react";
import MediaPicker from "@/components/admin/MediaPicker";
import { useBeforeUnloadWarning } from "@/hooks/use-beforeunload-warning";
import type { TripIdeaInput } from "@/content/events-admin-schema";
import type { TripIdeaFormFieldsDict } from "@/i18n/admin/dictionary";

export interface TripIdeaFormFieldsProps {
  initial?: Partial<TripIdeaInput> & { id?: string };
  saved?: boolean;
  pending?: boolean;
  /** Localized field labels. */
  labels: TripIdeaFormFieldsDict;
}

/**
 * Complete set of editable Trip Idea fields, shared by the create form and the
 * editor so both capture every field. Includes the unsaved-changes guard.
 * (Curated tour links are managed separately on the editor page.)
 */
export default function TripIdeaFormFields({ initial, saved, pending, labels }: TripIdeaFormFieldsProps): JSX.Element {
  const v = initial ?? {};
  const [dirty, setDirty] = useState(false);
  const savedRef = useRef(saved);

  useEffect(() => {
    if (saved && !savedRef.current) setDirty(false);
    savedRef.current = saved;
  }, [saved]);

  useBeforeUnloadWarning(dirty && !pending);

  return (
    <div onInput={() => setDirty(true)} onChange={() => setDirty(true)}>
      {dirty ? (
        <div className="admin-alert admin-alert--warn" role="status" style={{ marginBottom: "0.75rem" }}>
          {labels.unsavedChanges}
        </div>
      ) : null}

      <div className="admin-row" style={{ gap: "1rem" }}>
        <label className="admin-field" style={{ flex: "2 1 260px" }}>
          <span>{labels.title}</span>
          <input className="admin-input" type="text" name="title" defaultValue={v.title ?? ""} maxLength={255} required />
        </label>
        <label className="admin-field" style={{ flex: "1 1 200px" }}>
          <span>{labels.slug}</span>
          <input className="admin-input" type="text" name="slug" defaultValue={v.slug ?? ""} maxLength={191} placeholder="egypt-for-families" required />
        </label>
      </div>

      <label className="admin-field">
        <span>{labels.summary}</span>
        <input className="admin-input" type="text" name="summary" defaultValue={v.summary ?? ""} maxLength={512} required />
      </label>

      <label className="admin-field">
        <span>{labels.editorialIntro}</span>
        <textarea className="admin-textarea" name="descriptionLong" defaultValue={v.descriptionLong ?? ""} required style={{ minHeight: "10rem" }} />
      </label>

      <div className="admin-row" style={{ gap: "1rem" }}>
        <MediaPicker name="heroImage" emit="url" initialUrl={v.heroImage ?? null} folder="trip-ideas" label={labels.heroImage} />
        <MediaPicker name="ogImage" emit="url" initialUrl={v.ogImage ?? null} folder="trip-ideas" label={labels.ogImage} />
      </div>

      <div className="admin-row" style={{ gap: "1rem" }}>
        <label className="admin-field" style={{ flex: 1 }}>
          <span>{labels.metaTitle}</span>
          <input className="admin-input" type="text" name="metaTitle" defaultValue={v.metaTitle ?? ""} maxLength={255} />
        </label>
        <label className="admin-field" style={{ flex: "0 1 140px" }}>
          <span>{labels.sortOrder}</span>
          <input className="admin-input" type="number" name="sortOrder" defaultValue={v.sortOrder ?? 0} min={0} max={100000} />
        </label>
      </div>
      <label className="admin-field">
        <span>{labels.metaDesc}</span>
        <textarea className="admin-textarea" name="metaDesc" defaultValue={v.metaDesc ?? ""} maxLength={320} style={{ minHeight: "4rem" }} />
      </label>
    </div>
  );
}
