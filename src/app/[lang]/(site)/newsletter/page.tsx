import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import NewsletterForm from "@/components/marketing/NewsletterForm";
import { getPageContent } from "@/i18n/pages";

export const metadata: Metadata = {
  title: "Newsletter | Ptah Tours",
  description:
    "Join the Ptah Tours newsletter for stories from Egypt, seasonal travel tips, and the occasional quiet-season offer. No spam — unsubscribe any time.",
  alternates: { canonical: "/newsletter" },
};

export default async function NewsletterPage() {
  const pc = await getPageContent();
  const t = pc.newsletter;
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

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <section>
          <h2 className="text-section-h2 font-bold text-ink">{t.perksHeading}</h2>
          <div className="mt-8 space-y-6">
            {t.perks.map((perk) => (
              <div key={perk.title}>
                <h3 className="text-trip-h3 font-semibold text-ink">{perk.title}</h3>
                <p className="mt-2 text-meta leading-relaxed text-ink/65">{perk.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-grey-300/60 bg-papyrus/40 p-6 sm:p-8">
          <h2 className="text-card-title font-bold text-ink">{t.subscribeHeading}</h2>
          <p className="mt-2 text-meta text-ink/65">{t.subscribeSubtext}</p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </section>
      </div>
    </Container>
  );
}
