"use client";

import { useMemo, useState, useSyncExternalStore, type JSX } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import TourCard from "@/components/commerce/TourCard";
import type { TourListItem } from "@/server/catalog";
import { getWishlistIds, subscribeWishlist } from "@/lib/wishlist";

type Tab = "plan" | "bookmarks";

/**
 * Trip builder (Wave 1). Two tabs:
 *  - "plan": an entry point that points travelers at browsing and enquiring,
 *  - "bookmarks": the tours the visitor has saved (wishlist), resolved from the
 *    localStorage adapter against the full published catalog passed in by the
 *    server. Account sync stays inside src/lib/wishlist.ts; this only reads.
 *
 * The wishlist snapshot is stringified (join) so useSyncExternalStore compares a
 * stable primitive, not a fresh array reference each render.
 */
export default function TripBuilder({
  tours,
  isAuthenticated,
  initialTab,
}: {
  tours: TourListItem[];
  isAuthenticated: boolean;
  initialTab: Tab;
}): JSX.Element {
  const [tab, setTab] = useState<Tab>(initialTab);

  const savedKey = useSyncExternalStore(
    subscribeWishlist,
    () => getWishlistIds().join(","),
    () => "",
  );

  const savedTours = useMemo(() => {
    const saved = new Set(savedKey ? savedKey.split(",") : []);
    // Preserve the visitor's save order (wishlist order), not catalog order.
    const order = savedKey ? savedKey.split(",") : [];
    const bySlug = new Map(tours.map((t) => [t.slug, t]));
    return order.flatMap((slug) => {
      const t = bySlug.get(slug);
      return t && saved.has(slug) ? [t] : [];
    });
  }, [savedKey, tours]);

  const tabClass = (active: boolean): string =>
    `rounded-full px-5 py-2 text-meta font-semibold transition-colors ${
      active ? "bg-nile text-white" : "border border-grey-300/70 text-ink/70 hover:text-ink"
    }`;

  return (
    <div>
      <div className="flex flex-wrap gap-3" role="tablist" aria-label="Trip builder">
        <button type="button" role="tab" aria-selected={tab === "plan"} className={tabClass(tab === "plan")} onClick={() => setTab("plan")}>
          Plan a trip
        </button>
        <button type="button" role="tab" aria-selected={tab === "bookmarks"} className={tabClass(tab === "bookmarks")} onClick={() => setTab("bookmarks")}>
          Bookmarks
        </button>
      </div>

      {tab === "plan" ? (
        <div className="mt-10 max-w-2xl">
          <h2 className="text-section-h2 font-bold text-ink">Build your Egypt trip</h2>
          <p className="mt-4 text-body leading-relaxed text-ink/70">
            Start by browsing our tours and bookmarking the ones that catch your eye — they&apos;ll gather
            under the Bookmarks tab. When you&apos;re ready, send us your shortlist and we&apos;ll shape a
            single private itinerary around it, tuned to your dates, pace, and interests.
          </p>
          <ol className="mt-8 space-y-4">
            {[
              "Browse tours and tap the bookmark icon to save any you like.",
              "Open the Bookmarks tab to review your shortlist in one place.",
              "Send it to us — we'll turn it into one seamless, private trip.",
            ].map((step, i) => (
              <li key={i} className="flex gap-4">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-nile text-meta font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-body leading-relaxed text-ink/75">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="/tours" variant="primary">Browse tours</Button>
            <Button href="/contact" variant="secondary">Talk to a trip designer</Button>
          </div>
        </div>
      ) : (
        <div className="mt-10">
          <h2 className="text-section-h2 font-bold text-ink">Your bookmarks</h2>
          {savedTours.length > 0 ? (
            <>
              <p className="mt-3 text-meta text-ink/60">
                {savedTours.length} saved {savedTours.length === 1 ? "tour" : "tours"}. Ready to plan?{" "}
                <Link href="/contact" className="font-semibold text-rust hover:underline">Send us your shortlist</Link>.
              </p>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {savedTours.map((t) => (
                  <TourCard key={t.slug} tour={t} isAuthenticated={isAuthenticated} />
                ))}
              </div>
            </>
          ) : (
            <div className="mt-8 rounded-xl border border-grey-300/60 bg-papyrus/50 p-8 text-center">
              <p className="text-body text-ink/70">
                You haven&apos;t saved any tours yet. Browse the catalog and tap the bookmark icon on any tour to
                add it here.
              </p>
              <div className="mt-6">
                <Button href="/tours" variant="primary">Browse tours</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
