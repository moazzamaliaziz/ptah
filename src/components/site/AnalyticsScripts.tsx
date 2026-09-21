import type { JSX } from "react";
import Script from "next/script";
import { getClientIntegrations } from "@/server/integration-scripts";

/**
 * Toggle-driven analytics / monitoring tag injection (Phase 5).
 *
 * Renders the client tags for whichever injectable integrations are ENABLED +
 * configured in the vault (GA4, GTM, Meta Pixel, Hotjar, Sentry). Nothing is
 * hardcoded — flip a toggle in /admin/integrations and the tag appears within
 * the page's revalidation window (this reads the vault server-side; only the
 * public id reaches the browser). Mounted in the PUBLIC `(site)` layout only,
 * so staff traffic in /admin is never tracked.
 *
 * SECURITY — these ids are interpolated into INLINE EXECUTABLE JS, so escaping
 * `<` is not enough (that only protects an HTML/JSON-LD text node). Each id is
 * validated against a strict per-vendor allowlist pattern and DROPPED if it
 * doesn't match, so an admin-supplied value can never break out of the string
 * literal and inject arbitrary script. The `next/script` `afterInteractive`
 * strategy keeps these off the critical path (perf budget, design.md §9).
 */

// Strict id shapes. Anything else is refused (returns null → no tag emitted).
const GA4_RE = /^G-[A-Z0-9]{4,20}$/;
const GTM_RE = /^GTM-[A-Z0-9]{4,12}$/;
const PIXEL_RE = /^\d{5,20}$/;
const HOTJAR_RE = /^\d{4,12}$/;

function safe(value: string, pattern: RegExp): string | null {
  return pattern.test(value) ? value : null;
}

/** Extract a Sentry DSN's public key + host, validated. `https://<key>@<host>/<projectId>`. */
function parseSentryDsn(dsn: string): { key: string; host: string; projectId: string } | null {
  try {
    const u = new URL(dsn);
    if (u.protocol !== "https:") return null;
    const key = u.username;
    const host = u.host;
    const projectId = u.pathname.replace(/^\//, "");
    if (!/^[a-f0-9]{16,64}$/i.test(key)) return null;
    if (!/^[a-z0-9.-]+\.(sentry\.io|ingest\.sentry\.io)$/i.test(host) && !/\.sentry\.io$/i.test(host)) {
      return null;
    }
    if (!/^\d+$/.test(projectId)) return null;
    return { key, host, projectId };
  } catch {
    return null;
  }
}

export default async function AnalyticsScripts(): Promise<JSX.Element | null> {
  const integrations = await getClientIntegrations();

  const ga4Id = integrations.ga4 ? safe(integrations.ga4.measurementId, GA4_RE) : null;
  const gtmId = integrations.gtm ? safe(integrations.gtm.containerId, GTM_RE) : null;
  const pixelId = integrations.metaPixel ? safe(integrations.metaPixel.pixelId, PIXEL_RE) : null;
  const hotjarId = integrations.hotjar ? safe(integrations.hotjar.siteId, HOTJAR_RE) : null;
  const sentry = integrations.sentry ? parseSentryDsn(integrations.sentry.dsn) : null;

  if (!ga4Id && !gtmId && !pixelId && !hotjarId && !sentry) return null;

  return (
    <>
      {/* Google Analytics 4 (gtag.js). */}
      {ga4Id && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');`}
          </Script>
        </>
      )}

      {/* Google Tag Manager. */}
      {gtmId && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      )}

      {/* Meta (Facebook) Pixel. */}
      {pixelId && (
        <Script id="meta-pixel-init" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${pixelId}');fbq('track','PageView');`}
        </Script>
      )}

      {/* Hotjar. */}
      {hotjarId && (
        <Script id="hotjar-init" strategy="afterInteractive">
          {`(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:${hotjarId},hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`}
        </Script>
      )}

      {/* Sentry browser SDK via CDN loader (errors + performance/RUM). */}
      {sentry && (
        <Script
          src={`https://js.sentry-cdn.com/${sentry.key}.min.js`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      )}
    </>
  );
}
