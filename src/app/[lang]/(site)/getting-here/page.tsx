import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import { getPageContent } from "@/i18n/pages";

export const metadata: Metadata = {
  title: "Flying Into Egypt | Ptah Tours",
  description:
    "Getting to Egypt: the main international gateways at Cairo, Luxor, Hurghada, Sharm El Sheikh, and Aswan — plus what to expect on arrival and how we handle transfers.",
  alternates: { canonical: "/getting-here" },
};

export default async function GettingHerePage() {
  const pc = await getPageContent();
  const t = pc.gettingHere;
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: pc.common.home, href: "/" }, { label: t.breadcrumb }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">{t.eyebrow}</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">{t.title}</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">{t.lede}</p>
      </header>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">{t.gatewaysHeading}</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {t.gateways.map((g) => (
            <div key={g.title} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <h3 className="text-trip-h3 font-semibold text-ink">{g.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{g.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="arrivals" className="mt-16 scroll-mt-24">
        <h2 className="text-section-h2 font-bold text-ink">{t.arrivalsHeading}</h2>
        <p className="mt-4 max-w-2xl text-body leading-relaxed text-ink/70">
          {t.arrivalsIntro}
        </p>

        <div className="mt-8 space-y-8">
          <div>
            <h3 className="text-card-title font-bold text-ink">{t.meetHeading}</h3>
            <p className="mt-3 text-body leading-relaxed text-ink/75">
              {t.meetBody}
            </p>
          </div>

          <div>
            <h3 className="text-card-title font-bold text-ink">{t.immigrationHeading}</h3>
            <p className="mt-3 text-body leading-relaxed text-ink/75">
              {t.immigrationBody}
            </p>
          </div>

          <div>
            <h3 className="text-card-title font-bold text-ink">{t.currencyHeading}</h3>
            <p className="mt-3 text-body leading-relaxed text-ink/75">
              {t.currencyBody}
            </p>
          </div>

          <div>
            <h3 className="text-card-title font-bold text-ink">{t.transfersHeading}</h3>
            <p className="mt-3 text-body leading-relaxed text-ink/75">
              {t.transfersBody}
            </p>
          </div>
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
