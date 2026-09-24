"use client";

import { useEffect } from "react";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import Container from "@/components/layout/Container";

/**
 * Public-site error boundary (App Router convention — must be a Client
 * Component). Catches render/data errors in any (site) page and renders inside
 * the site chrome. `reset()` re-attempts the failed segment (Next's built-in
 * recovery); a "Back to home" escape hatch is offered alongside.
 *
 * We log only the framework-provided `digest` (the server error's correlation
 * id) — never the raw error message/stack, which can carry internals. In
 * production the matching server-side detail is captured by onRequestError
 * (src/instrumentation.ts).
 */
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("site error boundary", { digest: error.digest });
  }, [error]);

  return (
    <Container className="py-24">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">
          Something went wrong
        </p>
        <h1 className="mt-3 text-section-h2 font-bold text-ink">
          We hit an unexpected snag
        </h1>
        <p className="mt-4 text-body text-ink/65">
          This one’s on us. Try again in a moment — if it keeps happening, head back
          home and we’ll help you from there.
        </p>
        {error.digest && (
          <p className="mt-3 text-meta text-ink/45">Reference: {error.digest}</p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-nile px-6 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-nile/90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-nile/20 px-6 py-2.5 text-[13px] font-semibold text-nile transition-colors hover:border-rust hover:text-rust"
          >
            Back to home
          </Link>
        </div>
      </div>
    </Container>
  );
}
