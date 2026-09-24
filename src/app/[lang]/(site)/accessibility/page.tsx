import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import { getPageContent } from "@/i18n/pages";

export const metadata: Metadata = {
  title: "Accessibility | Ptah Tours",
  description:
    "Our commitment to an accessible website and accessible travel in Egypt. How we build this site, how to tell us about access needs, and how we tailor trips for mobility, mobility aids, and more.",
  alternates: { canonical: "/accessibility" },
};

export default async function AccessibilityPage() {
  const pc = await getPageContent();
  const t = pc.accessibility;
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: pc.common.home, href: "/" }, { label: t.breadcrumb }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">{t.eyebrow}</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">{t.title}</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">{t.lede}</p>
      </header>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">{t.websiteHeading}</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {t.website.map((w) => (
            <div key={w.title} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <h3 className="text-trip-h3 font-semibold text-ink">{w.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">{t.tripsHeading}</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {t.trips.map((tr) => (
            <div key={tr.title} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <h3 className="text-trip-h3 font-semibold text-ink">{tr.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{tr.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-xl border border-grey-300/60 bg-papyrus/50 p-6">
        <h2 className="text-card-title font-bold text-ink">{t.feedbackHeading}</h2>
        <p className="mt-3 text-meta leading-relaxed text-ink/70">
          {t.feedbackBody}
        </p>
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
