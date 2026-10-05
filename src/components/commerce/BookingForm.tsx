"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useParams } from "next/navigation";
import { formatPriceCents } from "@/lib/utils";
import { MAX_SEATS, adultUnitCents, type GroupPriceTier } from "@/server/booking-core";
import DepartureCalendar from "@/components/commerce/DepartureCalendar";
import GroupPriceTable from "@/components/commerce/GroupPriceTable";
import {
  submitBookingAction,
  previewCouponAction,
  type BookingFormState,
} from "@/app/[lang]/(site)/booking/[tourSlug]/actions";
import type { CouponPreview } from "@/server/booking";
import type { PageContent } from "@/i18n/pages/en";

/** The success shape of a coupon preview, held while a code is applied. */
type AppliedCoupon = Extract<CouponPreview, { ok: true }>;

/** Static labels for this client island, sourced from the bookingTour slice. */
type FormLabels = PageContent["bookingTour"]["form"];

export interface BookingDepartureOption {
  id: string;
  label: string;
  priceCents: number;
  currency: string;
  remainingCapacity: number;
}

export type PaymentMethod = "stripe" | "paypal" | "bank_transfer";

// Payment-method label + blurb, resolved from the localized form labels.
function methodMeta(labels: FormLabels): Record<PaymentMethod, { label: string; blurb: string }> {
  return {
    stripe: { label: labels.methodCardLabel, blurb: labels.methodCardBlurb },
    paypal: { label: labels.methodPaypalLabel, blurb: labels.methodPaypalBlurb },
    bank_transfer: { label: labels.methodBankLabel, blurb: labels.methodBankBlurb },
  };
}

