import type { Metadata } from "next";
import ThemeHub from "@/components/site/ThemeHub";
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

  return (
    <ThemeHub
      title={t.title}
      eyebrow={t.eyebrow}
      lede={t.lede}
      intro={t.intro}
      heroImage="/assets/activities/boat-snorkeling.webp"
      heroAlt={t.heroAlt}
      tours={tours}
      isAuthenticated={user !== null}
      toursHref="/tours?type=red-sea"
    />
  );
}
