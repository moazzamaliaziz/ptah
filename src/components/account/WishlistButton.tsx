"use client";

import { useCallback, useSyncExternalStore, useTransition } from "react";
import { subscribeWishlist, getWishlistIds, toggleBookmark } from "@/lib/wishlist";
import { toggleWishlistAction } from "@/app/[lang]/(site)/account/actions";

/**
 * Save/unsave a tour (by slug). Guests persist to localStorage only; logged-in
 * users ALSO persist to their account via the server action, so the two stores
 * stay in union (a login later merges any guest-only slugs). Optimistic: the
 * local toggle updates the UI immediately; the server call reconciles the account.
 */
export default function WishlistButton({
  slug,
  isAuthenticated,
  variant = "icon",
}: {
  slug: string;
  isAuthenticated: boolean;
  variant?: "icon" | "labelled";
}) {
  const [, startTransition] = useTransition();

  const bookmarked = useSyncExternalStore(
    subscribeWishlist,
    () => getWishlistIds().includes(slug),
    () => false,
  );

  const onToggle = useCallback(() => {
    const nowOn = toggleBookmark(slug); // localStorage (source of truth for the pill)
    if (isAuthenticated) {
      startTransition(async () => {
        try {
          await toggleWishlistAction(slug, nowOn);
        } catch {
          /* best-effort account sync; localStorage already reflects intent */
        }
      });
    }
  }, [slug, isAuthenticated]);

  const label = bookmarked ? "Saved" : "Save";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? `Remove ${slug} from your wishlist` : `Save ${slug} to your wishlist`}
      className={
        variant === "labelled"
          ? "inline-flex items-center gap-2 rounded-full border border-nile/25 px-4 py-2 text-btn text-nile transition-colors hover:border-nile"
          : "inline-flex h-10 w-10 items-center justify-center rounded-full border border-grey-300 bg-white/90 text-ink transition-colors hover:border-nile hover:text-nile"
      }
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21.2l7.8-7.8 1-1a5.5 5.5 0 0 0 0-7.8Z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {variant === "labelled" ? label : null}
    </button>
  );
}