// Curated ISO 3166-1 alpha-2 country list for the billing-address <select>.
// Covers Egypt plus the major tourism source markets; extend as needed. The
// alpha-2 `code` is what gets stored in Booking.contactInfo.billing.country.
const COUNTRIES: { code: string; name: string }[] = [
  { code: "EG", name: "Egypt" },
  { code: "DZ", name: "Algeria" },
  { code: "AR", name: "Argentina" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BE", name: "Belgium" },
  { code: "BR", name: "Brazil" },
  { code: "CA", name: "Canada" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "CZ", name: "Czechia" },
  { code: "DK", name: "Denmark" },
  { code: "ET", name: "Ethiopia" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GR", name: "Greece" },
  { code: "HK", name: "Hong Kong" },
  { code: "HU", name: "Hungary" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JP", name: "Japan" },
  { code: "JO", name: "Jordan" },
  { code: "KE", name: "Kenya" },
  { code: "KW", name: "Kuwait" },
  { code: "LB", name: "Lebanon" },
  { code: "LY", name: "Libya" },
  { code: "MY", name: "Malaysia" },
  { code: "MX", name: "Mexico" },
  { code: "MA", name: "Morocco" },
  { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" },
  { code: "NG", name: "Nigeria" },
  { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PH", name: "Philippines" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "QA", name: "Qatar" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SG", name: "Singapore" },
  { code: "ZA", name: "South Africa" },
  { code: "KR", name: "South Korea" },
  { code: "ES", name: "Spain" },
  { code: "SD", name: "Sudan" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "TW", name: "Taiwan" },
  { code: "TH", name: "Thailand" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Türkiye" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "VN", name: "Vietnam" },
].sort((a, b) => a.name.localeCompare(b.name));

function SubmitButton({
  totalLabel,
  offline,
  labels,
  blocked,
}: {
  totalLabel: string;
  offline: boolean;
  labels: FormLabels;
  /** True until the traveler has picked a date (calendar mode). */
  blocked?: boolean;
}) {
  const { pending } = useFormStatus();
  const idle = offline
    ? `${labels.continueToBank} · ${totalLabel}`
    : `${labels.continueToPayment} · ${totalLabel}`;
  return (
    <button
      type="submit"
      disabled={pending || blocked}
      className="w-full rounded-full bg-nile px-6 py-3.5 text-btn text-white transition-colors hover:bg-nile/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nile disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? labels.working : blocked ? labels.dateRequired : idle}
    </button>
  );
}

/** Per-passenger-type counts held in the form. `adult` is always >= 1. */
interface Counts {
  adult: number;
  child: number;
  infant: number;
}

/** Trim counts so the total fits `max` seats: drop infants, then children, then
 *  adults (never below 1). Used when a smaller-capacity departure is selected. */
function fitCounts(prev: Counts, max: number): Counts {
  let { adult, child, infant } = prev;
  adult = Math.max(1, adult);
  let total = adult + child + infant;
  while (total > max) {
    if (infant > 0) infant--;
    else if (child > 0) child--;
    else if (adult > 1) adult--;
    else break;
    total--;
  }
  return { adult, child, infant };
}

/** One passenger-type row: label + per-person price and a −/+ stepper. */
function PaxStepper({
  label,
  count,
  unitCents,
  currency,
  labels,
  canDecrement,
  canIncrement,
  onDecrement,
  onIncrement,
}: {
  label: string;
  count: number;
  unitCents: number;
  currency: string;
  labels: FormLabels;
  canDecrement: boolean;
  canIncrement: boolean;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  const priceText =
    unitCents === 0 ? labels.free : `${formatPriceCents(unitCents, currency)} ${labels.perPerson}`;
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-grey-300/60 p-3.5">
      <div>
        <span className="block text-body font-medium text-ink">{label}</span>
        <span className="block text-[11px] text-ink/55">{priceText}</span>
      </div>
      <div className="inline-flex items-center rounded-full border border-grey-300/70">
        <button
          type="button"
          aria-label={labels.decrease.replace("{label}", label)}
          onClick={onDecrement}
          disabled={!canDecrement}
          className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-nile hover:bg-nile/5 disabled:opacity-40"
        >
          −
        </button>
        <span className="w-10 text-center text-body font-semibold text-ink" aria-live="polite">
          {count}
        </span>
        <button
          type="button"
          aria-label={labels.increase.replace("{label}", label)}
          onClick={onIncrement}
          disabled={!canIncrement}
          className="flex h-10 w-10 items-center justify-center rounded-full text-lg text-nile hover:bg-nile/5 disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}

/**
 * Booking form (Phase 3). Client island: departure select, traveler stepper,
 * contact + billing details, and payment-method choice. Submits to the CSRF-safe
 * server action, which claims seats atomically then redirects to the selected
 * gateway (Stripe/PayPal) or the bank-transfer instructions. Live total is
 * display-only; the server re-prices authoritatively.
 */
/** The customer-chosen-date mode's server-computed bounds (P8). All dates are
 *  "YYYY-MM-DD" strings so nothing here depends on the browser's clock. */
export interface BookingCalendarConfig {
  /** Tour slug — posted with the date, since a date alone names no tour. */
  tourSlug: string;
  /** Inclusive first and last selectable day. */
  firstDate: string;
  lastDate: string;
  /** Operator-closed days. */
  blackoutDates: string[];
  /** Days whose existing departure is sold out or closed. */
  unavailableDates: string[];
  /** Seats a new date opens with — the party-size cap in calendar mode. */
  capacity: number;
  /** Pre-selected day (e.g. from a `?date=` deep link), when still bookable. */
  initialDate?: string;
}

export default function BookingForm({
  departures,
  initialDepartureId,
  methods = ["stripe"],
  labels,
  childPriceCents,
  infantPriceCents,
  calendar,
  basePriceCents,
  priceTiers = [],
  currency: tourCurrency,
}: {
  departures: BookingDepartureOption[];
  initialDepartureId?: string;
  methods?: PaymentMethod[];
  labels: FormLabels;
  /** Tour-level per-seat price for children / infants (minor units). `null` ⇒
   *  the tour doesn't price that type, so its stepper is hidden. `0` ⇒ free. */
  childPriceCents: number | null;
  infantPriceCents: number | null;
  /** P8: present ⇒ the traveler picks their own date on a calendar instead of
   *  choosing from `departures`. Absent ⇒ the pre-P8 departure list. */
  calendar?: BookingCalendarConfig;
  /** Tour adult price, used in calendar mode where there is no departure row
   *  to read a price from yet. */
  basePriceCents: number;
  /** P8 group-size bands. The band matching the party size overrides the adult
   *  per-person price — the same rule `priceBooking` applies server-side. */
  priceTiers?: GroupPriceTier[];
  currency: string;
}) {
  const METHOD_META = methodMeta(labels);
  const firstBookable = departures.find((d) => d.remainingCapacity > 0);
  // Active public-site locale, forwarded to the server action so the post-
  // booking redirects (pending / bank-transfer / gateway return) stay localized.
  const { lang } = useParams<{ lang?: string }>();
  const [departureId, setDepartureId] = useState(
    initialDepartureId && departures.some((d) => d.id === initialDepartureId && d.remainingCapacity > 0)
      ? initialDepartureId
      : firstBookable?.id ?? departures[0]?.id ?? "",
  );
  // Calendar mode starts with NOTHING selected: picking the travel date is the
  // whole point, so we must not quietly pre-book the earliest day for them.
  const [travelDate, setTravelDate] = useState<string | null>(calendar?.initialDate ?? null);
  const [counts, setCounts] = useState<Counts>({ adult: 1, child: 0, infant: 0 });
  const availableMethods = methods.length > 0 ? methods : (["stripe"] as PaymentMethod[]);
  const [method, setMethod] = useState<PaymentMethod>(availableMethods[0] ?? "stripe");
  const [state, formAction] = useActionState<BookingFormState, FormData>(submitBookingAction, {
    error: null,
  });

  // P5 discount code. `applied` holds the previewed success (its discountCents /
  // netCents are what we display); the server re-checks the code atomically at
  // reserve time, so a stale preview can never over-discount the real charge.
  const [couponInput, setCouponInput] = useState("");
  const [applied, setApplied] = useState<AppliedCoupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [applying, startApplying] = useTransition();

  const selected = useMemo(
    () => departures.find((d) => d.id === departureId),
    [departures, departureId],
  );
  const currency = calendar ? tourCurrency : selected?.currency ?? tourCurrency;
  // Total travelers drive capacity; infants count as seats too (matches server).
  const totalTravelers = counts.adult + counts.child + counts.infant;
  // In calendar mode the price comes off the tour (a date nobody has booked yet
  // has no departure override), and the group-size band for the current party
  // overrides it — exactly what `priceBooking` does on the server, through the
  // very same `adultUnitCents`, so the quote below cannot drift from the charge.
  const adultCents = calendar
    ? adultUnitCents(
        { adultCents: basePriceCents, childCents: childPriceCents, infantCents: infantPriceCents, currency, tiers: priceTiers },
        totalTravelers,
      )
    : selected
      ? adultUnitCents(
          { adultCents: selected.priceCents, childCents: childPriceCents, infantCents: infantPriceCents, currency, tiers: priceTiers },
          totalTravelers,
        )
      : 0;
  const maxSeats = calendar
    ? Math.max(1, Math.min(calendar.capacity, MAX_SEATS))
    : Math.max(1, Math.min(selected?.remainingCapacity ?? 1, MAX_SEATS));
  const canAdd = totalTravelers < maxSeats;
  // Calendar mode cannot submit until a day is picked; the server refuses a
  // dateless post anyway, but blocking here keeps that from being a round trip.
  const dateMissing = calendar != null && travelDate == null;

  // Adjust one passenger type, respecting the per-type floor (adult >= 1, others
  // >= 0) and the shared capacity ceiling. Display only — server re-validates.
  const step = (type: keyof Counts, delta: number) =>
    setCounts((prev) => {
      const floor = type === "adult" ? 1 : 0;
      const next = prev[type] + delta;
      if (next < floor) return prev;
      if (delta > 0 && prev.adult + prev.child + prev.infant >= maxSeats) return prev;
      return { ...prev, [type]: next };
    });

  const totalCents =
    counts.adult * adultCents +
    counts.child * (childPriceCents ?? 0) +
    counts.infant * (infantPriceCents ?? 0);
  const priceable = calendar ? travelDate != null : selected != null;
  const totalLabel = priceable ? formatPriceCents(totalCents, currency) : "—";

  // A previewed discount is tied to a specific date + traveler mix. If either
  // changes the applied number would be stale, so drop it and let the customer
  // re-apply against the new total. In calendar mode the group-size band can
  // move the per-person rate too, which is exactly such a change.
  useEffect(() => {
    setApplied(null);
    setCouponError(null);
  }, [departureId, travelDate, counts.adult, counts.child, counts.infant]);

  const applyCoupon = () => {
    const code = couponInput.trim();
    if (!code) return;
    // Nothing to price a code against until a date exists.
    if (calendar && !travelDate) {
      setCouponError(labels.dateRequired);
      return;
    }
    startApplying(async () => {
      const res = await previewCouponAction({
        code,
        // Mirrors the submit payload: a chosen date, or a scheduled departure.
        ...(calendar && travelDate
          ? { tourSlug: calendar.tourSlug, departureDate: travelDate }
          : { departureId }),
        adults: counts.adult,
        children: counts.child,
        infants: counts.infant,
      });
      if (res.ok) {
        setApplied(res);
        setCouponInput(res.code);
        setCouponError(null);
      } else {
        setApplied(null);
        setCouponError(res.message);
      }
    });
  };

  const removeCoupon = () => {
    setApplied(null);
    setCouponError(null);
    setCouponInput("");
  };

  // Net total (and the submit button's amount) reflect an applied discount.
  const netLabel = applied ? formatPriceCents(applied.netCents, currency) : totalLabel;

  // Non-empty lines for the price summary (only types actually selected).
  const summaryLines = [
    { type: "adult" as const, label: labels.adultsLabel, count: counts.adult, unitCents: adultCents },
    { type: "child" as const, label: labels.childrenLabel, count: counts.child, unitCents: childPriceCents ?? 0 },
    { type: "infant" as const, label: labels.infantsLabel, count: counts.infant, unitCents: infantPriceCents ?? 0 },
  ].filter((l) => l.count > 0);

  return (
    <form action={formAction} className="space-y-6">
      {/* Active locale for the server action's post-booking redirects. */}
      <input type="hidden" name="lang" value={lang ?? ""} />
      {state.error && (
        <div
          role="alert"
          className="rounded-xl border border-rust/40 bg-rust/5 p-4 text-meta font-medium text-rust"
        >
          {state.error}
        </div>
      )}

      {calendar ? (
        /* P8 calendar mode — the traveler picks their own day. The date goes to
           the server as a plain string alongside the tour slug; the server
           re-checks it and materializes the departure inside the reservation. */
        <fieldset className="space-y-3">
          <legend className="text-card-title font-semibold text-ink">{labels.dateLegend}</legend>
          <p className="text-meta text-ink/60">{labels.dateHelp}</p>
          <DepartureCalendar
            value={travelDate}
            onChange={setTravelDate}
            firstDate={calendar.firstDate}
            lastDate={calendar.lastDate}
            blackoutDates={calendar.blackoutDates}
            unavailableDates={calendar.unavailableDates}
            locale={lang ?? "en"}
            labels={labels}
          />
          <input type="hidden" name="tourSlug" value={calendar.tourSlug} />
          <input type="hidden" name="departureDate" value={travelDate ?? ""} />
        </fieldset>
      ) : (
      <fieldset className="space-y-3">
        <legend className="text-card-title font-semibold text-ink">{labels.departureLegend}</legend>
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
                      const newMax = Math.max(1, Math.min(d.remainingCapacity, MAX_SEATS));
                      setCounts((prev) => fitCounts(prev, newMax));
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
                    {soldOut ? labels.soldOut : labels.remaining.replace("{count}", String(d.remainingCapacity))}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
      )}

      <fieldset>
        <legend className="text-card-title font-semibold text-ink">{labels.travelersLegend}</legend>
        <div className="mt-2 space-y-2">
          <PaxStepper
            label={labels.adultsLabel}
            count={counts.adult}
            unitCents={adultCents}
            currency={currency}
            labels={labels}
            canDecrement={counts.adult > 1}
            canIncrement={canAdd}
            onDecrement={() => step("adult", -1)}
            onIncrement={() => step("adult", 1)}
          />
          {childPriceCents !== null && (
            <PaxStepper
              label={labels.childrenLabel}
              count={counts.child}
              unitCents={childPriceCents}
              currency={currency}
              labels={labels}
              canDecrement={counts.child > 0}
              canIncrement={canAdd}
              onDecrement={() => step("child", -1)}
              onIncrement={() => step("child", 1)}
            />
          )}
          {infantPriceCents !== null && (
            <PaxStepper
              label={labels.infantsLabel}
              count={counts.infant}
              unitCents={infantPriceCents}
              currency={currency}
              labels={labels}
              canDecrement={counts.infant > 0}
              canIncrement={canAdd}
              onDecrement={() => step("infant", -1)}
              onIncrement={() => step("infant", 1)}
            />
          )}
        </div>
        <p className="mt-2 text-meta text-ink/55">
          {calendar
            ? labels.upToParty.replace("{max}", String(maxSeats))
            : selected
              ? labels.upTo.replace("{max}", String(maxSeats))
              : labels.selectDeparture}
        </p>
        {/* The band matching the current party is highlighted, so adding a
            traveler visibly moves the rate rather than just the total. */}
        <GroupPriceTable
          tiers={priceTiers}
          currency={currency}
          labels={labels.groupPricing}
          activePax={totalTravelers}
          className="mt-4 rounded-xl border border-grey-300/60 bg-papyrus/40 p-4"
        />
        {/* Authoritative per-type counts for the server action (it derives seats
            = adults + children + infants and re-prices from the DB). */}
        <input type="hidden" name="adults" value={counts.adult} />
        <input type="hidden" name="children" value={counts.child} />
        <input type="hidden" name="infants" value={counts.infant} />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-card-title font-semibold text-ink">{labels.detailsLegend}</legend>
        <label className="block">
          <span className="mb-1 block text-meta font-medium text-ink/70">{labels.fullName}</span>
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
            <span className="mb-1 block text-meta font-medium text-ink/70">{labels.email}</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-grey-300/70 bg-white px-4 py-2.5 text-body text-ink outline-none focus-visible:border-nile"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-meta font-medium text-ink/70">{labels.phone}</span>
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
            {labels.pickupLabel} <span className="text-ink/40">{labels.optional}</span>
          </span>
          <input
            type="text"
            name="pickup"
            maxLength={200}
            autoComplete="off"
            placeholder={labels.pickupPlaceholder}
            className="w-full rounded-xl border border-grey-300/70 bg-white px-4 py-2.5 text-body text-ink outline-none focus-visible:border-nile"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-meta font-medium text-ink/70">
            {labels.notes} <span className="text-ink/40">{labels.optional}</span>
          </span>
          <textarea
            name="notes"
            rows={3}
            maxLength={2000}
            placeholder={labels.notesPlaceholder}
            className="w-full resize-y rounded-xl border border-grey-300/70 bg-white px-4 py-2.5 text-body text-ink outline-none focus-visible:border-nile"
          />
        </label>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-card-title font-semibold text-ink">{labels.billingLegend}</legend>
        <label className="block">
          <span className="mb-1 block text-meta font-medium text-ink/70">{labels.addressLine1}</span>
          <input
            type="text"
            name="billingLine1"
            required
            autoComplete="address-line1"
            className="w-full rounded-xl border border-grey-300/70 bg-white px-4 py-2.5 text-body text-ink outline-none focus-visible:border-nile"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-meta font-medium text-ink/70">
            {labels.addressLine2} <span className="text-ink/40">{labels.optional}</span>
          </span>
          <input
            type="text"
            name="billingLine2"
            autoComplete="address-line2"
            className="w-full rounded-xl border border-grey-300/70 bg-white px-4 py-2.5 text-body text-ink outline-none focus-visible:border-nile"
          />
        </label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-meta font-medium text-ink/70">{labels.city}</span>
            <input
              type="text"
              name="billingCity"
              required
              autoComplete="address-level2"
              className="w-full rounded-xl border border-grey-300/70 bg-white px-4 py-2.5 text-body text-ink outline-none focus-visible:border-nile"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-meta font-medium text-ink/70">{labels.region}</span>
            <input
              type="text"
              name="billingRegion"
              required
              autoComplete="address-level1"
              className="w-full rounded-xl border border-grey-300/70 bg-white px-4 py-2.5 text-body text-ink outline-none focus-visible:border-nile"
            />
          </label>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-meta font-medium text-ink/70">{labels.postalCode}</span>
            <input
              type="text"
              name="billingPostalCode"
              required
              autoComplete="postal-code"
              className="w-full rounded-xl border border-grey-300/70 bg-white px-4 py-2.5 text-body text-ink outline-none focus-visible:border-nile"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-meta font-medium text-ink/70">{labels.country}</span>
            <select
              name="billingCountry"
              required
              defaultValue=""
              autoComplete="country"
              className="w-full rounded-xl border border-grey-300/70 bg-white px-4 py-2.5 text-body text-ink outline-none focus-visible:border-nile"
            >
              <option value="" disabled>
                {labels.selectCountry}
              </option>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="text-card-title font-semibold text-ink">{labels.paymentLegend}</legend>
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

      <fieldset className="space-y-2">
        <legend className="text-card-title font-semibold text-ink">
          {labels.couponLegend} <span className="text-ink/40">{labels.optional}</span>
        </legend>
        <div className="flex gap-2">
          <input
            type="text"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            placeholder={labels.couponPlaceholder}
            maxLength={40}
            disabled={applied !== null}
            autoComplete="off"
            style={{ textTransform: "uppercase" }}
            className="w-full rounded-xl border border-grey-300/70 bg-white px-4 py-2.5 text-body text-ink outline-none focus-visible:border-nile disabled:bg-grey-300/20 disabled:text-ink/60"
          />
          {applied ? (
            <button
              type="button"
              onClick={removeCoupon}
              className="shrink-0 rounded-xl border border-grey-300/70 px-4 py-2.5 text-btn text-ink transition-colors hover:bg-grey-300/20"
            >
              {labels.couponRemove}
            </button>
          ) : (
            <button
              type="button"
              onClick={applyCoupon}
              disabled={applying || couponInput.trim() === ""}
              className="shrink-0 rounded-xl border border-nile bg-nile/5 px-4 py-2.5 text-btn text-nile transition-colors hover:bg-nile/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {applying ? labels.couponApplying : labels.couponApply}
            </button>
          )}
        </div>
        {couponError && (
          <p role="alert" className="text-meta font-medium text-rust">
            {couponError}
          </p>
        )}
        {applied && (
          <p role="status" aria-live="polite" className="text-meta font-medium text-nile">
            {labels.couponApplied}
          </p>
        )}
        {/* Applied code — re-validated atomically by the server on submit. */}
        <input type="hidden" name="coupon" value={applied?.code ?? ""} />
      </fieldset>

      <div className="rounded-xl bg-papyrus/60 p-4">
        <div className="space-y-1">
          {summaryLines.map((line) => (
            <div key={line.type} className="flex items-center justify-between text-meta text-ink/70">
              <span>
                {line.label} · {line.count}
              </span>
              <span>
                {line.unitCents === 0 ? labels.free : formatPriceCents(line.unitCents * line.count, currency)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-grey-300/50 pt-2 text-body">
          <span className="text-ink/70">
            {labels.travelersLegend} · {totalTravelers}
          </span>
          <span className={applied ? "text-ink/70" : "text-lg font-bold text-nile"}>{totalLabel}</span>
        </div>
        {applied && (
          <>
            <div className="mt-1 flex items-center justify-between text-meta font-medium text-nile">
              <span>{labels.couponSummaryLabel.replace("{code}", applied.code)}</span>
              <span>−{formatPriceCents(applied.discountCents, currency)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-body">
              <span className="text-ink/70">{labels.totalAfterDiscount}</span>
              <span className="text-lg font-bold text-nile">{netLabel}</span>
            </div>
          </>
        )}
        <p className="mt-2 text-[11px] text-ink/50">
          {method === "bank_transfer" ? labels.summaryBankNote : labels.summaryOnlineNote}
        </p>
      </div>

      <SubmitButton
        totalLabel={netLabel}
        offline={method === "bank_transfer"}
        labels={labels}
        blocked={dateMissing}
      />
      <p className="text-center text-[11px] text-ink/45">
        {method === "bank_transfer" ? labels.footerBank : labels.footerOnline}
      </p>
    </form>
  );
}
