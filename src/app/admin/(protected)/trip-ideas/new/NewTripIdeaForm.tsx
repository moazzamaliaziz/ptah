"use client";

import { useActionState, type JSX } from "react";
import TripIdeaFormFields from "@/components/admin/TripIdeaFormFields";
import { createTripIdeaAction, type TripIdeaFormState } from "../actions";

export default function NewTripIdeaForm(): JSX.Element {
  const [state, action, pending] = useActionState<TripIdeaFormState, FormData>(createTripIdeaAction, {});

  return (
    <form action={action} className="admin-form">
      {state.error ? (
        <div className="admin-alert admin-alert--error" role="alert">{state.error}</div>
      ) : null}

      <TripIdeaFormFields pending={pending} />

      <div className="admin-row" style={{ marginTop: "1rem" }}>
        <button className="admin-btn" type="submit" disabled={pending}>
          {pending ? "Creating…" : "Create trip idea (draft)"}
        </button>
      </div>
    </form>
  );
}
