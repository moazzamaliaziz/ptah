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
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(cents / 100);
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