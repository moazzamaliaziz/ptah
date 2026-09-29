import type { Metadata } from "next";
import ThemeHub from "@/components/site/ThemeHub";
import FactStrip from "@/components/site/theme/FactStrip";
import Timeline from "@/components/site/theme/Timeline";
import FeatureRows from "@/components/site/theme/FeatureRows";
import PlaceCards from "@/components/site/theme/PlaceCards";
import { ThemeGallery } from "@/components/site/theme/ThemeGallery";
import ImageCredits from "@/components/site/theme/ImageCredits";
import { themeContent, galleryLabels } from "@/content/theme-content";
import { themeMedia, themeImage } from "@/content/theme-media";
import { listPublishedTours } from "@/server/catalog";
import { getSessionUser } from "@/server/auth/session";
import { toLocale } from "@/i18n/config";
import { getPageContent } from "@/i18n/pages";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Desert Tours & Safaris in Egypt | Ptah Tours",
  description:
    "Egypt beyond the Nile — desert safaris, star-filled nights, and the mountain monastery of St Catherine in the Sinai. Our desert tours, led by guides who know the sands.",
  alternates: { canonical: "/deserts" },
};

const THEME = "deserts" as const;

export default async function DesertsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = toLocale(lang);
  const [tours, user, pc] = await Promise.all([
    listPublishedTours({ tag: "desert" }, locale),
    getSessionUser(),
    getPageContent(locale),
  ]);
  const t = pc.deserts;
  const c = themeContent[THEME];
  const hero = themeImage(THEME, "white-desert-alien-landscape");

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
      toursHref="/tours?type=desert"
      footer={<ImageCredits images={themeMedia[THEME]} summary={c.creditsSummary} />}
    >
      <FactStrip facts={c.facts} />
      {c.timeline ? <Timeline head={c.timeline.head} entries={c.timeline.entries} /> : null}
      <FeatureRows resolveImage={(s) => themeImage(THEME, s)} head={c.features.head} rows={c.features.rows} />
      {c.places ? <PlaceCards resolveImage={(s) => themeImage(THEME, s)} head={c.places.head} cards={c.places.cards} /> : null}
      <ThemeGallery head={c.gallery} images={themeMedia[THEME]} labels={galleryLabels} />
    </ThemeHub>
  );
}
