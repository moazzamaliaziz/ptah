"use client";

import { useActionState, useState, type JSX } from "react";
import {
  addDepartureAction,
  updateDepartureAction,
  deleteDepartureAction,
  type CatalogFormState,
} from "../actions";
import { DEPARTURE_STATUSES, centsToDollars } from "@/content/catalog-admin-schema";
import type { DeparturesSectionDict } from "@/i18n/admin/dictionary";

export interface DepartureRow {
  id: string;
  startDate: string;
  endDate: string;
  maxCapacity: number;
  remainingCapacity: number;
  bookedSeats: number;
  priceOverrideCents: number | null;
  status: string;
}

export interface DeparturesSectionProps {
  tourId: string;
  currency: string;
  departures: DepartureRow[];
  /** Localized labels; `hint` carries a `{currency}` token substituted here. */
  labels: DeparturesSectionDict;
}

/** Add-departure form + per-departure inline edit/delete. */
export default function DeparturesSection({ tourId, currency, departures, labels }: DeparturesSectionProps): JSX.Element {
  const [addState, addAction, adding] = useActionState<CatalogFormState, FormData>(addDepartureAction, {});

  return (
    <section className="admin-card">
      <h2>{labels.heading}</h2>
      <p className="admin-card__meta">
        {labels.hint.replace("{currency}", currency)}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.75rem" }}>
        {departures.map((d) => (
          <DepartureForm key={d.id} tourId={tourId} departure={d} labels={labels} />
        ))}
      </div>

      <form action={addAction} className="admin-card" style={{ marginTop: "1rem", background: "rgba(26,35,64,0.03)" }}>
        <input type="hidden" name="tourId" value={tourId} />
        <h3 style={{ margin: "0 0 0.5rem", fontSize: "0.95rem" }}>{labels.addHeading}</h3>
        {addState.error ? (
          <div className="admin-alert admin-alert--error" role="alert">{addState.error}</div>
        ) : null}
        <div className="admin-row" style={{ gap: "0.75rem" }}>
          <label className="admin-field" style={{ flex: "1 1 150px" }}>
            <span>{labels.startDate}</span>
            <input className="admin-input" type="date" name="startDate" required />
          </label>
          <label className="admin-field" style={{ flex: "1 1 150px" }}>
            <span>{labels.endDate}</span>
            <input className="admin-input" type="date" name="endDate" required />
          </label>
          <label className="admin-field" style={{ flex: "0 1 110px" }}>
            <span>{labels.capacity}</span>
            <input className="admin-input" type="number" name="maxCapacity" min={1} max={10000} required />
          </label>
          <label className="admin-field" style={{ flex: "0 1 130px" }}>
            <span>{labels.priceOverride}</span>
            <input className="admin-input" type="text" name="priceOverride" inputMode="decimal" placeholder={labels.priceOverridePlaceholder} />
          </label>
          <label className="admin-field" style={{ flex: "0 1 130px" }}>
            <span>{labels.status}</span>
            <select className="admin-input" name="status" defaultValue="OPEN">
              {DEPARTURE_STATUSES.map((s) => (
                <option key={s} value={s}>{labels.statusLabels[s] ?? s}</option>
              ))}
            </select>
          </label>
        </div>
        <button className="admin-btn" type="submit" disabled={adding}>{adding ? labels.adding : labels.addBtn}</button>
      </form>
    </section>
  );
}

function DepartureForm({ tourId, departure, labels }: { tourId: string; departure: DepartureRow; labels: DeparturesSectionDict }): JSX.Element {
  const [state, action, pending] = useActionState<CatalogFormState, FormData>(updateDepartureAction, {});
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-card" style={{ padding: "0.75rem" }}>
      <div className="admin-row admin-row--between">
        <div>
          <strong>{departure.startDate} → {departure.endDate}</strong>
          <div className="admin-card__meta">
            <span className={`admin-badge ${departure.status === "OPEN" ? "admin-badge--gold" : "admin-badge--off"}`}>{labels.statusLabels[departure.status] ?? departure.status}</span>
            {" "}{departure.bookedSeats}/{departure.maxCapacity} {labels.bookedSuffix}
          </div>
        </div>
        <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setOpen((v) => !v)}>
          {open ? labels.close : labels.edit}
        </button>
      </div>
      {open ? (
        <>
          <form action={action} style={{ marginTop: "0.5rem" }}>
            <input type="hidden" name="tourId" value={tourId} />
            <input type="hidden" name="departureId" value={departure.id} />
            {state.error ? (
              <div className="admin-alert admin-alert--error" role="alert">{state.error}</div>
            ) : null}
            {state.ok ? (
              <div className="admin-alert admin-alert--ok" role="status">{labels.saved}</div>
            ) : null}
            <div className="admin-row" style={{ gap: "0.75rem" }}>
              <label className="admin-field" style={{ flex: "1 1 150px" }}>
                <span>{labels.startDate}</span>
                <input className="admin-input" type="date" name="startDate" defaultValue={departure.startDate} required />
              </label>
              <label className="admin-field" style={{ flex: "1 1 150px" }}>
                <span>{labels.endDate}</span>
                <input className="admin-input" type="date" name="endDate" defaultValue={departure.endDate} required />
              </label>
              <label className="admin-field" style={{ flex: "0 1 110px" }}>
                <span>{labels.capacity}</span>
                <input className="admin-input" type="number" name="maxCapacity" defaultValue={departure.maxCapacity} min={1} max={10000} required />
              </label>
              <label className="admin-field" style={{ flex: "0 1 130px" }}>
                <span>{labels.priceOverride}</span>
                <input
                  className="admin-input"
                  type="text"
                  name="priceOverride"
                  inputMode="decimal"
                  defaultValue={departure.priceOverrideCents !== null ? centsToDollars(departure.priceOverrideCents) : ""}
                  placeholder={labels.priceOverridePlaceholder}
                />
              </label>
              <label className="admin-field" style={{ flex: "0 1 130px" }}>
                <span>{labels.status}</span>
                <select className="admin-input" name="status" defaultValue={departure.status}>
                  {DEPARTURE_STATUSES.map((s) => (
                    <option key={s} value={s}>{labels.statusLabels[s] ?? s}</option>
                  ))}
                </select>
              </label>
            </div>
            <button className="admin-btn" type="submit" disabled={pending}>{pending ? labels.saving : labels.saveDeparture}</button>
          </form>
          {departure.bookedSeats === 0 ? (
            <form action={deleteDepartureAction} style={{ marginTop: "0.5rem" }}>
              <input type="hidden" name="tourId" value={tourId} />
              <input type="hidden" name="departureId" value={departure.id} />
              <button className="admin-btn admin-btn--danger" type="submit">{labels.deleteDeparture}</button>
            </form>
          ) : (
            <p className="admin-card__meta" style={{ marginTop: "0.5rem" }}>
              {labels.hasBookingsNote}
            </p>
          )}
        </>
      ) : null}
    </div>
  );
}
