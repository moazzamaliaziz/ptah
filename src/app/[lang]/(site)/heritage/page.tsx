import type { Metadata } from "next";
import ThemeHub from "@/components/site/ThemeHub";
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

export default async function HeritagePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = toLocale(lang);
  const [tours, user, pc] = await Promise.all([
    listPublishedTours({ tag: "classic" }, locale),
    getSessionUser(),
    getPageContent(locale),
  ]);
  const t = pc.heritage;

  return (
    <ThemeHub
      title={t.title}
      eyebrow={t.eyebrow}
      lede={t.lede}
      intro={t.intro}
      heroImage="/assets/itineraries/valley-of-kings.webp"
      heroAlt={t.heroAlt}
      tours={tours}
      isAuthenticated={user !== null}
      toursHref="/tours?type=classic"
    />
  );
}
