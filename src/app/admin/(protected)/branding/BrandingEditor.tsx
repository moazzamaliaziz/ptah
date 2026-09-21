"use client";

import { useActionState, type JSX } from "react";
import MediaPicker from "@/components/admin/MediaPicker";
import SocialsEditor from "@/components/admin/SocialsEditor";
import { updateBrandingAction, type BrandingFormState } from "./actions";
import type { SocialLink } from "@/content/settings-schema";

/** Current values the form is seeded with (resolved settings, all client-safe). */
export interface BrandingEditorProps {
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
  const [state, formAction, pending] = useActionState<BrandingFormState, FormData>(
    updateBrandingAction,
    {},
  );

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
      {state.error ? (
        <div className="admin-alert admin-alert--error" role="alert">{state.error}</div>
      ) : null}
      {state.ok ? (
        <div className="admin-alert admin-alert--ok" role="status">Branding saved. Public pages update within seconds.</div>
      ) : null}

      {/* Identity */}
      <section className="admin-card">
        <h2>Identity</h2>
        <label className="admin-field">
          <span>Site name</span>
          <input className="admin-input" type="text" name="siteName" defaultValue={props.siteName} maxLength={120} required />
        </label>
        <label className="admin-field">
          <span>Tagline</span>
          <input className="admin-input" type="text" name="tagline" defaultValue={props.tagline} maxLength={200} required />
        </label>
        <label className="admin-field">
          <span>Legal name</span>
          <input className="admin-input" type="text" name="legalName" defaultValue={props.legalName} maxLength={200} required />
        </label>
        <label className="admin-field">
          <span>Copyright line <span className="admin-card__meta">({"{year}"} is replaced automatically)</span></span>
          <input className="admin-input" type="text" name="copyrightLine" defaultValue={props.copyrightLine} maxLength={200} required />
        </label>
      </section>

      {/* Logos & favicon (id mode: settings store a MediaAsset id) */}
      <section className="admin-card">
        <h2>Logos &amp; favicon</h2>
        <p className="admin-card__meta" style={{ marginBottom: "0.75rem" }}>
          Leave empty to use the built-in cartouche wordmark and default favicon. Raster (PNG/WebP) is preferred for the favicon.
        </p>
        <div className="admin-row" style={{ gap: "1rem", flexWrap: "wrap" }}>
          <MediaPicker name="logoMediaId" emit="id" defaultMediaId={props.logoMediaId} folder="branding" label="Header logo" />
          <MediaPicker name="footerLogoMediaId" emit="id" defaultMediaId={props.footerLogoMediaId} folder="branding" label="Footer logo" />
          <MediaPicker name="faviconMediaId" emit="id" defaultMediaId={props.faviconMediaId} folder="favicon" label="Favicon" />
        </div>
      </section>

      {/* Social links */}
      <section className="admin-card">
        <h2>Social links</h2>
        <SocialsEditor name="socials" initial={props.socials} />
      </section>

      {/* Contact */}
      <section className="admin-card">
        <h2>Contact</h2>
        <p className="admin-card__meta" style={{ marginBottom: "0.75rem" }}>
          Email appears on legal pages. Phone and WhatsApp drive the floating contact widgets.
        </p>
        <div className="admin-row" style={{ gap: "1rem", flexWrap: "wrap" }}>
          <label className="admin-field" style={{ flex: "1 1 220px" }}>
            <span>Contact email</span>
            <input className="admin-input" type="email" name="email" defaultValue={props.email} placeholder="hello@ptahtours.com" />
          </label>
          <label className="admin-field" style={{ flex: "1 1 160px" }}>
            <span>Phone</span>
            <input className="admin-input" type="text" name="phone" defaultValue={props.phone} maxLength={40} placeholder="+20 …" />
          </label>
          <label className="admin-field" style={{ flex: "1 1 160px" }}>
            <span>WhatsApp</span>
            <input className="admin-input" type="text" name="whatsapp" defaultValue={props.whatsapp} maxLength={40} placeholder="+20 …" />
          </label>
        </div>
      </section>

      {/* SEO / theme */}
      <section className="admin-card">
        <h2>SEO &amp; theme</h2>
        <div className="admin-row" style={{ gap: "1rem", flexWrap: "wrap", alignItems: "flex-end" }}>
          <MediaPicker name="ogImageMediaId" emit="id" defaultMediaId={props.ogImageMediaId} folder="branding" label="Default social share image (OG)" />
          <label className="admin-field" style={{ flex: "0 1 200px" }}>
            <span>Theme color</span>
            <input className="admin-input" type="text" name="themeColor" defaultValue={props.themeColor} placeholder="#1a2340" pattern="^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$" />
          </label>
        </div>
      </section>

      <div>
        <button className="admin-btn" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save branding"}
        </button>
      </div>
    </form>
  );
}
