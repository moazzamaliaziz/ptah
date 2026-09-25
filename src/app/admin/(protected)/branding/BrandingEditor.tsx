"use client";

import { useActionState, useEffect, useRef, type JSX } from "react";
import MediaPicker from "@/components/admin/MediaPicker";
import SocialsEditor from "@/components/admin/SocialsEditor";
import { updateBrandingAction, type BrandingFormState } from "./actions";
import type { SocialLink } from "@/content/settings-schema";
import type { BrandingEditorDict } from "@/i18n/admin/dictionary";

/** Current values the form is seeded with (resolved settings, all client-safe). */
export interface BrandingEditorProps {
  labels: BrandingEditorDict;
  siteName: string;
  tagline: string;
  legalName: string;
  copyrightLine: string;
  logoMediaId: string | null;
  footerLogoMediaId: string | null;
  faviconMediaId: string | null;
  ogImageMediaId: string | null;
  socials: SocialLink[];
  email: string;
  phone: string;
  whatsapp: string;
  themeColor: string;
}

/**
 * Single branding form (spec §5): logos/favicon/OG via MediaPicker, identity
 * text, socials repeater, contact fields, theme color. Posts to
 * updateBrandingAction, which validates + persists every SiteSetting and
 * revalidates the public chrome.
 */
export default function BrandingEditor(props: BrandingEditorProps): JSX.Element {
  const t = props.labels;
  const [state, formAction, pending] = useActionState<BrandingFormState, FormData>(
    updateBrandingAction,
    {},
  );
  const alertsRef = useRef<HTMLDivElement>(null);
  // Surface the save result: scroll the success/error notice into view so a save
  // triggered from the bottom button isn't silent.
  useEffect(() => {
    if (state.ok || state.error) {
      alertsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [state]);

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      <div ref={alertsRef}>
        {state.error ? (
          <div className="admin-alert admin-alert--error" role="alert">{state.error}</div>
        ) : null}
        {state.ok ? (
          <div className="admin-alert admin-alert--ok" role="status">{t.savedNote}</div>
        ) : null}
      </div>

      {/* Identity */}
      <section className="admin-card">
        <h2>{t.identityHeading}</h2>
        <label className="admin-field">
          <span>{t.siteName}</span>
          <input className="admin-input" type="text" name="siteName" defaultValue={props.siteName} maxLength={120} required />
        </label>
        <label className="admin-field">
          <span>{t.tagline}</span>
          <input className="admin-input" type="text" name="tagline" defaultValue={props.tagline} maxLength={200} required />
        </label>
        <label className="admin-field">
          <span>{t.legalName}</span>
          <input className="admin-input" type="text" name="legalName" defaultValue={props.legalName} maxLength={200} required />
        </label>
        <label className="admin-field">
          <span>{t.copyrightLine} <span className="admin-card__meta">{t.copyrightHint}</span></span>
          <input className="admin-input" type="text" name="copyrightLine" defaultValue={props.copyrightLine} maxLength={200} required />
        </label>
      </section>

      {/* Logos & favicon (id mode: settings store a MediaAsset id) */}
      <section className="admin-card">
        <h2>{t.logosHeading}</h2>
        <p className="admin-card__meta" style={{ marginBottom: "0.75rem" }}>
          {t.logosHint}
        </p>
        <div className="admin-row" style={{ gap: "1rem", flexWrap: "wrap" }}>
          <MediaPicker name="logoMediaId" emit="id" defaultMediaId={props.logoMediaId} folder="branding" label={t.headerLogo} />
          <MediaPicker name="footerLogoMediaId" emit="id" defaultMediaId={props.footerLogoMediaId} folder="branding" label={t.footerLogo} />
          <MediaPicker name="faviconMediaId" emit="id" defaultMediaId={props.faviconMediaId} folder="favicon" label={t.favicon} />
        </div>
      </section>

      {/* Social links */}
      <section className="admin-card">
        <h2>{t.socialLinksHeading}</h2>
        <SocialsEditor name="socials" initial={props.socials} labels={t.socials} />
      </section>

      {/* Contact */}
      <section className="admin-card">
        <h2>{t.contactHeading}</h2>
        <p className="admin-card__meta" style={{ marginBottom: "0.75rem" }}>
          {t.contactHint}
        </p>
        <div className="admin-row" style={{ gap: "1rem", flexWrap: "wrap" }}>
          <label className="admin-field" style={{ flex: "1 1 220px" }}>
            <span>{t.contactEmail}</span>
            <input className="admin-input" type="email" name="email" defaultValue={props.email} placeholder="hello@ptahtours.com" />
          </label>
          <label className="admin-field" style={{ flex: "1 1 160px" }}>
            <span>{t.phone}</span>
            <input className="admin-input" type="text" name="phone" defaultValue={props.phone} maxLength={40} placeholder="+20 …" />
          </label>
          <label className="admin-field" style={{ flex: "1 1 160px" }}>
            <span>{t.whatsapp}</span>
            <input className="admin-input" type="text" name="whatsapp" defaultValue={props.whatsapp} maxLength={40} placeholder="+20 …" />
          </label>
        </div>
      </section>

      {/* SEO / theme */}
      <section className="admin-card">
        <h2>{t.seoThemeHeading}</h2>
        <div className="admin-row" style={{ gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
          <MediaPicker name="ogImageMediaId" emit="id" defaultMediaId={props.ogImageMediaId} folder="branding" label={t.ogImage} />
          <label className="admin-field" style={{ flex: "0 1 200px" }}>
            <span>{t.themeColor}</span>
            <input className="admin-input" type="text" name="themeColor" defaultValue={props.themeColor} placeholder="#1a2340" pattern="^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$" />
          </label>
        </div>
      </section>

      <div>
        <button className="admin-btn" type="submit" disabled={pending}>
          {pending ? t.saving : t.save}
        </button>
      </div>
    </form>
  );
}
