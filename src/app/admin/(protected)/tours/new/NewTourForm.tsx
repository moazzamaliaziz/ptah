"use client";

import { useActionState, type JSX } from "react";
import TourFormFields from "@/components/admin/TourFormFields";
import { createTourAction, type CatalogFormState } from "../actions";
import type { TourFormFieldsDict, FaqEditorDict } from "@/i18n/admin/dictionary";

export interface NewTourFormProps {
  /** Localized field labels forwarded to <TourFormFields>. */
  fields: TourFormFieldsDict;
  /** Localized labels for the nested FAQ editor. */
  faqLabels: FaqEditorDict;
  /** Submit button label while pending. */
  creatingLabel: string;
  /** Submit button label at rest. */
  createLabel: string;
  /** Draft-mode explanatory note beside the button. */
  createHint: string;
}

/**
 * Create form. Renders the SAME complete field set as the editor
 * (<TourFormFields>), so FAQs, media, inclusions, CTA and SEO can be set at
 * creation — not only later. The tour is created as a DRAFT and the action
 * redirects into its editor (where itinerary + departures live).
 */
export default function NewTourForm({ fields, faqLabels, creatingLabel, createLabel, createHint }: NewTourFormProps): JSX.Element {
  const [state, formAction, pending] = useActionState<CatalogFormState, FormData>(createTourAction, {});

  return (
    <form action={formAction} className="admin-card">
      {state.error ? (
        <div className="admin-alert admin-alert--error" role="alert">{state.error}</div>
      ) : null}

      <TourFormFields pending={pending} labels={fields} faqLabels={faqLabels} />

      <div className="admin-row" style={{ marginTop: "0.75rem" }}>
        <button className="admin-btn" type="submit" disabled={pending}>
          {pending ? creatingLabel : createLabel}
        </button>
        <span className="admin-card__meta">
          {createHint}
        </span>
      </div>
    </form>
  );
}
