import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import { getPageContent } from "@/i18n/pages";

export const metadata: Metadata = {
  title: "Press & Media | Ptah Tours",
  description:
    "Media resources and press contact for Ptah Tours — a Cairo-based team building private and small-group journeys across Egypt. Request our media kit or get in touch for interviews and imagery.",
  alternates: { canonical: "/press" },
};

export default async function PressPage() {
  const pc = await getPageContent();
  const t = pc.press;
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
        <h2 className="text-section-h2 font-bold text-ink">{t.factsHeading}</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {t.facts.map((f) => (
            <div key={f.label} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-rust">{f.label}</p>
              <p className="mt-1 text-trip-h3 font-semibold text-ink">{f.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">{t.kitHeading}</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {t.kit.map((k) => (
            <div key={k.title}>
              <h3 className="text-trip-h3 font-semibold text-ink">{k.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{k.body}</p>
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
