import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import { getPageContent } from "@/i18n/pages";

export const metadata: Metadata = {
  title: "Egypt Visa & Entry Guidance | Ptah Tours",
  description:
    "General guidance on entering Egypt — the e-Visa portal, visa on arrival, and passport validity. Always confirm current rules with official Egyptian sources before you travel.",
  alternates: { canonical: "/visa" },
};

const OFFICIAL_PORTAL = "https://visa2egypt.gov.eg";

export default async function VisaPage() {
  const pc = await getPageContent();
  const t = pc.visa;
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: pc.common.home, href: "/" }, { label: t.breadcrumb }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">{t.eyebrow}</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">{t.title}</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">
          {t.lede}
        </p>
      </header>

      {/* Disclaimer block */}
      <section className="mt-10 rounded-xl border border-grey-300/60 bg-papyrus/40 p-6">
        <h2 className="text-card-title font-bold text-ink">{t.disclaimerHeading}</h2>
        <p className="mt-3 text-body leading-relaxed text-ink/75">
          {t.disclaimerBody}
        </p>
      </section>

      <section className="mt-14 space-y-8">
        <div>
          <h2 className="text-card-title font-bold text-ink">{t.portalHeading}</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            {t.portalPre}{" "}
            <a
              href={OFFICIAL_PORTAL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-rust"
            >
              {t.portalLink}
            </a>{" "}
            {t.portalPost}
          </p>
        </div>

        <div>
          <h2 className="text-card-title font-bold text-ink">{t.arrivalHeading}</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            {t.arrivalPre}{" "}
            <a
              href={OFFICIAL_PORTAL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-rust"
            >
              {t.arrivalLink}
            </a>{" "}
            {t.arrivalPost}
          </p>
        </div>

        <div>
          <h2 className="text-card-title font-bold text-ink">{t.validityHeading}</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            {t.validityBody}
          </p>
        </div>

        <div>
          <h2 className="text-card-title font-bold text-ink">{t.zonesHeading}</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            {t.zonesBody}
          </p>
        </div>

        <div>
          <h2 className="text-card-title font-bold text-ink">{t.confirmHeading}</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            {t.confirmPre}{" "}
            <a
              href={OFFICIAL_PORTAL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-rust"
            >
              {t.confirmLink}
            </a>{" "}
            {t.confirmPost}
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
