/**
 * Global header — RSC wrapper (reads the content module + branding settings
 * once at request time) + a single client island (SiteHeaderChrome) owning all
 * interactive chrome. The header logo + site name are DB-driven (Phase 7 S3):
 * an admin-set logo overrides the built-in cartouche SVG wordmark.
 */
import type { JSX } from "react";
import { siteNav } from "@/content/landing";
import SiteHeaderChrome from "@/components/site/SiteHeaderChrome";
import { getSettings } from "@/server/settings";

export async function SiteHeader(): Promise<JSX.Element> {
  const settings = await getSettings();
  const logoId = settings["branding.logoMediaId"];
  return (
    <SiteHeaderChrome
      nav={siteNav}
      logoSrc={logoId ? `/api/media/${logoId}` : null}
      siteName={settings["branding.siteName"]}
    />
  );
}

export default SiteHeader;
