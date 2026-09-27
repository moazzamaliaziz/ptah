import type { JSX } from "react";
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { galleryPhotos } from "@/content/gallery";
import { getPageContent } from "@/i18n/pages";

export const metadata: Metadata = {
  title: "Photo Gallery | Real Ptah Tours travelers across Egypt",
  description:
    "Real photographs from recent Ptah Tours journeys — our travelers and their guides at the temples, deserts and Nile villages of Egypt. No stock imagery.",
  alternates: { canonical: "/gallery" },
};

/**
 * /gallery — the full masonry photo gallery (design brainstorm: real-customer
 * trip photography). Server shell (breadcrumb + intro header) wrapping the
 * client GalleryGrid island, which owns the category filter + accessible
 * lightbox. Photos come straight from the static gallery content module; only
 * the surrounding copy + control labels are localized via getPageContent().
 */
export default async function GalleryPage(): Promise<JSX.Element> {
  const pc = await getPageContent();
  const t = pc.gallery;
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: pc.common.home, href: "/" }, { label: t.breadcrumb }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">{t.eyebrow}</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">{t.title}</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">{t.intro}</p>
      </header>

      <div className="mt-10">
        <GalleryGrid photos={galleryPhotos} labels={t.grid} />
      </div>
    </Container>
  );
}
