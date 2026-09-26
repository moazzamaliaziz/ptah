import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { getSettings } from "@/server/settings";
import { cabin, notoArabic } from "@/lib/fonts";
import { dir, isLocale, localeHtmlLang, localeOgLocale, locales } from "@/i18n/config";
import { getPwaStrings } from "@/i18n/pwa";
import ServiceWorkerManager from "@/components/pwa/ServiceWorkerManager";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import "../globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ptahtours.com";

/* The public site is served for every supported locale. Enumerating them here
   lets Next know the valid `lang` segments; unknown locales fall through to the
   notFound() guard in the layout below. */
export function generateStaticParams(): Array<{ lang: string }> {
  return locales.map((lang) => ({ lang }));
}

/**
 * Document metadata (Phase 7 S3): DB-driven. Site name/tagline, favicon and the
 * default OG image come from SiteSetting via getSettings() (fallback to the
 * built-in values when unset). A set favicon overrides the physical
 * src/app/favicon.ico. getSettings() never throws (returns defaults on DB
 * error), so metadata resolution stays safe even at build time.
 *
 * i18n (Phase 3): og:locale is now per-locale. Copy strings stay English until
 * the dictionary layer lands; only the locale tag varies here for now.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "en";
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
      // Pages already suffix their own brand ("Tours | Ptah Tours"), so the
      // template must NOT re-append it. Pass the page title through verbatim.
      template: "%s",
    },
    description,
    icons: {
      ...(faviconId ? { icon: `/api/media/${faviconId}`, shortcut: `/api/media/${faviconId}` } : {}),
      // Always-on apple-touch icon (opaque 180×180) for iOS "Add to Home Screen".
      apple: "/icons/apple-touch-180.png",
    },
    // PWA (spec §3): the <link rel="manifest"> is auto-injected by app/manifest.ts.
    // appleWebApp gives installed iOS users the standalone display + branded title bar.
    appleWebApp: { capable: true, title: name, statusBarStyle: "default" },
    openGraph: {
      siteName: name,
      type: "website",
      locale: localeOgLocale[locale],
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

/* Public root layout (Phase 3): lives under [lang] so <html lang/dir> reflects
   the active locale (Arabic → dir="rtl"). Renders <html>/<body> + fonts +
   globals only; the public-site chrome (header, footer, cookie banner, skip
   link, no-JS fallback) lives in the (site) route-group layout nested below so
   the /admin area — its own root layout now — renders without it. */
export default async function LocaleRootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  // The Arabic face is loaded (its --font-arabic variable applied) only for the
  // ar locale; every other locale ships Cabin alone. globals.css prefers
  // --font-arabic under dir="rtl".
  const fontClass = lang === "ar" ? `${cabin.variable} ${notoArabic.variable}` : cabin.variable;
  const pwa = getPwaStrings(lang);
  return (
    <html lang={localeHtmlLang[lang]} dir={dir(lang)} className={fontClass}>
      <body>
        {children}
        {/* PWA (spec §3, D3): update toast + custom install prompt. Client-only,
            production-only registration; each renders null until relevant. */}
        <ServiceWorkerManager strings={pwa.update} />
        <InstallPrompt strings={pwa.install} />
      </body>
    </html>
  );
}
