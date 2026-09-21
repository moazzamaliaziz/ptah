import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import NewsletterForm from "@/components/marketing/NewsletterForm";

export const metadata: Metadata = {
  title: "Newsletter | Ptah Tours",
  description:
    "Join the Ptah Tours newsletter for stories from Egypt, seasonal travel tips, and the occasional quiet-season offer. No spam — unsubscribe any time.",
  alternates: { canonical: "/newsletter" },
};

const PERKS: { title: string; body: string }[] = [
  {
    title: "Stories worth reading",
    body: "Field notes from our team — the places we love, the ones we keep quiet, and how to get the most from both.",
  },
  {
    title: "Seasonal know-how",
    body: "When to go where, what's opening, and the practical tips that make an Egypt trip smoother.",
  },
  {
    title: "The occasional offer",
    body: "Now and then, a quiet-season departure or a small deal — sent sparingly, only when it's genuinely good.",
  },
];

export default function NewsletterPage() {
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Newsletter" }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">Stay in touch</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">The Ptah Tours newsletter</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">
          A little Egypt in your inbox. Sign up for stories from our team, seasonal travel tips, and the rare
          quiet-season offer — sent sparingly, never as spam.
        </p>
      </header>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <section>
          <h2 className="text-section-h2 font-bold text-ink">What you&apos;ll get</h2>
          <div className="mt-8 space-y-6">
            {PERKS.map((perk) => (
              <div key={perk.title}>
                <h3 className="text-trip-h3 font-semibold text-ink">{perk.title}</h3>
                <p className="mt-2 text-meta leading-relaxed text-ink/65">{perk.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-grey-300/60 bg-papyrus/40 p-6 sm:p-8">
          <h2 className="text-card-title font-bold text-ink">Subscribe</h2>
          <p className="mt-2 text-meta text-ink/65">Enter your email and you&apos;re in.</p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </section>
      </div>
    </Container>
  );
}
