"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { formatPriceCents } from "@/lib/utils";
import {
  submitBookingAction,
  type BookingFormState,
} from "@/app/(site)/booking/[tourSlug]/actions";

export interface BookingDepartureOption {
  id: string;
  label: string;
  priceCents: number;
  currency: string;
  remainingCapacity: number;
}

export type PaymentMethod = "stripe" | "paypal" | "bank_transfer";

const METHOD_META: Record<PaymentMethod, { label: string; blurb: string }> = {
  stripe: { label: "Card", blurb: "Pay securely by card via Stripe." },
  paypal: { label: "PayPal", blurb: "Pay with your PayPal account." },
  bank_transfer: { label: "Bank transfer", blurb: "Get bank details and pay by transfer; we confirm on receipt." },
};

function SubmitButton({ totalLabel, offline }: { totalLabel: string; offline: boolean }) {
  const { pending } = useFormStatus();
  const idle = offline
    ? `Continue to bank details · ${totalLabel}`
    : `Continue to payment · ${totalLabel}`;
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-nile px-6 py-3.5 text-btn text-white transition-colors hover:bg-nile/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nile disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Working…" : idle}
    </button>
  );
}

/**
 * Booking form (Phase 3). Client island: departure select, traveler stepper,
 * contact details. Submits to the CSRF-safe server action, which claims seats
 * atomically then redirects to Stripe. Live total is display-only; the server
 * re-prices authoritatively.
 */
