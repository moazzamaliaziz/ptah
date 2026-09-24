/**
 * Small, dependency-free utilities shared across the app.
 */

/** Conditional className joiner (clsx-lite, zero deps). */
export function cn(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}

/** Format integer minor units (cents) as a localized money string. */
export function formatPriceCents(
  cents: number,
  currency: string,
  locale = "en-US",
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(cents / 100);
  } catch {
    // A malformed/unknown currency code makes Intl.NumberFormat throw RangeError.
    // Fall back to a plain amount + code so one bad row never crashes a page or PDF.
    return `${(cents / 100).toFixed(2)} ${currency}`;
  }
}

/** Lowercase, URL-safe slug. The DB enforces uniqueness; this enforces shape. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}