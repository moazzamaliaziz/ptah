/**
 * Single currency for the whole site (P8).
 *
 * Every price Ptah publishes and charges is US dollars. This module is the one
 * place that says so: the admin schemas coerce to it, the tour/coupon write
 * paths store it, and the public funnel formats with it.
 *
 * The `currency` COLUMNS stay in the database. They are not dead weight:
 *   • historical rows keep the currency they were actually charged in, so an
 *     old invoice never silently re-labels itself;
 *   • every money helper (`formatPriceCents`, the Stripe/PayPal adapters) takes
 *     an amount *and* its currency, which is the shape that keeps a mixed-
 *     currency history readable and makes adding a second currency later a
 *     data change rather than a schema migration.
 *
 * Pure module — no imports, safe from client components, server code and the
 * tsx gate scripts alike.
 */

/** ISO-4217 code every new price is written with. */
export const SITE_CURRENCY = "USD";

/** Currencies the app is willing to accept on input. Exactly one, today. */
export const SUPPORTED_CURRENCIES = [SITE_CURRENCY] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

/** True when `code` is a currency this app still writes new rows in. */
export function isSupportedCurrency(code: string): code is SupportedCurrency {
  return (SUPPORTED_CURRENCIES as readonly string[]).includes(code.toUpperCase());
}
