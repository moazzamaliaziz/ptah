"use client";

import { useActionState, type JSX } from "react";
import TripIdeaFormFields from "@/components/admin/TripIdeaFormFields";
import { updateTripIdeaAction, type TripIdeaFormState } from "./actions";
import type { AdminTripIdeaDetail } from "@/server/admin/events-admin";
import type { TripIdeaFormFieldsDict } from "@/i18n/admin/dictionary";

export default function TripIdeaEditor({
  idea,
  fields,
  savedLabel,
  savingLabel,
  saveLabel,
}: {
  idea: AdminTripIdeaDetail;
  fields: TripIdeaFormFieldsDict;
  savedLabel: string;
  savingLabel: string;
  saveLabel: string;
}): JSX.Element {
  const [state, action, pending] = useActionState<TripIdeaFormState, FormData>(updateTripIdeaAction, {});

  return (
    <form action={action} className="admin-form">
      <input type="hidden" name="id" value={idea.id} />

      {state.error ? (
        <div className="admin-alert admin-alert--error" role="alert">{state.error}</div>
      ) : null}
      {state.ok ? (
        <div className="admin-alert admin-alert--ok" role="status">{savedLabel}</div>
      ) : null}

      <TripIdeaFormFields initial={idea} saved={state.ok} pending={pending} labels={fields} />

      <div className="admin-row" style={{ marginTop: "1rem" }}>
        <button className="admin-btn" type="submit" disabled={pending}>
          {pending ? savingLabel : saveLabel}
        </button>
      </div>
    </form>
  );
}
