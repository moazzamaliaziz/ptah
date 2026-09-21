"use client";

import { useActionState, type JSX } from "react";
import TourFormFields, { toFieldValues } from "@/components/admin/TourFormFields";
import { updateTourAction, type CatalogFormState } from "../actions";
import type { TourInput } from "@/content/catalog-admin-schema";

export interface TourEditorProps {
  /** Core tour fields — itinerary/departures/links are sibling page sections. */
  tour: TourInput & { id: string; status: string; basePriceCents: number };
}

/**
 * Core-fields editor for an existing tour. Renders the shared <TourFormFields>
 * (identical to the create form), updating the SAME record via updateTour — no
 * duplicate is ever created. Itinerary, departures, destination links and
 * status/delete live in sibling sections on the page. An unsaved-changes guard
 * (inside TourFormFields) warns before navigating away with pending edits.
 */
export default function TourEditor({ tour }: TourEditorProps): JSX.Element {
  const [state, formAction, pending] = useActionState<CatalogFormState, FormData>(
    updateTourAction,
    {},
  );

  return (
    <form action={formAction} className="admin-card">
      <input type="hidden" name="id" value={tour.id} />
      {state.error ? (
        <div className="admin-alert admin-alert--error" role="alert">{state.error}</div>
      ) : null}
      {state.ok ? (
        <div className="admin-alert admin-alert--ok" role="status">Saved.</div>
      ) : null}

      <TourFormFields initial={toFieldValues(tour)} saved={state.ok} pending={pending} />

      <div className="admin-row" style={{ marginTop: "0.75rem" }}>
        <button className="admin-btn" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save tour"}
        </button>
      </div>
    </form>
  );
}
