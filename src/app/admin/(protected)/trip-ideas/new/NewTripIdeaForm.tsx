"use client";

import { useActionState, type JSX } from "react";
import TripIdeaFormFields from "@/components/admin/TripIdeaFormFields";
import { createTripIdeaAction, type TripIdeaFormState } from "../actions";
import type { TripIdeaFormFieldsDict } from "@/i18n/admin/dictionary";

export default function NewTripIdeaForm({
  fields,
  creatingLabel,
  createLabel,
}: {
  fields: TripIdeaFormFieldsDict;
  creatingLabel: string;
  createLabel: string;
}): JSX.Element {
  const [state, action, pending] = useActionState<TripIdeaFormState, FormData>(createTripIdeaAction, {});

  return (
    <form action={action} className="admin-form">
      {state.error ? (
        <div className="admin-alert admin-alert--error" role="alert">{state.error}</div>
      ) : null}

      <TripIdeaFormFields pending={pending} labels={fields} />

      <div className="admin-row" style={{ marginTop: "1rem" }}>
        <button className="admin-btn" type="submit" disabled={pending}>
          {pending ? creatingLabel : createLabel}
        </button>
      </div>
    </form>
  );
}
