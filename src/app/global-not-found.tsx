import type { Metadata } from "next";
import Link from "next/link";
import SiteLogo from "@/components/site/SiteLogo";
import NotFoundView from "@/components/site/NotFoundView";
import { cabin } from "@/lib/fonts";
import "./globals.css";

/**
 * Global not-found (Next 16, experimental.globalNotFound) — served for URLs that
 * match no route at all. With the app now using MULTIPLE ROOT LAYOUTS (the public
 * site lives under [lang], admin and maintenance are their own roots), there is
 * no single root layout to compose a plain `not-found.tsx` against, so the
 * top-level 404 must render its OWN complete <html> document and load globals +
 * font itself (it bypasses all layouts).
 *
 * English only: an unmatched URL has no negotiated locale. In-app notFound()
 * calls from public pages still render src/app/[lang]/(site)/not-found.tsx inside
 * full localized chrome.
 */
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={cabin.variable}>
      <body>
        <main className="flex min-h-screen flex-col items-center justify-center gap-12 bg-white px-6 py-16">
          <Link
            href="/"
            aria-label="Ptah Tours home"
            className="block w-16 text-nile [&>svg]:h-auto [&>svg]:w-full"
          >
            <SiteLogo />
          </Link>
          <NotFoundView />
        </main>
      </body>
    </html>
  );
}
