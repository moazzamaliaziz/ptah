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
  title: "Red Sea Diving & Snorkeling Tours | Ptah Tours",
  description:
    "Warm water, walls of coral, and reef fish by the thousand — the Red Sea off Hurghada and Sharm El Sheikh is world-class year-round. Our snorkeling and diving tours, with licensed dive guides.",
  alternates: { canonical: "/red-sea" },
};

const THEME = "red-sea" as const;

export default async function RedSeaPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = toLocale(lang);
  const [tours, user, pc] = await Promise.all([
    listPublishedTours({ tag: "red-sea" }, locale),
    getSessionUser(),
    getPageContent(locale),
  ]);
  const t = pc.redSea;
  const c = themeContent[THEME];
  const hero = themeImage(THEME, "dahab-paradise");

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
      toursHref="/tours?type=red-sea"
      footer={<ImageCredits images={themeMedia[THEME]} summary={c.creditsSummary} />}
    >
      <FactStrip facts={c.facts} />
      {c.timeline ? <Timeline head={c.timeline.head} entries={c.timeline.entries} /> : null}
      <FeatureRows theme={THEME} head={c.features.head} rows={c.features.rows} />
      {c.places ? <PlaceCards theme={THEME} head={c.places.head} cards={c.places.cards} /> : null}
      <ThemeGallery head={c.gallery} images={themeMedia[THEME]} labels={galleryLabels} />
    </ThemeHub>
  );
}
