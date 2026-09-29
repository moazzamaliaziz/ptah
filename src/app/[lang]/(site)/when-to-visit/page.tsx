import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import FactStrip from "@/components/site/theme/FactStrip";
import ClimateWidget from "@/components/site/theme/ClimateWidget";
import FeatureRows from "@/components/site/theme/FeatureRows";
import { ThemeGallery } from "@/components/site/theme/ThemeGallery";
import ImageCredits from "@/components/site/theme/ImageCredits";
import { whenToVisitContent as wtv, galleryLabels } from "@/content/theme-content";
import { themeMedia, themeImage } from "@/content/theme-media";
import { getPageContent } from "@/i18n/pages";

const THEME = "when-to-visit" as const;

export const metadata: Metadata = {
  title: "Best Time to Visit Egypt | Ptah Tours",
  description:
    "When to visit Egypt: a season-by-season guide to weather, crowds, and cost across Cairo, Luxor, Aswan, and the Red Sea — so you can pick the right time to travel.",
  alternates: { canonical: "/when-to-visit" },
};

export default async function WhenToVisitPage() {
  const pc = await getPageContent();
  const t = pc.whenToVisit;
  const hero = themeImage(THEME, "luxor-nile-sunset");
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: pc.common.home, href: "/" }, { label: t.breadcrumb }]} />

      <div className="relative mt-6 aspect-[16/7] w-full overflow-hidden rounded-2xl bg-papyrus">
        <Image src={hero.src} alt={hero.alt} fill priority sizes="(min-width: 1180px) 1100px, 100vw" className="object-cover" />
      </div>

      <header className="mt-8 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">{t.eyebrow}</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">{t.title}</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">{t.lede}</p>
      </header>

      <div className="mt-12">
        <FactStrip facts={wtv.facts} />
      </div>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">{t.seasonsHeading}</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {t.seasons.map((s) => (
            <div key={s.title} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <h3 className="text-trip-h3 font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-16">
        <ClimateWidget climate={wtv.climate} />
      </div>

      <section className="mt-16 space-y-8">
        <div>
          <h2 className="text-card-title font-bold text-ink">{t.heatHeading}</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">{t.heatBody}</p>
        </div>
        <div>
          <h2 className="text-card-title font-bold text-ink">{t.redSeaHeading}</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">{t.redSeaBody}</p>
        </div>
        <div>
          <h2 className="text-card-title font-bold text-ink">{t.ramadanHeading}</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">{t.ramadanBody}</p>
        </div>
      </section>

      <div className="mt-16">
        <FeatureRows resolveImage={(s) => themeImage(THEME, s)} head={wtv.regions.head} rows={wtv.regions.rows} />
      </div>

      <div className="mt-16">
        <ThemeGallery head={wtv.gallery} images={themeMedia[THEME]} labels={galleryLabels} />
      </div>

      <section className="mt-16 rounded-2xl bg-nile px-8 py-12 text-center">
        <h2 className="text-section-h2 font-bold text-white">{t.ctaHeading}</h2>
        <p className="mx-auto mt-3 max-w-xl text-body text-white/75">{t.ctaBody}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/tours" variant="primary" className="bg-white !text-nile hover:bg-white/90">
            {t.ctaPrimary}
          </Button>
          <Button href="/contact" variant="ghost-light">
            {t.ctaSecondary}
          </Button>
        </div>
      </section>

      <div className="mt-10">
        <ImageCredits images={themeMedia[THEME]} summary={wtv.creditsSummary} />
      </div>
    </Container>
  );
}
