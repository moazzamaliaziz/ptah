"use client";

import { useActionState, useEffect, useRef, type JSX } from "react";
import TourFormFields, { toFieldValues } from "@/components/admin/TourFormFields";
import { updateTourAction, type CatalogFormState } from "../actions";
import type { TourInput } from "@/content/catalog-admin-schema";
import type { TourFormFieldsDict, FaqEditorDict } from "@/i18n/admin/dictionary";

export interface TourEditorProps {
  /** Core tour fields — itinerary/departures/links are sibling page sections. */
  tour: TourInput & { id: string; status: string; basePriceCents: number };
  /** Localized field labels forwarded to <TourFormFields>. */
  fields: TourFormFieldsDict;
  /** Localized labels for the nested FAQ editor. */
  faqLabels: FaqEditorDict;
  /** "Saved." success notice. */
  savedLabel: string;
  /** Submit button label while pending. */
  savingLabel: string;
  /** Submit button label at rest. */
  saveLabel: string;
}

/**
 * Core-fields editor for an existing tour. Renders the shared <TourFormFields>
 * (identical to the create form), updating the SAME record via updateTour — no
 * duplicate is ever created. Itinerary, departures, destination links and
 * status/delete live in sibling sections on the page. An unsaved-changes guard
 * (inside TourFormFields) warns before navigating away with pending edits.
 */
export default function TourEditor({ tour, fields, faqLabels, savedLabel, savingLabel, saveLabel }: TourEditorProps): JSX.Element {
  const [state, formAction, pending] = useActionState<CatalogFormState, FormData>(
    updateTourAction,
    {},
  );
  const alertsRef = useRef<HTMLDivElement>(null);
  // After a save resolves, bring the success/error notice into view — the submit
  // button sits below the fields, so a blind save could otherwise look silent.
  useEffect(() => {
    if (state.ok || state.error) {
      alertsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [state]);

  return (
    <form action={formAction} className="admin-card">
      <input type="hidden" name="id" value={tour.id} />
      <div ref={alertsRef}>
        {state.error ? (
          <div className="admin-alert admin-alert--error" role="alert">{state.error}</div>
        ) : null}
        {state.ok ? (
          <div className="admin-alert admin-alert--ok" role="status">{savedLabel}</div>
        ) : null}
      </div>

      <TourFormFields initial={toFieldValues(tour)} saved={state.ok} pending={pending} labels={fields} faqLabels={faqLabels} />

      <div className="admin-row" style={{ marginTop: "0.75rem" }}>
        <button className="admin-btn" type="submit" disabled={pending}>
          {pending ? savingLabel : saveLabel}
        </button>
      </div>
    </form>
  );
}
