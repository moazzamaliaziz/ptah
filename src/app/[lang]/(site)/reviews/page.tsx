import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import { getPageContent } from "@/i18n/pages";

export const metadata: Metadata = {
  title: "Reviews & Accreditations | Ptah Tours",
  description:
    "What travelers say about their Ptah Tours journeys, and the industry bodies we work with. Licensed guiding, honest pricing, and trips built by a team who calls Egypt home.",
  alternates: { canonical: "/reviews" },
};

export default async function ReviewsPage() {
  const pc = await getPageContent();
  const t = pc.reviews;
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: pc.common.home, href: "/" }, { label: t.breadcrumb }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">{t.eyebrow}</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">{t.title}</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">
          {t.intro}
        </p>
      </header>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">{t.testimonialsHeading}</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.testimonials.map((review) => (
            <figure key={review.attribution} className="flex flex-col rounded-xl border border-grey-300/60 bg-white p-6">
              <blockquote className="text-meta leading-relaxed text-ink/75">&ldquo;{review.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-meta font-semibold text-ink/60">— {review.attribution}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">{t.accreditationsHeading}</h2>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {t.accreditations.map((a) => (
            <div key={a.name} className="rounded-xl border border-grey-300/60 bg-white p-6 text-center">
              <p className="text-trip-h3 font-bold text-ink">{a.name}</p>
              <p className="mt-1 text-meta text-ink/60">{a.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl bg-nile px-8 py-12 text-center">
        <h2 className="text-section-h2 font-bold text-white">{t.ctaHeading}</h2>
        <p className="mx-auto mt-3 max-w-xl text-body text-white/75">
          {t.ctaBody}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/contact" variant="primary" className="bg-white !text-nile hover:bg-white/90">
            {t.ctaPrimary}
          </Button>
          <Button href="/tours" variant="ghost-light">
            {t.ctaSecondary}
          </Button>
        </div>
      </section>
    </Container>
  );
}
