import type { JSX } from "react";
import Container from "@/components/layout/Container";
import Skeleton from "@/components/ui/Skeleton";

/**
 * Generic public-route loading fallback — shown while any (site) segment that
 * lacks its own loading.tsx streams (account, booking, search, about, …).
 * High-value dynamic segments (/tours, /tours/[slug]) ship tailored skeletons.
 *
 * role="status" + sr-only text announces the busy state to assistive tech; the
 * visual bars are aria-hidden inside Skeleton.
 */
export default function SiteLoading(): JSX.Element {
  return (
    <Container className="py-24">
      <div role="status" aria-live="polite">
        <span className="sr-only">Loading…</span>
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-4 h-10 w-2/3 max-w-md" />
        <Skeleton className="mt-4 h-4 w-full max-w-xl" />
        <Skeleton className="mt-2 h-4 w-5/6 max-w-lg" />
      </div>
    </Container>
  );
}
