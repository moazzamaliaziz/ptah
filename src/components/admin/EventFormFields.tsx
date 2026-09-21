"use client";

import { useEffect, useRef, useState, type JSX } from "react";
import MediaPicker from "@/components/admin/MediaPicker";
import { useBeforeUnloadWarning } from "@/hooks/use-beforeunload-warning";
import type { EventInput } from "@/content/events-admin-schema";

export interface EventFormFieldsProps {
  initial?: Partial<EventInput> & { id?: string };
  saved?: boolean;
  pending?: boolean;
}

/**
 * Complete set of editable Event fields, shared by the create form and the
 * editor so both capture every field. Includes the unsaved-changes guard.
 */
export default function EventFormFields({ initial, saved, pending }: EventFormFieldsProps): JSX.Element {
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
          Unsaved changes — remember to save before leaving this page.
        </div>
      ) : null}

      <div className="admin-row" style={{ gap: "1rem" }}>
        <label className="admin-field" style={{ flex: "2 1 260px" }}>
          <span>Title</span>
          <input className="admin-input" type="text" name="title" defaultValue={v.title ?? ""} maxLength={255} required />
        </label>
        <label className="admin-field" style={{ flex: "1 1 200px" }}>
          <span>Slug</span>
          <input className="admin-input" type="text" name="slug" defaultValue={v.slug ?? ""} maxLength={191} placeholder="abu-simbel-sun-festival" required />
        </label>
      </div>

      <label className="admin-field">
        <span>Summary</span>
        <input className="admin-input" type="text" name="summary" defaultValue={v.summary ?? ""} maxLength={512} required />
      </label>

      <label className="admin-field">
        <span>Description</span>
        <textarea className="admin-textarea" name="description" defaultValue={v.description ?? ""} required style={{ minHeight: "8rem" }} />
      </label>

      <div className="admin-row" style={{ gap: "1rem" }}>
        <label className="admin-field" style={{ flex: "2 1 220px" }}>
          <span>Location</span>
          <input className="admin-input" type="text" name="location" defaultValue={v.location ?? ""} maxLength={200} placeholder="Abu Simbel, Aswan" />
        </label>
        <label className="admin-field" style={{ flex: "1 1 150px" }}>
          <span>Start date</span>
          <input className="admin-input" type="date" name="startDate" defaultValue={v.startDate ?? ""} required />
        </label>
        <label className="admin-field" style={{ flex: "1 1 150px" }}>
          <span>End date (optional)</span>
          <input className="admin-input" type="date" name="endDate" defaultValue={v.endDate ?? ""} />
        </label>
      </div>

      <label className="admin-field" style={{ flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
        <input type="checkbox" name="recurring" defaultChecked={v.recurring ?? false} />
        <span>Recurring annual festival (date repeats each year)</span>
      </label>

      <div className="admin-row" style={{ gap: "1rem" }}>
        <MediaPicker name="heroImage" emit="url" initialUrl={v.heroImage ?? null} folder="events" label="Hero image" />
        <MediaPicker name="ogImage" emit="url" initialUrl={v.ogImage ?? null} folder="events" label="Social share image (OG)" />
      </div>

      <div className="admin-row" style={{ gap: "1rem" }}>
        <label className="admin-field" style={{ flex: 1 }}>
          <span>Meta title (SEO)</span>
          <input className="admin-input" type="text" name="metaTitle" defaultValue={v.metaTitle ?? ""} maxLength={255} />
        </label>
        <label className="admin-field" style={{ flex: "0 1 140px" }}>
          <span>Sort order</span>
          <input className="admin-input" type="number" name="sortOrder" defaultValue={v.sortOrder ?? 0} min={0} max={100000} />
        </label>
      </div>
      <label className="admin-field">
        <span>Meta description (SEO)</span>
        <textarea className="admin-textarea" name="metaDesc" defaultValue={v.metaDesc ?? ""} maxLength={320} style={{ minHeight: "4rem" }} />
      </label>
    </div>
  );
}
