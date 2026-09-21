"use client";

import { useActionState, useState, type JSX } from "react";
import {
  addDepartureAction,
  updateDepartureAction,
  deleteDepartureAction,
  type CatalogFormState,
} from "../actions";
import { DEPARTURE_STATUSES, centsToDollars } from "@/content/catalog-admin-schema";

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
}

/** Add-departure form + per-departure inline edit/delete. */
export default function DeparturesSection({ tourId, currency, departures }: DeparturesSectionProps): JSX.Element {
  const [addState, addAction, adding] = useActionState<CatalogFormState, FormData>(addDepartureAction, {});

  return (
    <section className="admin-card">
      <h2>Departures</h2>
      <p className="admin-card__meta">
        Dates customers can book. Only OPEN, future departures show publicly. Price override is optional
        (blank inherits the base price). Currency: {currency}.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.75rem" }}>
        {departures.map((d) => (
          <DepartureForm key={d.id} tourId={tourId} departure={d} />
        ))}
      </div>

      <form action={addAction} className="admin-card" style={{ marginTop: "1rem", background: "rgba(26,35,64,0.03)" }}>
        <input type="hidden" name="tourId" value={tourId} />
        <h3 style={{ margin: "0 0 0.5rem", fontSize: "0.95rem" }}>Add a departure</h3>
        {addState.error ? (
          <div className="admin-alert admin-alert--error" role="alert">{addState.error}</div>
        ) : null}
        <div className="admin-row" style={{ gap: "0.75rem" }}>
          <label className="admin-field" style={{ flex: "1 1 150px" }}>
            <span>Start date</span>
            <input className="admin-input" type="date" name="startDate" required />
          </label>
          <label className="admin-field" style={{ flex: "1 1 150px" }}>
            <span>End date</span>
            <input className="admin-input" type="date" name="endDate" required />
          </label>
          <label className="admin-field" style={{ flex: "0 1 110px" }}>
            <span>Capacity</span>
            <input className="admin-input" type="number" name="maxCapacity" min={1} max={10000} required />
          </label>
          <label className="admin-field" style={{ flex: "0 1 130px" }}>
            <span>Price override</span>
            <input className="admin-input" type="text" name="priceOverride" inputMode="decimal" placeholder="(base)" />
          </label>
          <label className="admin-field" style={{ flex: "0 1 130px" }}>
            <span>Status</span>
            <select className="admin-input" name="status" defaultValue="OPEN">
              {DEPARTURE_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
        <button className="admin-btn" type="submit" disabled={adding}>{adding ? "Adding…" : "Add departure"}</button>
      </form>
    </section>
  );
}

function DepartureForm({ tourId, departure }: { tourId: string; departure: DepartureRow }): JSX.Element {
  const [state, action, pending] = useActionState<CatalogFormState, FormData>(updateDepartureAction, {});
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-card" style={{ padding: "0.75rem" }}>
      <div className="admin-row admin-row--between">
        <div>
          <strong>{departure.startDate} → {departure.endDate}</strong>
          <div className="admin-card__meta">
            <span className={`admin-badge ${departure.status === "OPEN" ? "admin-badge--gold" : "admin-badge--off"}`}>{departure.status}</span>
            {" "}{departure.bookedSeats}/{departure.maxCapacity} booked
          </div>
        </div>
        <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setOpen((v) => !v)}>
          {open ? "Close" : "Edit"}
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
              <div className="admin-alert admin-alert--ok" role="status">Saved.</div>
            ) : null}
            <div className="admin-row" style={{ gap: "0.75rem" }}>
              <label className="admin-field" style={{ flex: "1 1 150px" }}>
                <span>Start date</span>
                <input className="admin-input" type="date" name="startDate" defaultValue={departure.startDate} required />
              </label>
              <label className="admin-field" style={{ flex: "1 1 150px" }}>
                <span>End date</span>
                <input className="admin-input" type="date" name="endDate" defaultValue={departure.endDate} required />
              </label>
              <label className="admin-field" style={{ flex: "0 1 110px" }}>
                <span>Capacity</span>
                <input className="admin-input" type="number" name="maxCapacity" defaultValue={departure.maxCapacity} min={1} max={10000} required />
              </label>
              <label className="admin-field" style={{ flex: "0 1 130px" }}>
                <span>Price override</span>
                <input
                  className="admin-input"
                  type="text"
                  name="priceOverride"
                  inputMode="decimal"
                  defaultValue={departure.priceOverrideCents !== null ? centsToDollars(departure.priceOverrideCents) : ""}
                  placeholder="(base)"
                />
              </label>
              <label className="admin-field" style={{ flex: "0 1 130px" }}>
                <span>Status</span>
                <select className="admin-input" name="status" defaultValue={departure.status}>
                  {DEPARTURE_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </label>
            </div>
            <button className="admin-btn" type="submit" disabled={pending}>{pending ? "Saving…" : "Save departure"}</button>
          </form>
          {departure.bookedSeats === 0 ? (
            <form action={deleteDepartureAction} style={{ marginTop: "0.5rem" }}>
              <input type="hidden" name="tourId" value={tourId} />
              <input type="hidden" name="departureId" value={departure.id} />
              <button className="admin-btn admin-btn--danger" type="submit">Delete departure</button>
            </form>
          ) : (
            <p className="admin-card__meta" style={{ marginTop: "0.5rem" }}>
              Has bookings — set to CANCELED instead of deleting.
            </p>
          )}
        </>
      ) : null}
    </div>
  );
}
