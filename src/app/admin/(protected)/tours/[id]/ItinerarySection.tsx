"use client";

import { useActionState, useState, type JSX } from "react";
import {
  addItineraryDayAction,
  updateItineraryDayAction,
  deleteItineraryDayAction,
  type CatalogFormState,
} from "../actions";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import type { ItinerarySectionDict } from "@/i18n/admin/dictionary";

export interface ItineraryDayRow {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
}

export interface ItinerarySectionProps {
  tourId: string;
  days: ItineraryDayRow[];
  /** Localized labels. */
  labels: ItinerarySectionDict;
}

/** Add-day form + per-day inline edit/delete. Each day is its own <form>. */
export default function ItinerarySection({ tourId, days, labels }: ItinerarySectionProps): JSX.Element {
  const [addState, addAction, adding] = useActionState<CatalogFormState, FormData>(addItineraryDayAction, {});
  const nextDay = days.reduce((max, d) => Math.max(max, d.dayNumber), 0) + 1;

  return (
    <section className="admin-card">
      <h2>{labels.heading}</h2>
      <p className="admin-card__meta">{labels.hint}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.75rem" }}>
        {days.map((day) => (
          <ItineraryDayForm key={day.id} tourId={tourId} day={day} labels={labels} />
        ))}
      </div>

      <form action={addAction} className="admin-card" style={{ marginTop: "1rem", background: "rgba(26,35,64,0.03)" }}>
        <input type="hidden" name="tourId" value={tourId} />
        <h3 style={{ margin: "0 0 0.5rem" }}>{labels.addHeading}</h3>
        {addState.error ? (
          <div className="admin-alert admin-alert--error" role="alert">{addState.error}</div>
        ) : null}
        <div className="admin-row" style={{ gap: "0.75rem" }}>
          <label className="admin-field" style={{ flex: "0 1 90px" }}>
            <span>{labels.day}</span>
            <input className="admin-input" type="number" name="dayNumber" defaultValue={nextDay} min={1} max={365} required />
          </label>
          <label className="admin-field" style={{ flex: "2 1 220px" }}>
            <span>{labels.title}</span>
            <input className="admin-input" type="text" name="title" maxLength={255} required />
          </label>
        </div>
        <label className="admin-field">
          <span>{labels.description}</span>
          <textarea className="admin-textarea" name="description" required style={{ minHeight: "4rem" }} />
        </label>
        <button className="admin-btn" type="submit" disabled={adding}>{adding ? labels.adding : labels.addBtn}</button>
      </form>
    </section>
  );
}

function ItineraryDayForm({ tourId, day, labels }: { tourId: string; day: ItineraryDayRow; labels: ItinerarySectionDict }): JSX.Element {
  const [state, action, pending] = useActionState<CatalogFormState, FormData>(updateItineraryDayAction, {});
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-card" style={{ padding: "0.75rem" }}>
      <div className="admin-row admin-row--between">
        <strong>{labels.dayWord} {day.dayNumber}: {day.title}</strong>
        <button type="button" className="admin-btn admin-btn--ghost" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? labels.close : labels.edit}
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
              <div className="admin-alert admin-alert--ok" role="status">{labels.saved}</div>
            ) : null}
            <div className="admin-row" style={{ gap: "0.75rem" }}>
              <label className="admin-field" style={{ flex: "0 1 90px" }}>
                <span>{labels.day}</span>
                <input className="admin-input" type="number" name="dayNumber" defaultValue={day.dayNumber} min={1} max={365} required />
              </label>
              <label className="admin-field" style={{ flex: "2 1 220px" }}>
                <span>{labels.title}</span>
                <input className="admin-input" type="text" name="title" defaultValue={day.title} maxLength={255} required />
              </label>
            </div>
            <label className="admin-field">
              <span>{labels.description}</span>
              <textarea className="admin-textarea" name="description" defaultValue={day.description} required style={{ minHeight: "4rem" }} />
            </label>
            <button className="admin-btn" type="submit" disabled={pending}>{pending ? labels.saving : labels.saveDay}</button>
          </form>
          <form action={deleteItineraryDayAction} style={{ marginTop: "0.5rem" }}>
            <input type="hidden" name="tourId" value={tourId} />
            <input type="hidden" name="dayId" value={day.id} />
            <ConfirmSubmitButton confirm={labels.deleteDayConfirm}>
              {labels.deleteDay}
            </ConfirmSubmitButton>
          </form>
        </>
      ) : (
        <p className="admin-card__meta" style={{ marginTop: "0.35rem" }}>{day.description}</p>
      )}
    </div>
  );
}
