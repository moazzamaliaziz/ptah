"use client";

import { useActionState, type JSX } from "react";
import EventFormFields from "@/components/admin/EventFormFields";
import { updateEventAction, type EventFormState } from "./actions";
import type { AdminEventDetail } from "@/server/admin/events-admin";

export default function EventEditor({ event }: { event: AdminEventDetail }): JSX.Element {
  const [state, action, pending] = useActionState<EventFormState, FormData>(updateEventAction, {});

  return (
    <form action={action} className="admin-form">
      <input type="hidden" name="id" value={event.id} />

      {state.error ? (
        <div className="admin-alert admin-alert--error" role="alert">{state.error}</div>
      ) : null}
      {state.ok ? (
        <div className="admin-alert admin-alert--ok" role="status">Saved.</div>
      ) : null}

      <EventFormFields initial={event} saved={state.ok} pending={pending} />

      <div className="admin-row" style={{ marginTop: "1rem" }}>
        <button className="admin-btn" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
