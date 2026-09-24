"use client";

/**
 * Track-booking form (item #7). Client island: submits the reference + email to
 * the rate-limited `trackBookingAction` via useActionState and renders the live
 * order status returned. Presentational only — all lookup/masking happens on the
 * server; this never sees another traveler's data.
 */
import { useActionState, useState } from "react";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { trackBookingAction, type TrackState } from "@/app/[lang]/(site)/track-booking/actions";
import type { PageContent } from "@/i18n/pages/en";

const INITIAL: TrackState = { status: "idle" };

const TONE: Record<"ok" | "gold" | "off", string> = {
  ok: "bg-nile/10 text-nile ring-1 ring-inset ring-nile/20",
  gold: "bg-gold/10 text-rust ring-1 ring-inset ring-gold/30",
  off: "bg-grey-300/25 text-ink/70 ring-1 ring-inset ring-grey-300/70",
};

const inputCls =
  "mt-1.5 w-full rounded-xl border border-grey-300/70 bg-white px-4 py-2.5 text-meta text-ink outline-none transition-colors focus:border-nile";
const labelCls = "text-[11px] font-semibold uppercase tracking-wide text-ink/60";

export default function TrackBookingForm({
  defaultReference = "",
  labels,
}: {
  defaultReference?: string;
  labels: PageContent["trackBooking"];
}) {
  const [state, formAction, isPending] = useActionState(trackBookingAction, INITIAL);
  // Mirror the email into local state so the "Download voucher" form below can
  // re-send it (with the reference) to the POST voucher route — that route
  // requires ref + matching email, exactly like this lookup, so the download
  // never exposes a booking by id alone.
  const [email, setEmail] = useState("");

  return (
    <div className="mx-auto max-w-xl">
      <form
        action={formAction}
        className="rounded-2xl border border-grey-300/60 bg-white p-6 text-left"
      >
        <label className="block">
          <span className={labelCls}>{labels.referenceLabel}</span>
          <input
            name="reference"
            defaultValue={defaultReference}
            required
            maxLength={64}
            placeholder={labels.referencePlaceholder}
            className={inputCls}
            autoComplete="off"
            spellCheck={false}
          />
        </label>
        <label className="mt-4 block">
          <span className={labelCls}>{labels.emailLabel}</span>
          <input
            name="email"
            type="email"
            required
            maxLength={255}
            placeholder={labels.emailPlaceholder}
            className={inputCls}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="mt-6 w-full rounded-full bg-nile px-6 py-3 text-btn text-white transition-colors hover:bg-nile/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? labels.searching : labels.submit}
        </button>
      </form>
      {/* __RESULT__ */}
      {state.status === "error" ? (
        <p
          role="alert"
          className="mt-4 rounded-xl bg-rust/5 px-4 py-3 text-meta text-rust ring-1 ring-inset ring-rust/15"
        >
          {state.message}
        </p>
      ) : null}

      {state.status === "found" ? (
        <div className="mt-6 rounded-2xl border border-grey-300/60 bg-white p-6 text-left">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink/50">{labels.referenceLabel}</p>
              <p className="font-mono text-meta text-ink">{state.booking.reference}</p>
            </div>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold ${TONE[state.booking.tone]}`}
            >
              {state.booking.statusLabel}
            </span>
          </div>

          {state.booking.statusHint ? (
            <p className="mt-3 text-meta text-ink/70">{state.booking.statusHint}</p>
          ) : null}

          <dl className="mt-4 space-y-2.5 border-t border-grey-300/50 pt-4 text-meta">
            <div className="flex justify-between gap-4">
              <dt className="text-ink/55">{labels.tourLabel}</dt>
              <dd className="text-right font-semibold text-ink">{state.booking.tourTitle}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink/55">{labels.departureLabel}</dt>
              <dd className="text-right text-ink">{state.booking.departure}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink/55">{labels.travelersLabel}</dt>
              <dd className="text-ink">{state.booking.seats}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink/55">{labels.totalLabel}</dt>
              <dd className="font-bold text-nile">{state.booking.total}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink/55">{labels.bookedOnLabel}</dt>
              <dd className="text-right text-ink">{state.booking.bookedOn}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <form method="post" action={`/booking/voucher/${encodeURIComponent(state.booking.reference)}`}>
              <input type="hidden" name="email" value={email} />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-nile px-5 py-2.5 text-btn text-white transition-colors hover:bg-nile/90"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {labels.downloadVoucher}
              </button>
            </form>
            <Link
              href={`/tours/${state.booking.tourSlug}`}
              className="rounded-full border border-nile/25 px-5 py-2.5 text-btn text-nile transition-colors hover:border-nile"
            >
              {labels.viewTour}
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-nile/25 px-5 py-2.5 text-btn text-nile transition-colors hover:border-nile"
            >
              {labels.needHelp}
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
