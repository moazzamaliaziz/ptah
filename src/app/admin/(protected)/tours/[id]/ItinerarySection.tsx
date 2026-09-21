"use client";

import { useActionState, useState, type JSX } from "react";
import {
  addItineraryDayAction,
  updateItineraryDayAction,
  deleteItineraryDayAction,
  type CatalogFormState,
} from "../actions";

export interface ItineraryDayRow {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
}

export interface ItinerarySectionProps {
  tourId: string;
  days: ItineraryDayRow[];
}

/** Add-day form + per-day inline edit/delete. Each day is its own <form>. */
export default function ItinerarySection({ tourId, days }: ItinerarySectionProps): JSX.Element {
  const [addState, addAction, adding] = useActionState<CatalogFormState, FormData>(addItineraryDayAction, {});
  const nextDay = days.reduce((max, d) => Math.max(max, d.dayNumber), 0) + 1;

  return (
    <section className="admin-card">
      <h2>Itinerary</h2>
      <p className="admin-card__meta">Day-by-day plan shown on the tour page.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.75rem" }}>
        {days.map((day) => (
          <ItineraryDayForm key={day.id} tourId={tourId} day={day} />
        ))}
      </div>

      <form action={addAction} className="admin-card" style={{ marginTop: "1rem", background: "rgba(26,35,64,0.03)" }}>
        <input type="hidden" name="tourId" value={tourId} />
        <h3 style={{ margin: "0 0 0.5rem", fontSize: "0.95rem" }}>Add a day</h3>
        {addState.error ? (
          <div className="admin-alert admin-alert--error" role="alert">{addState.error}</div>
        ) : null}
        <div className="admin-row" style={{ gap: "0.75rem" }}>
          <label className="admin-field" style={{ flex: "0 1 90px" }}>
            <span>Day</span>
            <input className="admin-input" type="number" name="dayNumber" defaultValue={nextDay} min={1} max={365} required />
          </label>
          <label className="admin-field" style={{ flex: "2 1 220px" }}>
            <span>Title</span>
            <input className="admin-input" type="text" name="title" maxLength={255} required />
          </label>
        </div>
        <label className="admin-field">
          <span>Description</span>
          <textarea className="admin-textarea" name="description" required style={{ minHeight: "4rem" }} />
        </label>
        <button className="admin-btn" type="submit" disabled={adding}>{adding ? "Adding…" : "Add day"}</button>
      </form>
    </section>
  );
}

function ItineraryDayForm({ tourId, day }: { tourId: string; day: ItineraryDayRow }): JSX.Element {
  const [state, action, pending] = useActionState<CatalogFormState, FormData>(updateItineraryDayAction, {});
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-card" style={{ padding: "0.75rem" }}>
      <div className="admin-row admin-row--between">
        <strong>Day {day.dayNumber}: {day.title}</strong>
        <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setOpen((v) => !v)}>
          {open ? "Close" : "Edit"}
        </button>
      </div>
      {open ? (
        <>
          <form action={action} style={{ marginTop: "0.5rem" }}>
            <input type="hidden" name="tourId" value={tourId} />
            <input type="hidden" name="dayId" value={day.id} />
            {state.error ? (
              <div className="admin-alert admin-alert--error" role="alert">{state.error}</div>
            ) : null}
            {state.ok ? (
              <div className="admin-alert admin-alert--ok" role="status">Saved.</div>
            ) : null}
            <div className="admin-row" style={{ gap: "0.75rem" }}>
              <label className="admin-field" style={{ flex: "0 1 90px" }}>
                <span>Day</span>
                <input className="admin-input" type="number" name="dayNumber" defaultValue={day.dayNumber} min={1} max={365} required />
              </label>
              <label className="admin-field" style={{ flex: "2 1 220px" }}>
                <span>Title</span>
                <input className="admin-input" type="text" name="title" defaultValue={day.title} maxLength={255} required />
              </label>
            </div>
            <label className="admin-field">
              <span>Description</span>
              <textarea className="admin-textarea" name="description" defaultValue={day.description} required style={{ minHeight: "4rem" }} />
            </label>
            <button className="admin-btn" type="submit" disabled={pending}>{pending ? "Saving…" : "Save day"}</button>
          </form>
          <form action={deleteItineraryDayAction} style={{ marginTop: "0.5rem" }}>
            <input type="hidden" name="tourId" value={tourId} />
            <input type="hidden" name="dayId" value={day.id} />
            <button className="admin-btn admin-btn--danger" type="submit">Delete day</button>
          </form>
        </>
      ) : (
        <p className="admin-card__meta" style={{ marginTop: "0.35rem" }}>{day.description}</p>
      )}
    </div>
  );
}
