"use client";

import Link from "next/link";
import { useSyncExternalStore, type JSX } from "react";
import { Icon } from "@/components/ui/Icon";
import { getWishlistCount, subscribeWishlist } from "@/lib/wishlist";

/**
 * "You have N bookmarks" pill (design.md §2.1.2). Reads the Phase-1a
 * localStorage wishlist adapter (src/lib/wishlist.ts); Phase 2 swaps the
 * store to the account sync without touching this component.
 */
export function BookmarkPill({ href }: { href: string }): JSX.Element {
  const count = useSyncExternalStore(subscribeWishlist, getWishlistCount, () => 0);
  const phrase =
    count === 1 ? "You have 1 bookmark" : `You have ${count} bookmarks`;

  return (
    <Link href={href} className="bookmarks-pill" title="View your Bookmarks" aria-label={phrase}>
      <span className="bookmarks-pill__icon">
        <Icon name="bookmark" size={18} />
      </span>
      <span className="bookmarks-pill__text" suppressHydrationWarning>
        {phrase}
      </span>
    </Link>
  );
}

export default BookmarkPill;
