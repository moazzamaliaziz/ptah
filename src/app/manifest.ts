import type { MetadataRoute } from "next";
import { getSettings } from "@/server/settings";

/**
 * Web app manifest (spec §3, D2). Served by Next at /manifest.webmanifest with
 * an auto-injected <link rel="manifest">. Reading DB-driven branding
 * (getSettings never throws — returns defaults on error) makes this dynamic,
 * which is fine: the manifest is fetched rarely (install/first load) and stays
 * consistent with the site's configured name and theme colour.
 *
 * Icons are the committed monogram set under /public/icons (see
 * scripts/gen-pwa-icons.mjs). Only stable, install-critical members are used;
 * experimental members (display_override, WCO, tabbed, *_localized) are avoided
 * per the spec's cross-browser guidance.
 */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const s = await getSettings();
  const name = s["branding.siteName"];
  const theme = s["seo.themeColor"];
  // short_name should stay ~12 chars (home-screen label). Prefer the full name
  // when it already fits, else the first word, and hard-cap the result so an
  // unusually long single-word site name can't produce an oversized label.
  const shortName = (name.length <= 12 ? name : name.split(/\s+/)[0]).slice(0, 12);

  return {
    id: "/",
    name,
    short_name: shortName,
    description: s["branding.tagline"],
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: theme,
    theme_color: theme,
    lang: "en",
    dir: "ltr",
    categories: ["travel", "lifestyle"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
