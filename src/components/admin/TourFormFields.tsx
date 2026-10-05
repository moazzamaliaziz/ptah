"use client";

import { useEffect, useRef, useState, type JSX } from "react";
import MediaPicker from "@/components/admin/MediaPicker";
import FaqEditor from "@/components/admin/FaqEditor";
import { useBeforeUnloadWarning } from "@/hooks/use-beforeunload-warning";
import { DIFFICULTIES, centsToDollars, type TourInput } from "@/content/catalog-admin-schema";
import { SITE_CURRENCY } from "@/content/currency";
import { TOUR_TAGS, TOUR_TAG_LABELS, type TourTag } from "@/content/tour-tags";
import type { TourFormFieldsDict, FaqEditorDict } from "@/i18n/admin/dictionary";

/**
 * One group-size band as the form holds it: numbers kept as strings so a
 * half-typed field ("" or "1") does not snap to 0 under the editor's fingers.
 * The server action parses these; `maxPax` empty means the open-ended top band.
 */
export interface TierRow {
  minPax: string;
  maxPax: string;
  price: string; // major units, e.g. "85.00"
}

/** Editable core-field values, pre-formatted for the DOM inputs. */
export interface TourFieldValues {
  slug: string;
  title: string;
  summary: string;
  descriptionLong: string;
  durationDays: number;
  basePrice: string; // major units, e.g. "1299.00"
  childPrice: string; // major units; "" ⇒ children not offered
  infantPrice: string; // major units; "" ⇒ infants not offered ("0.00" ⇒ free)
  /** Display only — every price is written in SITE_CURRENCY, so this is not an
   *  editable field. Shows what the row actually carries. */
  currency: string;
  /** P8 group-size bands, as the DOM holds them (major-unit price strings). */
  priceTiers: TierRow[];
  /** P8 customer-chosen dates. */
  onRequestDates: boolean;
  requestLeadDays: number;
  requestWindowDays: number;
  requestCapacity: number;
  blackoutDates: string[];
  bookingClosed: boolean;
  difficulty: TourInput["difficulty"];
  tags: TourTag[];
  heroImage: string | null;
  ogImage: string | null;
  gallery: string[];
  inclusions: string[];
  exclusions: string[];
  faqs: { q: string; a: string }[];
  travelNotes: string[];
  ctaLabel: string | null;
  ctaHref: string | null;
  metaTitle: string | null;
  metaDesc: string | null;
}

export interface TourFormFieldsProps {
  /** Initial values. Omit for a blank create form. */
  initial?: Partial<TourFieldValues>;
  /** Flips true after a successful save so the dirty guard resets. */
  saved?: boolean;
  /** True while the parent form action is pending (disables the FAQ hint churn). */
  pending?: boolean;
  /** Localized field labels. */
  labels: TourFormFieldsDict;
  /** Localized labels forwarded to the nested FAQ editor. */
  faqLabels: FaqEditorDict;
}

const EMPTY: TourFieldValues = {
  slug: "",
  title: "",
  summary: "",
  descriptionLong: "",
  durationDays: 1,
  basePrice: "",
  childPrice: "",
  infantPrice: "",
  currency: SITE_CURRENCY,
  priceTiers: [],
  onRequestDates: true,
  requestLeadDays: 2,
  requestWindowDays: 365,
  requestCapacity: 20,
  blackoutDates: [],
  bookingClosed: false,
  difficulty: "EASY",
  tags: [],
  heroImage: null,
  ogImage: null,
  gallery: [],
  inclusions: [],
  exclusions: [],
  faqs: [],
  travelNotes: [],
  ctaLabel: null,
  ctaHref: null,
  metaTitle: null,
  metaDesc: null,
};

