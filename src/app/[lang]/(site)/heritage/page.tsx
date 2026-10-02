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
import { listPublishedTours } from "@/server/catalog";
import { getSessionUser } from "@/server/auth/session";
import { toLocale } from "@/i18n/config";
import { getPageContent } from "@/i18n/pages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Heritage & History Tours in Egypt | Ptah Tours",
  description:
    "Egypt's greatest monuments, read by licensed Egyptologists — the pyramids of Giza, the temples of Luxor and Karnak, the tombs of the Valley of the Kings. Our heritage and history tours.",
  alternates: { canonical: "/heritage" },
};

const THEME = "heritage" as const;

export default async function HeritagePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = toLocale(lang);
  const [tours, user, pc, theme, altOverlay] = await Promise.all([
    listPublishedTours({ tag: "classic" }, locale),
    getSessionUser(),
    getPageContent(locale),
    getThemeEditorial(locale),
    getImageAltOverlay(locale),
  ]);
  const t = pc.heritage;
  const c = theme.themeContent[THEME];
  const hero = localizeImage(themeImage(THEME, "giza-pyramids"), altOverlay);

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
      toursHref="/tours?type=classic"
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
