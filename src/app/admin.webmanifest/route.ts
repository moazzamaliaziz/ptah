import { getSettings } from "@/server/settings";

/**
 * Admin PWA manifest — a SECOND, distinct installable app alongside the public
 * site manifest (app/manifest.ts, served at /manifest.webmanifest).
 *
 * Why a route handler and not another manifest.ts: Next allows only ONE
 * app/manifest.* convention file (it maps to /manifest.webmanifest). A second
 * manifest must be served explicitly — here at /admin.webmanifest, linked from
 * the admin layout via `metadata.manifest`.
 *
 * Distinct identity (developer.chrome.com/docs/capabilities/pwa-manifest-id):
 * a manifest `id` IS the PWA's identity. Same origin, different `id`/`scope`
 * ("/admin" vs the site's "/") ⇒ the browser installs and lists this as a
 * SEPARATE app ("Ptah … Admin"), so staff can tell it apart from the customer
 * app on the home screen. `start_url: "/admin"` opens the panel (→ the login
 * screen when signed out, the dashboard when signed in).
 *
 * Lives OUTSIDE the /admin/ folder so it is publicly fetchable (the login page
 * that links it is itself public) and inherits none of the panel's shell.
 * Served `no-store`: it carries no secrets, but the app's installed identity
 * should never be held stale by an intermediary cache.
 */
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const s = await getSettings();
  const siteName = s["branding.siteName"];
  const theme = s["seo.themeColor"];

  // Home-screen label (~12-char budget): "<First word> Admin", e.g. "Ptah Admin".
  const shortName = `${siteName.split(/\s+/)[0]} Admin`.slice(0, 12);

  const manifest = {
    id: "/admin",
    name: `${siteName} Admin`,
    short_name: shortName,
    description: `Staff panel for ${siteName} — bookings, tours, content and settings.`,
    start_url: "/admin",
    scope: "/admin",
    display: "standalone",
    orientation: "any",
    background_color: theme,
    theme_color: theme,
    lang: "en",
    dir: "ltr",
    categories: ["business", "productivity"],
    icons: [
      { src: "/icons/admin-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/admin-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/admin-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };

  return new Response(JSON.stringify(manifest), {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "no-store",
    },
  });
}