export default function BookingForm({
  departures,
  initialDepartureId,
  methods = ["stripe"],
}: {
  departures: BookingDepartureOption[];
  initialDepartureId?: string;
  methods?: PaymentMethod[];
}) {
  const firstBookable = departures.find((d) => d.remainingCapacity > 0);
  const [departureId, setDepartureId] = useState(
    initialDepartureId && departures.some((d) => d.id === initialDepartureId && d.remainingCapacity > 0)
      ? initialDepartureId
      : firstBookable?.id ?? departures[0]?.id ?? "",
  );
  const [seats, setSeats] = useState(1);
  const availableMethods = methods.length > 0 ? methods : (["stripe"] as PaymentMethod[]);
  const [method, setMethod] = useState<PaymentMethod>(availableMethods[0] ?? "stripe");
  const [state, formAction] = useActionState<BookingFormState, FormData>(submitBookingAction, {
    error: null,
  });

  const selected = useMemo(
    () => departures.find((d) => d.id === departureId),
    [departures, departureId],
  );
  const maxSeats = Math.max(1, Math.min(selected?.remainingCapacity ?? 1, 20));
  const clampedSeats = Math.min(seats, maxSeats);
  const totalCents = (selected?.priceCents ?? 0) * clampedSeats;
  const totalLabel = selected ? formatPriceCents(totalCents, selected.currency) : "—";

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div
          role="alert"
          className="rounded-xl border border-rust/40 bg-rust/5 p-4 text-meta font-medium text-rust"
        >
          {state.error}
        </div>
      )}

      <fieldset className="space-y-3">
        <legend className="text-card-title font-semibold text-ink">Choose your departure</legend>
        <div className="space-y-2">
          {departures.map((d) => {
            const soldOut = d.remainingCapacity <= 0;
            return (
              <label
                key={d.id}
                className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border p-3.5 transition-colors ${
                  departureId === d.id
                    ? "border-nile bg-nile/5"
                    : "border-grey-300/60 hover:border-nile/40"
                } ${soldOut ? "cursor-not-allowed opacity-55" : ""}`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="departureId"
                    value={d.id}
                    checked={departureId === d.id}
                    disabled={soldOut}
                    onChange={() => {
                      setDepartureId(d.id);
                      setSeats((s) => Math.min(s, Math.max(1, d.remainingCapacity)));
                    }}
                    className="h-4 w-4 accent-nile"
                  />
                  <span className="text-body text-ink">{d.label}</span>
                </span>
                <span className="text-right">
                  <span className="block font-semibold text-nile">
                    {formatPriceCents(d.priceCents, d.currency)}
                  </span>
                  <span className="block text-[11px] text-ink/50">
                    {soldOut ? "Sold out" : `${d.remainingCapacity} left`}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-card-title font-semibold text-ink">Travelers</legend>
        <div className="mt-2 flex items-center gap-4">
          <div className="inline-flex items-center rounded-full border border-grey-300/70">
            <button
              type="button"
              aria-label="Fewer travelers"
              onClick={() => setSeats((s) => Math.max(1, s - 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-nile hover:bg-nile/5 disabled:opacity-40"
              disabled={clampedSeats <= 1}
            >
              −
            </button>
            <span className="w-10 text-center text-body font-semibold text-ink" aria-live="polite">
              {clampedSeats}
            </span>
            <button
              type="button"
              aria-label="More travelers"
              onClick={() => setSeats((s) => Math.min(maxSeats, s + 1))}
              className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-nile hover:bg-nile/5 disabled:opacity-40"
              disabled={clampedSeats >= maxSeats}
            >
              +
            </button>
          </div>
          <span className="text-meta text-ink/55">
            {selected ? `Up to ${maxSeats} on this departure` : "Select a departure"}
          </span>
        </div>
        {/* Authoritative seat count for the server action. */}
        <input type="hidden" name="seats" value={clampedSeats} />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-card-title font-semibold text-ink">Your details</legend>
        <label className="block">
          <span className="mb-1 block text-meta font-medium text-ink/70">Full name</span>
          <input
            type="text"
            name="fullName"
            required
            autoComplete="name"
            className="w-full rounded-xl border border-grey-300/70 bg-white px-4 py-2.5 text-body text-ink outline-none focus-visible:border-nile"
          />
        </label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-meta font-medium text-ink/70">Email</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-grey-300/70 bg-white px-4 py-2.5 text-body text-ink outline-none focus-visible:border-nile"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-meta font-medium text-ink/70">Phone</span>
            <input
              type="tel"
              name="phone"
              required
              autoComplete="tel"
              className="w-full rounded-xl border border-grey-300/70 bg-white px-4 py-2.5 text-body text-ink outline-none focus-visible:border-nile"
            />
          </label>
        </div>
        <label className="block">
          <span className="mb-1 block text-meta font-medium text-ink/70">
            Notes <span className="text-ink/40">(optional)</span>
          </span>
          <textarea
            name="notes"
            rows={3}
            maxLength={2000}
            placeholder="Dietary needs, accessibility, arrival details…"
            className="w-full resize-y rounded-xl border border-grey-300/70 bg-white px-4 py-2.5 text-body text-ink outline-none focus-visible:border-nile"
          />
        </label>
      </fieldset>

      {availableMethods.length > 1 ? (
        <fieldset className="space-y-2">
          <legend className="text-card-title font-semibold text-ink">How would you like to pay?</legend>
          {availableMethods.map((m) => (
            <label
              key={m}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors ${
                method === m ? "border-nile bg-nile/5" : "border-grey-300/60 hover:border-nile/40"
              }`}
            >
              <input
                type="radio"
                name="method"
                value={m}
                checked={method === m}
                onChange={() => setMethod(m)}
                className="mt-1 h-4 w-4 accent-nile"
              />
              <span>
                <span className="block text-body font-medium text-ink">{METHOD_META[m].label}</span>
                <span className="block text-[11px] text-ink/55">{METHOD_META[m].blurb}</span>
              </span>
            </label>
          ))}
        </fieldset>
      ) : (
        <input type="hidden" name="method" value={method} />
      )}

      <div className="rounded-xl bg-papyrus/60 p-4">
        <div className="flex items-center justify-between text-body">
          <span className="text-ink/70">
            {clampedSeats} × {selected ? formatPriceCents(selected.priceCents, selected.currency) : "—"}
          </span>
          <span className="text-lg font-bold text-nile">{totalLabel}</span>
        </div>
        <p className="mt-1 text-[11px] text-ink/50">
          {method === "bank_transfer"
            ? "Your seats are held while you arrange the transfer; we confirm on receipt."
            : "Full payment is taken now via secure checkout."}
        </p>
      </div>

      <SubmitButton totalLabel={totalLabel} offline={method === "bank_transfer"} />
      <p className="text-center text-[11px] text-ink/45">
        {method === "bank_transfer"
          ? "We'll show you the bank details and your booking reference next. Your seats are held while you transfer."
          : "You'll be redirected to complete payment. Your seats are held while you check out."}
      </p>
    </form>
  );
}