/** Build a full value set from partial initial data (create passes nothing). */
export function toFieldValues(
  input: (TourInput & { basePriceCents: number; currency: string }) | undefined,
): TourFieldValues {
  if (!input) return EMPTY;
  return {
    slug: input.slug,
    title: input.title,
    summary: input.summary,
    descriptionLong: input.descriptionLong,
    durationDays: input.durationDays,
    basePrice: centsToDollars(input.basePriceCents),
    childPrice: input.childPriceCents == null ? "" : centsToDollars(input.childPriceCents),
    infantPrice: input.infantPriceCents == null ? "" : centsToDollars(input.infantPriceCents),
    currency: input.currency,
    priceTiers: input.priceTiers.map((tier) => ({
      minPax: String(tier.minPax),
      maxPax: tier.maxPax == null ? "" : String(tier.maxPax),
      price: centsToDollars(tier.pricePerPersonCents),
    })),
    onRequestDates: input.onRequestDates,
    requestLeadDays: input.requestLeadDays,
    requestWindowDays: input.requestWindowDays,
    requestCapacity: input.requestCapacity,
    blackoutDates: input.blackoutDates,
    bookingClosed: input.bookingClosed,
    difficulty: input.difficulty,
    tags: input.tags,
    heroImage: input.heroImage,
    ogImage: input.ogImage,
    gallery: input.gallery,
    inclusions: input.inclusions,
    exclusions: input.exclusions,
    faqs: input.faqs,
    travelNotes: input.travelNotes,
    ctaLabel: input.ctaLabel,
    ctaHref: input.ctaHref,
    metaTitle: input.metaTitle,
    metaDesc: input.metaDesc,
  };
}

/**
 * Group-size price bands editor (P8).
 *
 * The rows post as three parallel `tierMinPax` / `tierMaxPax` / `tierPrice`
 * arrays — the plain multi-value FormData shape, which the server action zips
 * back together by index. That keeps the whole thing inside the parent's single
 * `<form>` with no JSON hidden field to keep in sync, and an editor with
 * JavaScript off still submits whatever rows the server rendered.
 */
