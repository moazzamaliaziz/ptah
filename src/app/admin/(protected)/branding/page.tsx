import type { JSX } from "react";
import { requireCapability, can } from "@/server/auth/rbac";
import { getSettings } from "@/server/settings";
import BrandingEditor from "./BrandingEditor";

export const dynamic = "force-dynamic";

/**
 * /admin/branding — global brand, contact and SEO settings (spec §5). View is
 * gated by `branding.view`; the form only submits when the role also has
 * `branding.edit` (the action re-checks it regardless).
 */
export default async function BrandingPage(): Promise<JSX.Element> {
  const user = await requireCapability("branding.view");
  const editable = can(user, "branding.edit");
  const s = await getSettings();

  return (
    <>
      <div className="admin-head">
        <h1>Branding</h1>
        <p>Logo, favicon, social links, contact details and theme — used across the public site and document metadata. The database is the source of truth; changes take effect within seconds.</p>
      </div>

      {!editable ? (
        <div className="admin-alert admin-alert--ok" role="status">
          Your role can view branding but not change it.
        </div>
      ) : (
        <BrandingEditor
          siteName={s["branding.siteName"]}
          tagline={s["branding.tagline"]}
          legalName={s["branding.legalName"]}
          copyrightLine={s["branding.copyrightLine"]}
          logoMediaId={s["branding.logoMediaId"]}
          footerLogoMediaId={s["branding.footerLogoMediaId"]}
          faviconMediaId={s["branding.faviconMediaId"]}
          ogImageMediaId={s["seo.ogImageMediaId"]}
          socials={s["branding.socials"]}
          email={s["contact.email"]}
          phone={s["contact.phone"]}
          whatsapp={s["contact.whatsapp"]}
          themeColor={s["seo.themeColor"]}
        />
      )}
    </>
  );
}
