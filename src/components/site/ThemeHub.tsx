import Image from "next/image";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import TourCard from "@/components/commerce/TourCard";
import type { TourListItem } from "@/server/catalog";
import { getPageContent } from "@/i18n/pages";

export interface ThemeHubProps {
  /** Breadcrumb + H1 label, e.g. "Heritage & History". */
  title: string;
  /** Small eyebrow above the title, e.g. "Explore by theme". */
  eyebrow: string;
  /** One-line lede under the title. */
  lede: string;
  /** Longer editorial intro paragraphs (rendered in order). */
  intro: string[];
  /** Hero image path under /public, or null for a plain band. */
  heroImage: string | null;
  /** Alt text for the hero image. */
  heroAlt: string;
  /** Curated, already-fetched published tours for this theme. */
  tours: TourListItem[];
  /** Whether the viewer is signed in (drives the wishlist toggle). */
  isAuthenticated: boolean;
  /** Label for the empty-state / "see all" link target. */
  toursHref: string;
}

/**
 * Editorial theme hub (heritage / the-nile / deserts / red-sea). Presentational:
 * takes an editorial brief plus an already-fetched tour list and renders the
 * shared hero → intro → curated-grid → CTA layout. Data fetching lives in each
 * thin route file so this component stays reusable and testable.
 */
export default async function ThemeHub({
  title,
  eyebrow,
  lede,
  intro,
  heroImage,
  heroAlt,
  tours,
  isAuthenticated,
  toursHref,
}: ThemeHubProps) {
  const pc = await getPageContent();
  const t = pc.themeHub;
  return (
    <Container className="py-10">
      <Breadcrumbs items={[{ label: pc.common.home, href: "/" }, { label: title }]} />

      <div className="relative mt-5 aspect-[16/7] w-full overflow-hidden rounded-2xl bg-papyrus">
        {heroImage ? (
          <Image src={heroImage} alt={heroAlt} fill priority sizes="(min-width: 1180px) 1100px, 100vw" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-nile/40">{t.heroFallback}</div>
        )}
      </div>

      {/* Editorial intro */}
      <div className="mx-auto mt-8 max-w-3xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">{eyebrow}</p>
        <h1 className="mt-2 text-section-h2 font-bold leading-tight text-ink">{title}</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/75">{lede}</p>
        <div className="mt-4 space-y-4 text-body leading-relaxed text-ink/75">
          {intro.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>
      </div>

      {/* Curated tours */}
      <section className="mt-14">
        <h2 className="text-section-h2 font-bold text-ink">{t.toursHeading}</h2>
        {tours.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((tour) => (
              <TourCard key={tour.slug} tour={tour} isAuthenticated={isAuthenticated} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-grey-300/60 bg-papyrus/50 p-8 text-center">
            <p className="text-body text-ink/70">
              {t.emptyPre}{" "}
              <Link href="/contact" className="font-semibold text-rust hover:underline">{t.emptyLink}</Link>{" "}
              {t.emptyPost}
            </p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="mx-auto mt-14 max-w-3xl rounded-2xl border border-grey-300/60 bg-papyrus/40 p-6 text-center">
        <h2 className="text-card-title font-bold text-ink">{t.ctaHeading}</h2>
        <p className="mx-auto mt-2 max-w-lg text-meta text-ink/65">
          {t.ctaBody}
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button href="/contact" variant="primary">{t.ctaPrimary}</Button>
          <Button href={toursHref} variant="secondary">{t.ctaSecondary}</Button>
        </div>
      </section>
    </Container>
  );
}
