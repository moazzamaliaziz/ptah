import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Family Travel in Egypt | Ptah Tours",
  description:
    "Egypt is a wonderful place to travel with children — pyramids, camel rides, felucca sails, and Red Sea reefs. How we design family-friendly trips: pacing, private guides, and kid-approved highlights.",
  alternates: { canonical: "/family-travel" },
};

const WHY: { title: string; body: string }[] = [
  {
    title: "It brings history to life",
    body: "Pyramids you can walk up to, tombs painted in colour, mummies behind glass — Egypt turns the pages of a schoolbook into something kids can actually stand in front of. It's the rare trip that thrills every age at once.",
  },
  {
    title: "Adventure at every turn",
    body: "A camel ride at Giza, a horse-drawn caleche in Luxor, a felucca sail on the Nile, snorkeling over a coral reef — the days are full of the kind of moments children remember for years.",
  },
  {
    title: "A warm welcome for families",
    body: "Egyptian culture adores children, and families are welcomed everywhere with genuine warmth. Traveling with kids often opens doors — and conversations — that solo travelers never see.",
  },
];

const HOW: { title: string; body: string }[] = [
  {
    title: "Pacing built for younger legs",
    body: "We keep sightseeing to the cooler morning hours, build in pool time and rest, and never cram a day. A great family trip has white space in it — time to just be somewhere remarkable.",
  },
  {
    title: "Private by default",
    body: "Private guides and transport mean the day flexes to your family's mood and nap schedule, not a coach timetable. Need to head back early? No problem.",
  },
  {
    title: "Guides who are great with kids",
    body: "We match families with guides who know how to tell a story a ten-year-old will lean into — turning hieroglyphs into a code to crack and gods into characters worth meeting.",
  },
  {
    title: "The right places to stay",
    body: "We choose hotels with family rooms and pools, and we're happy to arrange cots, connecting rooms, and early check-ins where they're available. Tell us your ages and we'll tailor everything.",
  },
];

export default function FamilyTravelPage() {
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Family travel" }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">Travel with kids</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">Family travel in Egypt</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">
          Egypt might be the best family trip you never expected. It&apos;s adventurous without being difficult,
          endlessly fascinating for every age, and — with the right pacing and a private guide — genuinely
          relaxing for the grown-ups too.
        </p>
      </header>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">Why families love Egypt</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {WHY.map((w) => (
            <div key={w.title}>
              <h3 className="text-trip-h3 font-semibold text-ink">{w.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">How we plan family trips</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {HOW.map((h) => (
            <div key={h.title} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <h3 className="text-trip-h3 font-semibold text-ink">{h.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{h.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl bg-nile px-8 py-12 text-center">
        <h2 className="text-section-h2 font-bold text-white">Planning a family trip?</h2>
        <p className="mx-auto mt-3 max-w-xl text-body text-white/75">
          Tell us your children&apos;s ages and what they love, and we&apos;ll shape a private itinerary that
          keeps everyone happy — including you.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/tours?type=family" variant="primary" className="bg-white !text-nile hover:bg-white/90">
            See family tours
          </Button>
          <Button href="/contact" variant="ghost-light">
            Plan a family trip
          </Button>
        </div>
      </section>
    </Container>
  );
}
