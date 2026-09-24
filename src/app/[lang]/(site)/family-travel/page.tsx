import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import { getPageContent } from "@/i18n/pages";

export const metadata: Metadata = {
  title: "Family Travel in Egypt | Ptah Tours",
  description:
    "Egypt is a wonderful place to travel with children — pyramids, camel rides, felucca sails, and Red Sea reefs. How we design family-friendly trips: pacing, private guides, and kid-approved highlights.",
  alternates: { canonical: "/family-travel" },
};

export default async function FamilyTravelPage() {
  const pc = await getPageContent();
  const t = pc.familyTravel;
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: pc.common.home, href: "/" }, { label: t.breadcrumb }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">{t.eyebrow}</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">{t.title}</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">{t.lede}</p>
      </header>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">{t.whyHeading}</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {t.why.map((w) => (
            <div key={w.title}>
              <h3 className="text-trip-h3 font-semibold text-ink">{w.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">{t.howHeading}</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {t.how.map((h) => (
            <div key={h.title} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <h3 className="text-trip-h3 font-semibold text-ink">{h.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{h.body}</p>
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
          <Button href="/tours?type=family" variant="primary" className="bg-white !text-nile hover:bg-white/90">
            {t.ctaPrimary}
          </Button>
          <Button href="/contact" variant="ghost-light">
            {t.ctaSecondary}
          </Button>
        </div>
      </section>
    </Container>
  );
}
