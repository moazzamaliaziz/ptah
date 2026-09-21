"use client";

import { useActionState, type JSX } from "react";
import TourFormFields from "@/components/admin/TourFormFields";
import { createTourAction, type CatalogFormState } from "../actions";

/**
 * Create form. Renders the SAME complete field set as the editor
 * (<TourFormFields>), so FAQs, media, inclusions, CTA and SEO can be set at
 * creation — not only later. The tour is created as a DRAFT and the action
 * redirects into its editor (where itinerary + departures live).
 */
export default function NewTourForm(): JSX.Element {
  const [state, formAction, pending] = useActionState<CatalogFormState, FormData>(createTourAction, {});

  return (
    <form action={formAction} className="admin-card">
      {state.error ? (
        <div className="admin-alert admin-alert--error" role="alert">{state.error}</div>
      ) : null}

      <TourFormFields pending={pending} />

      <div className="admin-row" style={{ marginTop: "0.75rem" }}>
        <button className="admin-btn" type="submit" disabled={pending}>
          {pending ? "Creating…" : "Create draft & continue"}
        </button>
        <span className="admin-card__meta">
          Created as a draft — add itinerary &amp; departures, then publish from the editor.
        </span>
      </div>
    </form>
  );
}
