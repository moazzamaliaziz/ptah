import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import { getPageContent } from "@/i18n/pages";

export const metadata: Metadata = {
  title: "About Ptah Tours | Egypt, curated by the people who call it home",
  description:
    "Ptah Tours is a Cairo-based team of Egyptologists, guides, and trip designers building private and small-group journeys across Egypt. Meet the people and the promises behind every itinerary.",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const pc = await getPageContent();
  const t = pc.about;
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: pc.common.home, href: "/" }, { label: t.breadcrumb }]} />

      {/* Intro */}
      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">{t.eyebrow}</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">{t.title}</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">
          {t.intro}
        </p>
      </header>

      {/* Founding story */}
      <section className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h2 className="text-card-title font-bold text-ink">{t.storyHeading}</h2>
        </div>
        <div className="lg:col-span-2 space-y-4 text-body leading-relaxed text-ink/75">
          <p>{t.storyParagraphs[0]}</p>
          <p>{t.storyParagraphs[1]}</p>
          <p>{t.storyParagraphs[2]}</p>
        </div>
      </section>

      {/* Promises */}
      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">{t.promisesHeading}</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {t.promises.map((p) => (
            <div key={p.title} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <h3 className="text-trip-h3 font-semibold text-ink">{p.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
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

      {/* Team */}
      <section id="team" className="mt-16 scroll-mt-24">
        <h2 className="text-section-h2 font-bold text-ink">{t.teamHeading}</h2>
        <p className="mt-3 max-w-2xl text-body leading-relaxed text-ink/70">
          {t.teamIntro}
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {t.team.map((member) => (
            <div key={member.title} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <h3 className="text-trip-h3 font-semibold text-ink">{member.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{member.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Accreditation */}
      <section id="accreditation" className="mt-16 scroll-mt-24">
        <h2 className="text-section-h2 font-bold text-ink">{t.accreditationsHeading}</h2>
        <p className="mt-3 max-w-2xl text-body leading-relaxed text-ink/70">
          {t.accreditationsIntro}
        </p>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {t.accreditations.map((a) => (
            <div key={a.name} className="rounded-xl border border-grey-300/60 bg-white p-6 text-center">
              <p className="text-trip-h3 font-bold text-ink">{a.name}</p>
              <p className="mt-1 text-meta text-ink/60">{a.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-meta text-ink/45">
          {t.accreditationsNote}
        </p>
      </section>

      {/* CTA */}
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
