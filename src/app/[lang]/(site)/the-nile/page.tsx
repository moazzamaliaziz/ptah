import type { Metadata } from "next";
import ThemeHub from "@/components/site/ThemeHub";
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

export default async function TheNilePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = toLocale(lang);
  // Curated by the great Nile-side destinations — Luxor and Aswan — rather than
  // a single "cruise" tag, so the hub reflects the real river-focused catalog.
  const [tours, user, pc] = await Promise.all([
    listPublishedToursForDestinations(["luxor", "aswan"], locale),
    getSessionUser(),
    getPageContent(locale),
  ]);
  const t = pc.theNile;

  return (
    <ThemeHub
      title={t.title}
      eyebrow={t.eyebrow}
      lede={t.lede}
      intro={t.intro}
      heroImage="/assets/stories/nile-sailing-aswan.webp"
      heroAlt={t.heroAlt}
      tours={tours}
      isAuthenticated={user !== null}
      toursHref="/tours"
    />
  );
}
