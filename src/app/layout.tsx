import type { Metadata, Viewport } from "next";
import { Cabin } from "next/font/google";
import { getSettings } from "@/server/settings";
import "./globals.css";

/* Cabin variable font, weights 400-700 incl. italics (design.md §1.2.1).
   display: block is the reference choice; §8.4 I-2 sanctions `swap` if FOIT
   becomes an issue. */
const cabin = Cabin({
  weight: "variable",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-cabin",
  display: "block",
  fallback: ["Arial", "Helvetica", "sans-serif"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ptahtours.com";

/**
 * Document metadata (Phase 7 S3): DB-driven. Site name/tagline, favicon and the
 * default OG image come from SiteSetting via getSettings() (fallback to the
 * built-in values when unset). A set favicon overrides the physical
 * src/app/favicon.ico. getSettings() never throws (returns defaults on DB
 * error), so metadata resolution stays safe even at build time.
 */
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const name = s["branding.siteName"];
  const tagline = s["branding.tagline"];
  const titleDefault = `${name} — ${tagline}`;
  const description =
    "Private and small-group journeys across Egypt — pyramids at dawn, Nile cruises, Red Sea reefs — designed end to end by the Cairo team.";

  const ogImageId = s["seo.ogImageMediaId"];
  const ogImage = ogImageId
    ? { url: `/api/media/${ogImageId}`, alt: name }
    : {
        url: "/assets/hero/hero-giza.webp",
        width: 1600,
        height: 1000,
        alt: "The Great Pyramid of Khufu and the Sphinx at Giza in warm morning light.",
      };

  const faviconId = s["branding.faviconMediaId"];

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: titleDefault,
      template: `%s · ${name}`,
    },
    description,
    ...(faviconId ? { icons: { icon: `/api/media/${faviconId}`, shortcut: `/api/media/${faviconId}` } } : {}),
    openGraph: {
      siteName: name,
      type: "website",
      locale: "en_US",
      url: siteUrl,
      title: titleDefault,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      site: "@ptahtours",
      title: titleDefault,
      description,
      images: [ogImage.url],
    },
    robots: { index: true, follow: true },
  };
}

export async function generateViewport(): Promise<Viewport> {
  const s = await getSettings();
  return {
    width: "device-width",
    initialScale: 1,
    /* Brand primary dark ("nile") by default — DB-overridable (seo.themeColor). */
    themeColor: s["seo.themeColor"],
  };
}

/* Minimal root: <html>/<body> + fonts + globals only. The public-site chrome
   (header, footer, cookie banner, skip link, no-JS fallback) lives in the
   (site) route-group layout so the /admin area can render without it. */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cabin.variable}>
      <body>{children}</body>
    </html>
  );
}
