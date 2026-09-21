/**
 * Wishlist (bookmarks) store — localStorage adapter, keyed by tour SLUG.
 *
 * "You have N bookmarks" chrome pill reads through `subscribeWishlist` +
 * `getWishlistCount`. Persists under a versioned key; same-tab changes emit a
 * CustomEvent (storage events only fire cross-tab).
 *
 * Phase 4 account sync (all localStorage mutation stays isolated to this file):
 *   - on login the form submits these slugs; the server merges them into the
 *     account `Wishlist` (union) and returns the merged set,
 *   - `setWishlistIds` then hydrates localStorage from the account so the pill
 *     reflects the synced list,
 *   - `clearWishlist` runs on logout so one account's list never bleeds into the
 *     next guest on a shared device.
 * The account tourId ↔ slug mapping is handled server-side (src/server/wishlist.ts).
 */
const STORAGE_KEY = "ptah:wishlist:v1";
const CHANGE_EVENT = "ptah:wishlist-changed";

function readRaw(): string[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((v): v is string => typeof v === "string");
  } catch {
    return [];
  }
}

function writeRaw(ids: string[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new CustomEvent<string[]>(CHANGE_EVENT, { detail: ids }));
  } catch {
    /* storage full / private mode — silently degrade (best effort) */
  }
}

/** Read all bookmarked item ids (empty array on server or first run). */
export function getWishlistIds(): string[] {
  if (typeof window === "undefined") return [];
  return readRaw();
}

export function getWishlistCount(): number {
  return readRaw().length;
}

export function isBookmarked(id: string): boolean {
  return readRaw().includes(id);
}

/** Toggle membership; returns the new membership state. */
export function toggleBookmark(id: string): boolean {
  const ids = readRaw();
  const exists = ids.includes(id);
  writeRaw(exists ? ids.filter((v) => v !== id) : [...ids, id]);
  return !exists;
}

/**
 * Replace the entire local wishlist (used to hydrate from the account after a
 * login merge). De-dupes and broadcasts.
 */
export function setWishlistIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  writeRaw([...new Set(ids.filter((v) => typeof v === "string" && v.length > 0))]);
}

/** Clear the local wishlist (logout on a shared device). */
export function clearWishlist(): void {
  if (typeof window === "undefined") return;
  writeRaw([]);
}

/**
 * Subscribe to wishlist changes (same-tab CustomEvent + cross-tab `storage`).
 * Returns an unsubscribe function.
 */
export function subscribeWishlist(onChange: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) onChange();
  };
  const onCustom = () => onChange();
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onCustom);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onCustom);
  };
}
