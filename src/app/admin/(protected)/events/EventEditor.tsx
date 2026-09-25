"use client";

import { useActionState, type JSX } from "react";
import EventFormFields from "@/components/admin/EventFormFields";
import { updateEventAction, type EventFormState } from "./actions";
import type { AdminEventDetail } from "@/server/admin/events-admin";
import type { EventFormFieldsDict } from "@/i18n/admin/dictionary";

export interface EventEditorProps {
  event: AdminEventDetail;
  fields: EventFormFieldsDict;
  savedLabel: string;
  savingLabel: string;
  saveLabel: string;
}

export default function EventEditor({ event, fields, savedLabel, savingLabel, saveLabel }: EventEditorProps): JSX.Element {
  const [state, action, pending] = useActionState<EventFormState, FormData>(updateEventAction, {});

  return (
    <form action={action} className="admin-form">
      <input type="hidden" name="id" value={event.id} />

      {state.error ? (
        <div className="admin-alert admin-alert--error" role="alert">{state.error}</div>
      ) : null}
      {state.ok ? (
        <div className="admin-alert admin-alert--ok" role="status">{savedLabel}</div>
      ) : null}

      <EventFormFields initial={event} saved={state.ok} pending={pending} labels={fields} />

      <div className="admin-row" style={{ marginTop: "1rem" }}>
        <button className="admin-btn" type="submit" disabled={pending}>
          {pending ? savingLabel : saveLabel}
        </button>
      </div>
    </form>
  );
}
