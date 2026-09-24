"use client";

import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { useSyncExternalStore, type JSX } from "react";
import { Icon } from "@/components/ui/Icon";
import { getWishlistCount, subscribeWishlist } from "@/lib/wishlist";
import type { Dictionary } from "@/i18n/dictionaries/en";

/**
 * "You have N bookmarks" pill (design.md §2.1.2). Reads the Phase-1a
 * localStorage wishlist adapter (src/lib/wishlist.ts); Phase 2 swaps the
 * store to the account sync without touching this component.
 *
 * `labels` carries the localized copy: `title` (pill tooltip/aria on the
 * link) and the `one`/`other` count phrases (`other` interpolates `{count}`).
 */
export function BookmarkPill({
  href,
  labels,
}: {
  href: string;
  labels: Dictionary["bookmarks"];
}): JSX.Element {
  const count = useSyncExternalStore(subscribeWishlist, getWishlistCount, () => 0);
  const phrase =
    count === 1 ? labels.one : labels.other.replace("{count}", String(count));

  return (
    <Link href={href} className="bookmarks-pill" title={labels.title} aria-label={phrase}>
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
