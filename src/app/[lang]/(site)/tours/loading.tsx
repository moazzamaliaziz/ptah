import type { JSX } from "react";
import Container from "@/components/layout/Container";
import Skeleton from "@/components/ui/Skeleton";

/* One placeholder card, mirroring the real TourCard's shape (3:2 image + a
   text block with price/CTA footer) so the layout doesn't shift on load. */
function TourCardSkeleton(): JSX.Element {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-grey-300/60 bg-white">
      <Skeleton className="aspect-[3/2] w-full rounded-none" />
      <div className="flex flex-1 flex-col p-5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-2 h-5 w-3/4" />
        <Skeleton className="mt-3 h-3 w-full" />
        <Skeleton className="mt-1.5 h-3 w-5/6" />
        <div className="mt-4 flex items-end justify-between border-t border-grey-300/50 pt-4">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-9 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* Stable keys for the placeholder grid (no array-index keys). */
const PLACEHOLDER_KEYS = ["a", "b", "c", "d", "e", "f"] as const;

/** Catalog loading state — header bars + a 3-column TourCard grid skeleton. */
export default function ToursLoading(): JSX.Element {
  return (
    <Container className="py-14">
      <div role="status" aria-live="polite">
        <span className="sr-only">Loading tours…</span>
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-9 w-64 max-w-full" />
        <Skeleton className="mt-4 h-4 w-full max-w-xl" />
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLACEHOLDER_KEYS.map((k) => (
            <TourCardSkeleton key={k} />
          ))}
        </div>
      </div>
    </Container>
  );
}
