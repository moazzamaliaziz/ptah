import type { JSX } from "react";
import Container from "@/components/layout/Container";
import Skeleton from "@/components/ui/Skeleton";

/**
 * Tour detail loading state — a hero band, then a two-column body (itinerary
 * on the left, a sticky booking card on the right) mirroring the real page so
 * the shell is stable while the DB-backed detail streams.
 */
export default function TourDetailLoading(): JSX.Element {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading tour…</span>
      <Skeleton className="h-[42vh] max-h-[520px] w-full rounded-none" />
      <Container className="py-12">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-4 h-10 w-3/4 max-w-2xl" />
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-5/6" />
            <Skeleton className="mt-8 h-6 w-48" />
            <Skeleton className="mt-4 h-24 w-full rounded-xl" />
            <Skeleton className="mt-4 h-24 w-full rounded-xl" />
          </div>
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </Container>
    </div>
  );
}
