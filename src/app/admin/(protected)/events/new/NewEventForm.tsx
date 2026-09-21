"use client";

import { useActionState, type JSX } from "react";
import EventFormFields from "@/components/admin/EventFormFields";
import { createEventAction, type EventFormState } from "../actions";

export default function NewEventForm(): JSX.Element {
  const [state, action, pending] = useActionState<EventFormState, FormData>(createEventAction, {});

  return (
    <form action={action} className="admin-form">
      {state.error ? (
        <div className="admin-alert admin-alert--error" role="alert">{state.error}</div>
      ) : null}

      <EventFormFields pending={pending} />

      <div className="admin-row" style={{ marginTop: "1rem" }}>
        <button className="admin-btn" type="submit" disabled={pending}>
          {pending ? "Creating…" : "Create event (draft)"}
        </button>
      </div>
    </form>
  );
}
