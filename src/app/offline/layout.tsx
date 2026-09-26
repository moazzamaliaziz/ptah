import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Offline fallback root layout (spec §3). Its own root layout — it lives outside
 * `[lang]`, so it renders none of the DB-driven public chrome and never
 * negotiates a locale (proxy.ts exempts `/offline` from the locale redirect).
 *
 * The service worker precaches this route and serves it for any failed document
 * navigation, so it must render with zero network: styles are inlined here (no
 * external stylesheet), the only asset is the precached brand icon, and there is
 * no client JS. force-static keeps the precached HTML request-independent.
 */
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Offline",
  // Never index the fallback; it is intentionally absent from the sitemap.
  robots: { index: false, follow: false },
};

const OFFLINE_CSS = `
  *{box-sizing:border-box}
  html,body{margin:0;height:100%}
  body{
    background:#1a2340;color:#f4f5f7;
    font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
    display:flex;align-items:center;justify-content:center;
    min-height:100vh;padding:24px;line-height:1.5;
  }
  .offline{max-width:26rem;text-align:center}
  .offline img{width:72px;height:72px;border-radius:16px;margin:0 auto 20px}
  .offline h1{font-size:1.6rem;margin:0 0 .5rem;font-weight:700}
  .offline p{margin:0 0 1.5rem;color:#c7cbd6}
  .offline a{
    display:inline-block;padding:.7rem 1.4rem;border-radius:10px;
    background:#c9a227;color:#1a2340;font-weight:600;text-decoration:none;
  }
  .offline a:focus-visible{outline:3px solid #f4f5f7;outline-offset:2px}
`;

export default function OfflineLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <style dangerouslySetInnerHTML={{ __html: OFFLINE_CSS }} />
        {children}
      </body>
    </html>
  );
}
