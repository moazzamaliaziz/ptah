"use client";

import { useActionState, type JSX } from "react";
import EventFormFields from "@/components/admin/EventFormFields";
import { createEventAction, type EventFormState } from "../actions";
import type { EventFormFieldsDict } from "@/i18n/admin/dictionary";

export interface NewEventFormProps {
  fields: EventFormFieldsDict;
  creatingLabel: string;
  createLabel: string;
}

export default function NewEventForm({ fields, creatingLabel, createLabel }: NewEventFormProps): JSX.Element {
  const [state, action, pending] = useActionState<EventFormState, FormData>(createEventAction, {});

  return (
    <form action={action} className="admin-form">
      {state.error ? (
        <div className="admin-alert admin-alert--error" role="alert">{state.error}</div>
      ) : null}

      <EventFormFields pending={pending} labels={fields} />

      <div className="admin-row" style={{ marginTop: "1rem" }}>
        <button className="admin-btn" type="submit" disabled={pending}>
          {pending ? creatingLabel : createLabel}
        </button>
      </div>
    </form>
  );
}
