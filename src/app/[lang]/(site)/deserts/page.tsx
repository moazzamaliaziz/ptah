import type { Metadata } from "next";
import ThemeHub from "@/components/site/ThemeHub";
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

  return (
    <ThemeHub
      title={t.title}
      eyebrow={t.eyebrow}
      lede={t.lede}
      intro={t.intro}
      heroImage="/assets/activities/desert-safari.webp"
      heroAlt={t.heroAlt}
      tours={tours}
      isAuthenticated={user !== null}
      toursHref="/tours?type=desert"
    />
  );
}
