import type { JSX } from "react";

/**
 * Offline fallback page (spec §3). Shown by the service worker when a navigation
 * fails with no network. Fully static, no client JS: the brand icon is precached
 * and the link lets the browser retry once a connection returns. Copy is English
 * only — a single precached document serves every locale.
 */
export default function OfflinePage(): JSX.Element {
  return (
    <main className="offline">
      {/* Precached by the service worker, so it renders while offline. */}
      {/* eslint-disable-next-line @next/next/no-img-element -- offline shell must not depend on next/image runtime. */}
      <img src="/icons/icon-192.png" alt="Ptah Tours" width={72} height={72} />
      <h1>You&rsquo;re offline</h1>
      <p>
        This page isn&rsquo;t available without a connection. Check your network,
        then head back to explore our Egypt journeys.
      </p>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- the offline shell must use a plain anchor: next/link navigates via RSC/prefetch, which cannot work with no network. A full-document GET is exactly the retry we want. */}
      <a href="/">Go to homepage</a>
    </main>
  );
}
