"use client";

import { useEffect, useRef, useState, type JSX } from "react";
import MediaPicker from "@/components/admin/MediaPicker";
import FaqEditor from "@/components/admin/FaqEditor";
import { useBeforeUnloadWarning } from "@/hooks/use-beforeunload-warning";
import { DIFFICULTIES, centsToDollars, type TourInput } from "@/content/catalog-admin-schema";
import { TOUR_TAGS, TOUR_TAG_LABELS, type TourTag } from "@/content/tour-tags";
import type { TourFormFieldsDict, FaqEditorDict } from "@/i18n/admin/dictionary";

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
  currency: string;
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
  currency: "USD",
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
export function toFieldValues(input: (TourInput & { basePriceCents: number }) | undefined): TourFieldValues {
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
        <label className="admin-field" style={{ flex: "0 1 100px" }}>
          <span>{labels.currency}</span>
          <input className="admin-input" type="text" name="currency" defaultValue={v.currency} maxLength={3} required />
        </label>
        <label className="admin-field" style={{ flex: "1 1 160px" }}>
          <span>{labels.difficulty}</span>
          <select className="admin-input" name="difficulty" defaultValue={v.difficulty}>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>{labels.difficultyLabels[d] ?? d}</option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="admin-fieldset">
        <legend>{labels.pricingLegend}</legend>
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

      <fieldset className="admin-fieldset">
        <legend>{labels.tagsLegend}</legend>
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

      <fieldset className="admin-fieldset">
        <legend>{labels.ctaLegend}</legend>
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