function PriceTierEditor({
  initial,
  labels,
}: {
  initial: TierRow[];
  labels: TourFormFieldsDict;
}): JSX.Element {
  const [rows, setRows] = useState<TierRow[]>(initial);

  const update = (index: number, patch: Partial<TierRow>) =>
    setRows((prev) => prev.map((row, i) => (i === index ? { ...row, ...patch } : row)));

  const addRow = () =>
    setRows((prev) => {
      // Start the new band one above the highest size seen, so the common case
      // (stacking bands upward) needs no retyping.
      const highest = prev.reduce((max, row) => {
        const top = row.maxPax.trim() === "" ? Number(row.minPax) : Number(row.maxPax);
        return Number.isFinite(top) ? Math.max(max, top) : max;
      }, 0);
      return [...prev, { minPax: String(highest + 1), maxPax: "", price: "" }];
    });

  return (
    <fieldset
      style={{ border: "1px solid rgba(26,35,64,0.15)", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1rem" }}
    >
      <legend className="admin-card__meta">{labels.tiersLegend}</legend>
      <p className="admin-card__meta" style={{ margin: "0.25rem 0 0.75rem" }}>
        {labels.tiersNote}
      </p>

      {rows.length === 0 ? (
        <p className="admin-card__meta" style={{ margin: "0 0 0.75rem" }}>{labels.tiersEmpty}</p>
      ) : (
        rows.map((row, index) => (
          <div key={index} className="admin-row" style={{ gap: "0.75rem", alignItems: "flex-end", marginBottom: "0.5rem" }}>
            <label className="admin-field" style={{ flex: "1 1 110px" }}>
              <span>{labels.tiersMinPax}</span>
              <input
                className="admin-input"
                type="number"
                name="tierMinPax"
                value={row.minPax}
                min={1}
                max={1000}
                onChange={(e) => update(index, { minPax: e.target.value })}
                required
              />
            </label>
            <label className="admin-field" style={{ flex: "1 1 110px" }}>
              <span>{labels.tiersMaxPax}</span>
              <input
                className="admin-input"
                type="number"
                name="tierMaxPax"
                value={row.maxPax}
                min={1}
                max={1000}
                placeholder={labels.tiersMaxPaxPlaceholder}
                onChange={(e) => update(index, { maxPax: e.target.value })}
              />
            </label>
            <label className="admin-field" style={{ flex: "1 1 140px" }}>
              <span>{labels.tiersPrice}</span>
              <input
                className="admin-input"
                type="text"
                name="tierPrice"
                value={row.price}
                inputMode="decimal"
                placeholder="85.00"
                onChange={(e) => update(index, { price: e.target.value })}
                required
              />
            </label>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              onClick={() => setRows((prev) => prev.filter((_, i) => i !== index))}
            >
              {labels.tiersRemove}
            </button>
          </div>
        ))
      )}

      <button type="button" className="admin-btn admin-btn--ghost" onClick={addRow}>
        {labels.tiersAdd}
      </button>
    </fieldset>
  );
}

/**
 * The complete set of editable tour fields, shared by the create form and the
 * editor so BOTH capture every field (FAQs, media, inclusions, SEO, CTA). The
 * parent owns the <form>, action state, alerts and submit button; this renders
 * the inputs and tracks a dirty flag that warns before accidental navigation.
 */
export default function TourFormFields({ initial, saved, pending, labels, faqLabels }: TourFormFieldsProps): JSX.Element {
  const v = { ...EMPTY, ...initial };
  const [dirty, setDirty] = useState(false);
  const savedRef = useRef(saved);

  // A successful save clears the unsaved-changes guard.
  useEffect(() => {
    if (saved && !savedRef.current) setDirty(false);
    savedRef.current = saved;
  }, [saved]);

  useBeforeUnloadWarning(dirty && !pending);

  return (
    <div
      onInput={() => setDirty(true)}
      onChange={() => setDirty(true)}
    >
      {dirty ? (
        <div className="admin-alert admin-alert--warn" role="status" style={{ marginBottom: "0.75rem" }}>
          {labels.unsavedChanges}
        </div>
      ) : null}

      <div className="admin-row" style={{ gap: "1rem" }}>
        <label className="admin-field" style={{ flex: "2 1 260px" }}>
          <span>{labels.title}</span>
          <input className="admin-input" type="text" name="title" defaultValue={v.title} maxLength={255} required />
        </label>
        <label className="admin-field" style={{ flex: "1 1 200px" }}>
          <span>{labels.slug}</span>
          <input className="admin-input" type="text" name="slug" defaultValue={v.slug} maxLength={191} placeholder="nile-cruise" required />
        </label>
      </div>

      <label className="admin-field">
        <span>{labels.summary}</span>
        <input className="admin-input" type="text" name="summary" defaultValue={v.summary} maxLength={512} required />
      </label>

      <label className="admin-field">
        <span>{labels.description}</span>
        <textarea className="admin-textarea" name="descriptionLong" defaultValue={v.descriptionLong} required style={{ minHeight: "9rem" }} />
      </label>

      <div className="admin-row" style={{ gap: "1rem" }}>
        <label className="admin-field" style={{ flex: "1 1 120px" }}>
          <span>{labels.durationDays}</span>
          <input className="admin-input" type="number" name="durationDays" defaultValue={v.durationDays} min={1} max={365} required />
        </label>
        <label className="admin-field" style={{ flex: "1 1 140px" }}>
          <span>{labels.basePrice}</span>
          <input className="admin-input" type="text" name="basePrice" defaultValue={v.basePrice} inputMode="decimal" placeholder="1299.00" required />
        </label>
        {/* Currency is not editable: every price on the site is SITE_CURRENCY,
            stamped by the write path. Shown so the number has a unit. */}
        <div className="admin-field" style={{ flex: "0 1 140px" }}>
          <span>{labels.currencyNote.replace("{currency}", SITE_CURRENCY)}</span>
          <p className="admin-input" style={{ background: "rgba(26,35,64,0.04)" }}>
            {v.currency}
          </p>
        </div>
      </div>

      {/* A tour stored in some other currency predates the USD-only rule. Saving
          stamps SITE_CURRENCY while keeping whatever number is in the box, which
          would silently reprice it (1450 EGP becoming $1450), so say so loudly
          rather than letting a save quietly multiply the price ~48x. */}
      {v.currency !== SITE_CURRENCY ? (
        <div className="admin-alert admin-alert--warn" role="alert" style={{ marginBottom: "0.75rem" }}>
          {labels.currencyMismatch
            .replace("{stored}", v.currency)
            .replace("{currency}", SITE_CURRENCY)}
        </div>
      ) : null}

      <div className="admin-row" style={{ gap: "1rem" }}>
        <label className="admin-field" style={{ flex: "1 1 160px" }}>
          <span>{labels.difficulty}</span>
          <select className="admin-input" name="difficulty" defaultValue={v.difficulty}>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>{labels.difficultyLabels[d] ?? d}</option>
            ))}
          </select>
        </label>
      </div>

      <fieldset style={{ border: "1px solid rgba(26,35,64,0.15)", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1rem" }}>
        <legend className="admin-card__meta">{labels.pricingLegend}</legend>
        <div className="admin-row" style={{ gap: "1rem" }}>
          <label className="admin-field" style={{ flex: "1 1 140px" }}>
            <span>{labels.childPrice}</span>
            <input className="admin-input" type="text" name="childPrice" defaultValue={v.childPrice} inputMode="decimal" placeholder={labels.childPlaceholder} />
          </label>
          <label className="admin-field" style={{ flex: "1 1 140px" }}>
            <span>{labels.infantPrice}</span>
            <input className="admin-input" type="text" name="infantPrice" defaultValue={v.infantPrice} inputMode="decimal" placeholder={labels.infantPlaceholder} />
          </label>
        </div>
        <p className="admin-card__meta" style={{ margin: "0.25rem 0 0.75rem" }}>
          {labels.pricingNote}
        </p>
        <label className="admin-row" style={{ gap: "0.5rem", alignItems: "center" }}>
          <input type="checkbox" name="bookingClosed" defaultChecked={v.bookingClosed} />
          <span>{labels.bookingClosedLabel}</span>
        </label>
      </fieldset>

      <PriceTierEditor initial={v.priceTiers} labels={labels} />

      <fieldset style={{ border: "1px solid rgba(26,35,64,0.15)", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1rem" }}>
        <legend className="admin-card__meta">{labels.datesLegend}</legend>
        <p className="admin-card__meta" style={{ margin: "0.25rem 0 0.75rem" }}>
          {labels.datesNote}
        </p>
        <label className="admin-row" style={{ gap: "0.5rem", alignItems: "center", marginBottom: "0.75rem" }}>
          <input type="checkbox" name="onRequestDates" defaultChecked={v.onRequestDates} />
          <span>{labels.onRequestDatesLabel}</span>
        </label>
        <div className="admin-row" style={{ gap: "1rem" }}>
          <label className="admin-field" style={{ flex: "1 1 140px" }}>
            <span>{labels.requestLeadDays}</span>
            <input className="admin-input" type="number" name="requestLeadDays" defaultValue={v.requestLeadDays} min={0} max={365} required />
          </label>
          <label className="admin-field" style={{ flex: "1 1 160px" }}>
            <span>{labels.requestWindowDays}</span>
            <input className="admin-input" type="number" name="requestWindowDays" defaultValue={v.requestWindowDays} min={1} max={1095} required />
          </label>
          <label className="admin-field" style={{ flex: "1 1 150px" }}>
            <span>{labels.requestCapacity}</span>
            <input className="admin-input" type="number" name="requestCapacity" defaultValue={v.requestCapacity} min={1} max={10000} required />
          </label>
        </div>
        <label className="admin-field">
          <span>{labels.blackoutDatesLabel}</span>
          <textarea
            className="admin-textarea"
            name="blackoutDates"
            defaultValue={v.blackoutDates.join("\n")}
            placeholder={labels.blackoutDatesPlaceholder}
            style={{ minHeight: "4.5rem" }}
          />
        </label>
      </fieldset>

      <fieldset style={{ border: "1px solid rgba(26,35,64,0.15)", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1rem" }}>
        <legend className="admin-card__meta">{labels.tagsLegend}</legend>
        <div className="admin-row" style={{ gap: "0.5rem 1.25rem", flexWrap: "wrap" }}>
          {TOUR_TAGS.map((tag) => (
            <label key={tag} className="admin-row" style={{ gap: "0.4rem", alignItems: "center", flex: "0 1 auto" }}>
              <input type="checkbox" name="tags" value={tag} defaultChecked={v.tags.includes(tag)} />
              <span>{labels.tagLabels[tag] ?? TOUR_TAG_LABELS[tag]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="admin-row" style={{ gap: "1rem" }}>
        <MediaPicker name="heroImage" emit="url" initialUrl={v.heroImage} folder="tours" label={labels.heroImage} />
        <MediaPicker name="ogImage" emit="url" initialUrl={v.ogImage} folder="tours" label={labels.ogImage} />
      </div>

      <label className="admin-field">
        <span>{labels.galleryLabel}</span>
        <textarea className="admin-textarea" name="gallery" defaultValue={v.gallery.join("\n")} placeholder={labels.galleryPlaceholder} style={{ minHeight: "5rem" }} />
      </label>

      <div className="admin-row" style={{ gap: "1rem" }}>
        <label className="admin-field" style={{ flex: 1 }}>
          <span>{labels.inclusionsLabel}</span>
          <textarea className="admin-textarea" name="inclusions" defaultValue={v.inclusions.join("\n")} style={{ minHeight: "7rem" }} />
        </label>
        <label className="admin-field" style={{ flex: 1 }}>
          <span>{labels.exclusionsLabel}</span>
          <textarea className="admin-textarea" name="exclusions" defaultValue={v.exclusions.join("\n")} style={{ minHeight: "7rem" }} />
        </label>
      </div>

      <label className="admin-field">
        <span>{labels.travelNotesLabel}</span>
        <textarea className="admin-textarea" name="travelNotes" defaultValue={v.travelNotes.join("\n")} style={{ minHeight: "5rem" }} />
      </label>

      <FaqEditor name="faqs" initial={v.faqs} labels={faqLabels} />

      <fieldset style={{ border: "1px solid rgba(26,35,64,0.15)", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1rem" }}>
        <legend className="admin-card__meta">{labels.ctaLegend}</legend>
        <div className="admin-row" style={{ gap: "1rem" }}>
          <label className="admin-field" style={{ flex: "1 1 200px" }}>
            <span>{labels.ctaLabelField}</span>
            <input className="admin-input" type="text" name="ctaLabel" defaultValue={v.ctaLabel ?? ""} maxLength={120} placeholder={labels.ctaLabelPlaceholder} />
          </label>
          <label className="admin-field" style={{ flex: "2 1 260px" }}>
            <span>{labels.ctaHrefField}</span>
            <input className="admin-input" type="text" name="ctaHref" defaultValue={v.ctaHref ?? ""} maxLength={512} placeholder={labels.ctaHrefPlaceholder} />
          </label>
        </div>
      </fieldset>

      <div className="admin-row" style={{ gap: "1rem" }}>
        <label className="admin-field" style={{ flex: 1 }}>
          <span>{labels.metaTitle}</span>
          <input className="admin-input" type="text" name="metaTitle" defaultValue={v.metaTitle ?? ""} maxLength={255} />
        </label>
      </div>
      <label className="admin-field">
        <span>{labels.metaDesc}</span>
        <textarea className="admin-textarea" name="metaDesc" defaultValue={v.metaDesc ?? ""} maxLength={320} style={{ minHeight: "4rem" }} />
      </label>
    </div>
  );
}
