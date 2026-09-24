import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import { getPageContent } from "@/i18n/pages";

export const metadata: Metadata = {
  title: "Careers at Ptah Tours | Work in Egyptian Travel",
  description:
    "Join a Cairo-based team building thoughtful journeys across Egypt. The kinds of roles we hire for — guiding, trip design, and support — and how to introduce yourself.",
  alternates: { canonical: "/careers" },
};

export default async function CareersPage() {
  const pc = await getPageContent();
  const t = pc.careers;
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
        <h2 className="text-section-h2 font-bold text-ink">{t.rolesHeading}</h2>
        <p className="mt-3 max-w-2xl text-meta text-ink/60">
          {t.rolesIntro}
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {t.roles.map((r) => (
            <div key={r.title} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <h3 className="text-trip-h3 font-semibold text-ink">{r.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">{t.valuesHeading}</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {t.values.map((v) => (
            <div key={v.title}>
              <h3 className="text-trip-h3 font-semibold text-ink">{v.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{v.body}</p>
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
          <Button href="/about" variant="ghost-light">
            {t.ctaSecondary}
          </Button>
        </div>
      </section>
    </Container>
  );
}
