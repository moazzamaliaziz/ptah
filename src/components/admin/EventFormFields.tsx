"use client";

import { useEffect, useRef, useState, type JSX } from "react";
import MediaPicker from "@/components/admin/MediaPicker";
import { useBeforeUnloadWarning } from "@/hooks/use-beforeunload-warning";
import type { EventInput } from "@/content/events-admin-schema";
import type { EventFormFieldsDict } from "@/i18n/admin/dictionary";

export interface EventFormFieldsProps {
  initial?: Partial<EventInput> & { id?: string };
  saved?: boolean;
  pending?: boolean;
  labels: EventFormFieldsDict;
}

/**
 * Complete set of editable Event fields, shared by the create form and the
 * editor so both capture every field. Includes the unsaved-changes guard.
 * All visible copy arrives localized via `labels`.
 */
export default function EventFormFields({ initial, saved, pending, labels }: EventFormFieldsProps): JSX.Element {
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
          <input className="admin-input" type="text" name="slug" defaultValue={v.slug ?? ""} maxLength={191} placeholder="abu-simbel-sun-festival" required />
        </label>
      </div>

      <label className="admin-field">
        <span>{labels.summary}</span>
        <input className="admin-input" type="text" name="summary" defaultValue={v.summary ?? ""} maxLength={512} required />
      </label>

      <label className="admin-field">
        <span>{labels.description}</span>
        <textarea className="admin-textarea" name="description" defaultValue={v.description ?? ""} required style={{ minHeight: "8rem" }} />
      </label>

      <div className="admin-row" style={{ gap: "1rem" }}>
        <label className="admin-field" style={{ flex: "2 1 220px" }}>
          <span>{labels.location}</span>
          <input className="admin-input" type="text" name="location" defaultValue={v.location ?? ""} maxLength={200} placeholder="Abu Simbel, Aswan" />
        </label>
        <label className="admin-field" style={{ flex: "1 1 150px" }}>
          <span>{labels.startDate}</span>
          <input className="admin-input" type="date" name="startDate" defaultValue={v.startDate ?? ""} required />
        </label>
        <label className="admin-field" style={{ flex: "1 1 150px" }}>
          <span>{labels.endDate}</span>
          <input className="admin-input" type="date" name="endDate" defaultValue={v.endDate ?? ""} />
        </label>
      </div>

      <label className="admin-field" style={{ flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
        <input type="checkbox" name="recurring" defaultChecked={v.recurring ?? false} />
        <span>{labels.recurring}</span>
      </label>

      <div className="admin-row" style={{ gap: "1rem" }}>
        <MediaPicker name="heroImage" emit="url" initialUrl={v.heroImage ?? null} folder="events" label={labels.heroImage} />
        <MediaPicker name="ogImage" emit="url" initialUrl={v.ogImage ?? null} folder="events" label={labels.ogImage} />
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
