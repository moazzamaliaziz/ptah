import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Responsible Travel | Ptah Tours",
  description:
    "How Ptah Tours travels with care — protecting Egypt's heritage sites, supporting local communities and guides, and reducing the footprint of every trip. Our commitments and how you can travel responsibly.",
  alternates: { canonical: "/responsible-travel" },
};

const COMMITMENTS: { title: string; body: string }[] = [
  {
    title: "Protecting the sites",
    body: "Egypt's monuments have to outlast all of us. We follow site rules to the letter, keep groups small to limit wear, and never encourage touching carvings or straying from marked paths. The photo is never worth the damage.",
  },
  {
    title: "Supporting local communities",
    body: "We employ Egyptian guides, drivers, and teams, buy from local suppliers, and build in visits to family-run workshops and eateries where your spending stays in the community rather than leaking out of it.",
  },
  {
    title: "Fair work for guides",
    body: "Our guides are licensed professionals, paid fairly and treated as the experts they are. A trip that runs on underpaid labour isn't a trip we're willing to sell.",
  },
  {
    title: "Lighter on the environment",
    body: "We cut single-use plastic where we can, favour reef-safe practices on the Red Sea, and plan efficient routes to reduce needless travel. Small choices, made on every trip, add up.",
  },
];

const YOU: { title: string; body: string }[] = [
  {
    title: "Refill, don't buy",
    body: "Bring a reusable bottle — we'll help you refill safely rather than working through a case of plastic each day.",
  },
  {
    title: "Choose reef-safe",
    body: "On the coast, pack reef-safe sunscreen, keep your distance from coral, and never touch or feed marine life. Our dive guides will show you how.",
  },
  {
    title: "Buy well",
    body: "Support genuine local craft over mass-produced souvenirs, and never buy anything claiming to be a genuine antiquity — it's illegal and it fuels looting.",
  },
  {
    title: "Travel with respect",
    body: "Ask before photographing people, dress modestly at religious sites, and meet the warmth of Egyptian hospitality with your own. Good travel is a two-way street.",
  },
];

export default function ResponsibleTravelPage() {
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Responsible travel" }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">Travel with care</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">Responsible travel</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">
          We live here, so this isn&apos;t abstract for us. Protecting Egypt&apos;s heritage and supporting the
          communities who steward it is simply how we want to run a travel company — and how we&apos;d want
          others to travel in our home.
        </p>
      </header>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">Our commitments</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {COMMITMENTS.map((c) => (
            <div key={c.title} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <h3 className="text-trip-h3 font-semibold text-ink">{c.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">How you can help</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {YOU.map((y) => (
            <div key={y.title}>
              <h3 className="text-trip-h3 font-semibold text-ink">{y.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{y.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl bg-nile px-8 py-12 text-center">
        <h2 className="text-section-h2 font-bold text-white">Travel that gives back</h2>
        <p className="mx-auto mt-3 max-w-xl text-body text-white/75">
          Every Ptah trip is built to tread lightly and support the people who make Egypt what it is. Come see
          it the right way.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/tours" variant="primary" className="bg-white !text-nile hover:bg-white/90">
            Browse tours
          </Button>
          <Button href="/contact" variant="ghost-light">
            Ask about our approach
          </Button>
        </div>
      </section>
    </Container>
  );
}
