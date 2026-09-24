import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import { getPageContent } from "@/i18n/pages";

export const metadata: Metadata = {
  title: "Getting Around Egypt | Ptah Tours",
  description:
    "How to get around Egypt: domestic flights, sleeper trains, private drivers, Nile boats, and ride-hailing — and what Ptah Tours handles for you versus useful independent-travel tips.",
  alternates: { canonical: "/getting-around" },
};

export default async function GettingAroundPage() {
  const pc = await getPageContent();
  const t = pc.gettingAround;
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: pc.common.home, href: "/" }, { label: t.breadcrumb }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">{t.eyebrow}</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">{t.title}</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">{t.lede}</p>
      </header>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">{t.modesHeading}</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {t.modes.map((m) => (
            <div key={m.title} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <h3 className="text-trip-h3 font-semibold text-ink">{m.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{m.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 space-y-8">
        <div>
          <h2 className="text-card-title font-bold text-ink">{t.handleHeading}</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            {t.handleBody}
          </p>
        </div>

        <div>
          <h2 className="text-card-title font-bold text-ink">{t.independentHeading}</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            {t.independentBody}
          </p>
        </div>

        <div>
          <h2 className="text-card-title font-bold text-ink">{t.mixHeading}</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            {t.mixBody}
          </p>
        </div>
      </section>

      <section className="mt-16 rounded-2xl bg-nile px-8 py-12 text-center">
        <h2 className="text-section-h2 font-bold text-white">{t.ctaHeading}</h2>
        <p className="mx-auto mt-3 max-w-xl text-body text-white/75">
          {t.ctaBody}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/tours" variant="primary" className="bg-white !text-nile hover:bg-white/90">
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
