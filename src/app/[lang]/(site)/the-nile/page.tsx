import type { Metadata } from "next";
import ThemeHub from "@/components/site/ThemeHub";
import FactStrip from "@/components/site/theme/FactStrip";
import Timeline from "@/components/site/theme/Timeline";
import FeatureRows from "@/components/site/theme/FeatureRows";
import PlaceCards from "@/components/site/theme/PlaceCards";
import { ThemeGallery } from "@/components/site/theme/ThemeGallery";
import ImageCredits from "@/components/site/theme/ImageCredits";
import { getThemeEditorial } from "@/content/localized/theme-content";
import { getImageAltOverlay, localizeImage, localizeImages } from "@/content/localized/image-alt";
import { themeMedia, themeImage } from "@/content/theme-media";
import { listPublishedToursForDestinations } from "@/server/catalog";
import { getSessionUser } from "@/server/auth/session";
import { toLocale } from "@/i18n/config";
import { getPageContent } from "@/i18n/pages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Nile: Luxor, Aswan & the River | Ptah Tours",
  description:
    "The river that made Egypt — the temples of Luxor and Karnak, the islands of Aswan, and slow felucca afternoons under sail. Our tours along the Nile, guided by people who grew up beside it.",
  alternates: { canonical: "/the-nile" },
};

const THEME = "the-nile" as const;

export default async function TheNilePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = toLocale(lang);
  // Curated by the great Nile-side destinations — Luxor and Aswan — rather than
  // a single "cruise" tag, so the hub reflects the real river-focused catalog.
  const [tours, user, pc, theme, altOverlay] = await Promise.all([
    listPublishedToursForDestinations(["luxor", "aswan"], locale),
    getSessionUser(),
    getPageContent(locale),
    getThemeEditorial(locale),
    getImageAltOverlay(locale),
  ]);
  const t = pc.theNile;
  const c = theme.themeContent[THEME];
  const hero = localizeImage(themeImage(THEME, "aswan-feluccas"), altOverlay);

  return (
    <ThemeHub
      title={t.title}
      eyebrow={t.eyebrow}
      lede={t.lede}
      intro={t.intro}
      heroImage={hero.src}
      heroAlt={hero.alt}
      tours={tours}
      isAuthenticated={user !== null}
      toursHref="/tours"
      footer={<ImageCredits images={themeMedia[THEME]} summary={c.creditsSummary} />}
    >
      <FactStrip facts={c.facts} />
      {c.timeline ? <Timeline head={c.timeline.head} entries={c.timeline.entries} /> : null}
      <FeatureRows resolveImage={(s) => localizeImage(themeImage(THEME, s), altOverlay)} head={c.features.head} rows={c.features.rows} />
      {c.places ? <PlaceCards resolveImage={(s) => localizeImage(themeImage(THEME, s), altOverlay)} head={c.places.head} cards={c.places.cards} /> : null}
      <ThemeGallery head={c.gallery} images={localizeImages(themeMedia[THEME], altOverlay)} labels={theme.galleryLabels} />
    </ThemeHub>
  );
}
