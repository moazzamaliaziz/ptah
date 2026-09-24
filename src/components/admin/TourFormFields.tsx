"use client";

import { useEffect, useRef, useState, type JSX } from "react";
import MediaPicker from "@/components/admin/MediaPicker";
import FaqEditor from "@/components/admin/FaqEditor";
import { useBeforeUnloadWarning } from "@/hooks/use-beforeunload-warning";
import { DIFFICULTIES, centsToDollars, type TourInput } from "@/content/catalog-admin-schema";
import { TOUR_TAGS, TOUR_TAG_LABELS, type TourTag } from "@/content/tour-tags";

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
export default function TourFormFields({ initial, saved, pending }: TourFormFieldsProps): JSX.Element {
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
          Unsaved changes — remember to save before leaving this page.
        </div>
      ) : null}

      <div className="admin-row" style={{ gap: "1rem" }}>
        <label className="admin-field" style={{ flex: "2 1 260px" }}>
          <span>Title</span>
          <input className="admin-input" type="text" name="title" defaultValue={v.title} maxLength={255} required />
        </label>
        <label className="admin-field" style={{ flex: "1 1 200px" }}>
          <span>Slug</span>
          <input className="admin-input" type="text" name="slug" defaultValue={v.slug} maxLength={191} placeholder="nile-cruise" required />
        </label>
      </div>

      <label className="admin-field">
        <span>Summary</span>
        <input className="admin-input" type="text" name="summary" defaultValue={v.summary} maxLength={512} required />
      </label>

      <label className="admin-field">
        <span>Description</span>
        <textarea className="admin-textarea" name="descriptionLong" defaultValue={v.descriptionLong} required style={{ minHeight: "9rem" }} />
      </label>

      <div className="admin-row" style={{ gap: "1rem" }}>
        <label className="admin-field" style={{ flex: "1 1 120px" }}>
          <span>Duration (days)</span>
          <input className="admin-input" type="number" name="durationDays" defaultValue={v.durationDays} min={1} max={365} required />
        </label>
        <label className="admin-field" style={{ flex: "1 1 140px" }}>
          <span>Base price</span>
          <input className="admin-input" type="text" name="basePrice" defaultValue={v.basePrice} inputMode="decimal" placeholder="1299.00" required />
        </label>
        <label className="admin-field" style={{ flex: "0 1 100px" }}>
          <span>Currency</span>
          <input className="admin-input" type="text" name="currency" defaultValue={v.currency} maxLength={3} required />
        </label>
        <label className="admin-field" style={{ flex: "1 1 160px" }}>
          <span>Difficulty</span>
          <select className="admin-input" name="difficulty" defaultValue={v.difficulty}>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </label>
      </div>

      <fieldset style={{ border: "1px solid rgba(26,35,64,0.15)", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1rem" }}>
        <legend className="admin-card__meta">Passenger pricing &amp; availability</legend>
        <div className="admin-row" style={{ gap: "1rem" }}>
          <label className="admin-field" style={{ flex: "1 1 140px" }}>
            <span>Child price (optional)</span>
            <input className="admin-input" type="text" name="childPrice" defaultValue={v.childPrice} inputMode="decimal" placeholder="e.g. 899.00" />
          </label>
          <label className="admin-field" style={{ flex: "1 1 140px" }}>
            <span>Infant price (optional)</span>
            <input className="admin-input" type="text" name="infantPrice" defaultValue={v.infantPrice} inputMode="decimal" placeholder="0.00 for free" />
          </label>
        </div>
        <p className="admin-card__meta" style={{ margin: "0.25rem 0 0.75rem" }}>
          Leave a price blank to hide that traveler type from the booking form. Enter <strong>0.00</strong> to offer it free (e.g. infants). The base price above is the adult price.
        </p>
        <label className="admin-row" style={{ gap: "0.5rem", alignItems: "center" }}>
          <input type="checkbox" name="bookingClosed" defaultChecked={v.bookingClosed} />
          <span>Pause online booking for this tour (shows a &ldquo;booking paused&rdquo; notice; existing bookings are unaffected)</span>
        </label>
      </fieldset>

      <fieldset style={{ border: "1px solid rgba(26,35,64,0.15)", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1rem" }}>
        <legend className="admin-card__meta">Style &amp; special tags (drive the Tours menu filters)</legend>
        <div className="admin-row" style={{ gap: "0.5rem 1.25rem", flexWrap: "wrap" }}>
          {TOUR_TAGS.map((tag) => (
            <label key={tag} className="admin-row" style={{ gap: "0.4rem", alignItems: "center", flex: "0 1 auto" }}>
              <input type="checkbox" name="tags" value={tag} defaultChecked={v.tags.includes(tag)} />
              <span>{TOUR_TAG_LABELS[tag]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="admin-row" style={{ gap: "1rem" }}>
        <MediaPicker name="heroImage" emit="url" initialUrl={v.heroImage} folder="tours" label="Hero image" />
        <MediaPicker name="ogImage" emit="url" initialUrl={v.ogImage} folder="tours" label="Social share image (OG)" />
      </div>

      <label className="admin-field">
        <span>Gallery image paths (one per line)</span>
        <textarea className="admin-textarea" name="gallery" defaultValue={v.gallery.join("\n")} placeholder="/assets/… or https://…" style={{ minHeight: "5rem" }} />
      </label>

      <div className="admin-row" style={{ gap: "1rem" }}>
        <label className="admin-field" style={{ flex: 1 }}>
          <span>What&apos;s included (one per line)</span>
          <textarea className="admin-textarea" name="inclusions" defaultValue={v.inclusions.join("\n")} style={{ minHeight: "7rem" }} />
        </label>
        <label className="admin-field" style={{ flex: 1 }}>
          <span>Not included (one per line)</span>
          <textarea className="admin-textarea" name="exclusions" defaultValue={v.exclusions.join("\n")} style={{ minHeight: "7rem" }} />
        </label>
      </div>

      <label className="admin-field">
        <span>Good to know / travel notes (one per line)</span>
        <textarea className="admin-textarea" name="travelNotes" defaultValue={v.travelNotes.join("\n")} style={{ minHeight: "5rem" }} />
      </label>

      <FaqEditor name="faqs" initial={v.faqs} />

      <fieldset style={{ border: "1px solid rgba(26,35,64,0.15)", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1rem" }}>
        <legend className="admin-card__meta">Custom call-to-action (optional — set both or neither)</legend>
        <div className="admin-row" style={{ gap: "1rem" }}>
          <label className="admin-field" style={{ flex: "1 1 200px" }}>
            <span>CTA label</span>
            <input className="admin-input" type="text" name="ctaLabel" defaultValue={v.ctaLabel ?? ""} maxLength={120} placeholder="e.g. Download itinerary" />
          </label>
          <label className="admin-field" style={{ flex: "2 1 260px" }}>
            <span>CTA link</span>
            <input className="admin-input" type="text" name="ctaHref" defaultValue={v.ctaHref ?? ""} maxLength={512} placeholder="/contact or https://…" />
          </label>
        </div>
      </fieldset>

      <div className="admin-row" style={{ gap: "1rem" }}>
        <label className="admin-field" style={{ flex: 1 }}>
          <span>Meta title (SEO)</span>
          <input className="admin-input" type="text" name="metaTitle" defaultValue={v.metaTitle ?? ""} maxLength={255} />
        </label>
      </div>
      <label className="admin-field">
        <span>Meta description (SEO)</span>
        <textarea className="admin-textarea" name="metaDesc" defaultValue={v.metaDesc ?? ""} maxLength={320} style={{ minHeight: "4rem" }} />
      </label>
    </div>
  );
}
