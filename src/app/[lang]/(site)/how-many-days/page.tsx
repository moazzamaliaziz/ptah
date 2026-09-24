import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import { getPageContent } from "@/i18n/pages";

export const metadata: Metadata = {
  title: "How Many Days in Egypt? | Ptah Tours",
  description:
    "How many days do you need in Egypt? A practical guide to trip length — from a 3-day Cairo taster to a two-week grand tour of the Nile, Red Sea, and beyond.",
  alternates: { canonical: "/how-many-days" },
};

// Filter links for the trip-length cards, index-aligned with `howManyDays.durations`.
const DURATION_HREFS = ["/tours?length=short", "/tours?length=week", "/tours?length=grand", "/tours?length=grand"];

export default async function HowManyDaysPage() {
  const pc = await getPageContent();
  const t = pc.howManyDays;
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: pc.common.home, href: "/" }, { label: t.breadcrumb }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">{t.eyebrow}</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">{t.title}</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">{t.lede}</p>
      </header>

      <section className="mt-14 space-y-8">
        <div>
          <h2 className="text-card-title font-bold text-ink">{t.oneDayHeading}</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            {t.oneDayPre}{" "}
            <Link href="/tours?length=day" className="font-semibold text-rust">
              {t.oneDayLink}
            </Link>{" "}
            {t.oneDayPost}
          </p>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">{t.guideHeading}</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {t.durations.map((d, i) => (
            <div key={d.title} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <h3 className="text-trip-h3 font-semibold text-ink">{d.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{d.body}</p>
              <Link href={DURATION_HREFS[i]} className="mt-4 inline-block text-meta font-semibold text-rust">
                {d.linkLabel}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 space-y-8">
        <div>
          <h2 className="text-card-title font-bold text-ink">{t.notOnlyHeading}</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            {t.notOnlyBody}
          </p>
        </div>

        <div>
          <h2 className="text-card-title font-bold text-ink">{t.notSureHeading}</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            {t.notSureBody}
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
