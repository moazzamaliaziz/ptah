import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { locales } from "@/i18n/config";

/**
 * robots.txt (Phase 5, Q15). Allow crawling of the public marketing/catalog
 * surface; disallow the areas that are `robots:{index:false}` at the page level
 * anyway (account/auth, booking outcomes, admin, internal + Stripe API routes)
 * so crawlers never waste budget on them. Absolute `Sitemap:` URL from the
 * canonical site origin.
 */
const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

/* Index:false surfaces that the proxy locale-prefixes (`/en/account`, …). Both
   the bare path and every `/{locale}` variant are disallowed so crawlers skip
   them whatever URL form they discover (Phase 3 i18n). */
const LOCALIZED_DISALLOW = [
  "/account",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
  "/search",
  "/booking/",
];

/* Locale-exempt in the proxy (never prefixed) — disallowed bare. */
const EXEMPT_DISALLOW = ["/admin", "/api/"];

export default function robots(): MetadataRoute.Robots {
  const disallow = [
    ...LOCALIZED_DISALLOW,
    ...locales.flatMap((loc) => LOCALIZED_DISALLOW.map((path) => `/${loc}${path}`)),
    ...EXEMPT_DISALLOW,
  ];
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow,
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
