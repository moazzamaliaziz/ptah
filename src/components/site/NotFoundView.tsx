import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import type { JSX } from "react";

/**
 * Presentational 404 body, shared by the two not-found entry points so the
 * copy and CTAs stay in one place:
 *   - src/app/[lang]/(site)/not-found.tsx — in-app notFound() (invalid tour/city/
 *     country slug); rendered INSIDE the full site chrome.
 *   - src/app/not-found.tsx — genuinely unmatched URLs; rendered BARE on the
 *     root layout, so that file supplies its own minimal chrome around this.
 *
 * Content only — the caller owns the surrounding container/spacing. Current
 * token system only (nile/rust/ink); no legacy scaffold tokens.
 */
export default function NotFoundView(): JSX.Element {
  return (
    <div className="mx-auto max-w-xl text-center">
      <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">Error 404</p>
      <h1 className="mt-3 text-section-h2 font-bold text-ink">
        This page has wandered off the map
      </h1>
      <p className="mt-4 text-body text-ink/65">
        The page you’re looking for doesn’t exist or may have moved. Let’s get you
        back on the trail.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-nile px-6 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-nile/90"
        >
          Back to home
        </Link>
        <Link
          href="/tours"
          className="rounded-full border border-nile/20 px-6 py-2.5 text-[13px] font-semibold text-nile transition-colors hover:border-rust hover:text-rust"
        >
          Browse all tours
        </Link>
      </div>
    </div>
  );
}
