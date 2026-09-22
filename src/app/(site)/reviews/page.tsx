import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Reviews & Accreditations | Ptah Tours",
  description:
    "What travelers say about their Ptah Tours journeys, and the industry bodies we work with. Licensed guiding, honest pricing, and trips built by a team who calls Egypt home.",
  alternates: { canonical: "/reviews" },
};

// Company affiliations — mirrors the footer SSOT in src/content/landing.ts.
const ACCREDITATIONS: { name: string; note: string }[] = [
  { name: "ETF", note: "Member 2026" },
  { name: "Travelife", note: "Partner" },
  { name: "Egypt Air", note: "Official carrier partner" },
  { name: "IATA", note: "Accredited agent" },
];

// ⚠ ILLUSTRATIVE placeholder testimonials — NOT real customer reviews.
// Attributed generically (no fabricated named individuals). Replace with real,
// permissioned reviews (with the traveler's consent) before going live.
const TESTIMONIALS: { quote: string; attribution: string }[] = [
  {
    quote:
      "Our guide read the temples like a book — we came away actually understanding what we'd seen, not just photographing it. The private pace made all the difference with two tired kids.",
    attribution: "A family, United Kingdom",
  },
  {
    quote:
      "Everything was arranged before we arrived, right down to the early starts that kept us ahead of the crowds and the heat. Honest pricing, no surprises, and a local number that always picked up.",
    attribution: "A couple, Canada",
  },
  {
    quote:
      "The felucca afternoon in Aswan was the highlight of three weeks across the region. Someone clearly builds these trips because they love the place, not just to sell them.",
    attribution: "A solo traveler, Australia",
  },
];

export default function ReviewsPage() {
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Reviews" }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">Trust & reviews</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">Reviews &amp; accreditations</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">
          The best measure of a trip is how travelers describe it afterwards. Here&apos;s what people tell us —
          and the industry bodies whose standards we hold ourselves to.
        </p>
      </header>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">What travelers say</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure key={t.attribution} className="flex flex-col rounded-xl border border-grey-300/60 bg-white p-6">
              <blockquote className="text-meta leading-relaxed text-ink/75">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="mt-4 text-meta font-semibold text-ink/60">— {t.attribution}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">Accreditations &amp; partners</h2>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {ACCREDITATIONS.map((a) => (
            <div key={a.name} className="rounded-xl border border-grey-300/60 bg-white p-6 text-center">
              <p className="text-trip-h3 font-bold text-ink">{a.name}</p>
              <p className="mt-1 text-meta text-ink/60">{a.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl bg-nile px-8 py-12 text-center">
        <h2 className="text-section-h2 font-bold text-white">Traveled with us?</h2>
        <p className="mx-auto mt-3 max-w-xl text-body text-white/75">
          We&apos;d love to hear how it went — your feedback shapes every trip that follows.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/contact" variant="primary" className="bg-white !text-nile hover:bg-white/90">
            Share your experience
          </Button>
          <Button href="/tours" variant="ghost-light">
            Browse tours
          </Button>
        </div>
      </section>
    </Container>
  );
}
