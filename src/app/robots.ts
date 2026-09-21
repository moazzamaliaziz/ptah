import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

/**
 * robots.txt (Phase 5, Q15). Allow crawling of the public marketing/catalog
 * surface; disallow the areas that are `robots:{index:false}` at the page level
 * anyway (account/auth, booking outcomes, admin, internal + Stripe API routes)
 * so crawlers never waste budget on them. Absolute `Sitemap:` URL from the
 * canonical site origin.
 */
const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/account",
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/verify-email",
        "/search",
        "/booking/",
        "/admin",
        "/api/",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
