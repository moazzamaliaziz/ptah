import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Ptah Tours | Egypt, curated by the people who call it home",
  description:
    "Ptah Tours is a Cairo-based team of Egyptologists, guides, and trip designers building private and small-group journeys across Egypt. Meet the people and the promises behind every itinerary.",
  alternates: { canonical: "/about" },
};

const PROMISES: { title: string; body: string }[] = [
  {
    title: "Licensed Egyptologist guides",
    body: "Every tour is led by a licensed Egyptologist — not a script. They read the walls, answer the hard questions, and time each site so you see it at its best, not its busiest.",
  },
  {
    title: "Honest, all-in pricing",
    body: "The price you see is the price you pay. Entrance fees, transfers, and the details are laid out before you book — no surprise line items at the temple gate.",
  },
  {
    title: "Small groups, private by default",
    body: "We cap group sizes and default to private departures so the pace bends to you. Slow mornings at Giza, an extra hour in the Valley of the Kings — the day is yours.",
  },
  {
    title: "Local, year-round",
    body: "We live here. When plans shift — a strike, a heatwave, a closed tomb — a Cairo phone number picks up, and someone who knows the ground sorts it out.",
  },
];

const VALUES: { title: string; body: string }[] = [
  {
    title: "Respect for the places we visit",
    body: "Egypt's heritage outlasts all of us. We travel in ways that protect the sites and support the communities who steward them.",
  },
  {
    title: "Depth over checklists",
    body: "We would rather you understand one temple than photograph ten. Our itineraries leave room to linger, ask, and actually remember the day.",
  },
  {
    title: "Care in the details",
    body: "The right guide, the cool side of the coach, water when you need it. Good travel is a thousand small decisions made on your behalf.",
  },
];

// Team described by role rather than fabricated named individuals.
const TEAM: { title: string; body: string }[] = [
  {
    title: "Licensed Egyptologist guides",
    body: "Our guides trained in Egyptology and hold official guiding licences. They read the sites for you — the stories in the reliefs, the reasons behind the ruins — rather than reciting a script.",
  },
  {
    title: "Trip designers",
    body: "Behind every itinerary is a planner who sequences your days around light and crowds, matches you to the right guide, and sweats the logistics so the trip feels effortless.",
  },
  {
    title: "On-the-ground support",
    body: "A Cairo-based team keeps every trip running and stays reachable throughout — the local number that always picks up when plans need to flex.",
  },
];

// Mirrors the footer accreditation SSOT in src/content/landing.ts.
const ACCREDITATIONS: { name: string; note: string }[] = [
  { name: "ETF", note: "Member 2026" },
  { name: "Travelife", note: "Partner" },
  { name: "Egypt Air", note: "Official carrier partner" },
  { name: "IATA", note: "Accredited agent" },
];

export default function AboutPage() {
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />

      {/* Intro */}
      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">About Ptah Tours</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">Egypt, curated by the people who call it home</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">
          Ptah Tours is a Cairo-based team of Egyptologists, guides, and trip designers. We build private and
          small-group journeys across Egypt — from the pyramids of Giza to the temples of the south and the
          quiet of the Nile — for travelers who want more than a photo stop.
        </p>
      </header>

      {/* Founding story */}
      <section className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <h2 className="text-card-title font-bold text-ink">Our story</h2>
        </div>
        <div className="lg:col-span-2 space-y-4 text-body leading-relaxed text-ink/75">
          <p>
            Ptah Tours began with a simple frustration: too many people were leaving Egypt having seen the
            monuments but never really understood them. Rushed coaches, crowded noon visits, guides reading
            from a laminated card — the country deserved better, and so did the people who traveled so far to
            see it.
          </p>
          <p>
            So we built the company we wished existed. Named for Ptah, the Memphite god of craftsmen and
            makers, we treat every itinerary as something to be crafted — sequenced around light and crowds,
            led by people who have spent their lives with these sites, and paced so there is room to actually
            take it in.
          </p>
          <p>
            Today we welcome travelers from around the world, but the heart of the company hasn&apos;t moved:
            it&apos;s still a team in Cairo who love this place and want you to love it too.
          </p>
        </div>
      </section>

      {/* Promises */}
      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">What we promise</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {PROMISES.map((p) => (
            <div key={p.title} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <h3 className="text-trip-h3 font-semibold text-ink">{p.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">How we travel</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title}>
              <h3 className="text-trip-h3 font-semibold text-ink">{v.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section id="team" className="mt-16 scroll-mt-24">
        <h2 className="text-section-h2 font-bold text-ink">Our Egyptologists</h2>
        <p className="mt-3 max-w-2xl text-body leading-relaxed text-ink/70">
          Every Ptah journey is led by a licensed Egyptologist — a professional guide trained in Egypt&apos;s
          history and archaeology, and licensed by the Ministry of Tourism and Antiquities. They&apos;re the
          reason a visit becomes an understanding.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TEAM.map((t) => (
            <div key={t.title} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <h3 className="text-trip-h3 font-semibold text-ink">{t.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Accreditation */}
      <section id="accreditation" className="mt-16 scroll-mt-24">
        <h2 className="text-section-h2 font-bold text-ink">Accreditations &amp; partners</h2>
        <p className="mt-3 max-w-2xl text-body leading-relaxed text-ink/70">
          We hold ourselves to recognised industry standards and work with established travel partners — so the
          people you trust with your trip are accountable to more than just us.
        </p>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {ACCREDITATIONS.map((a) => (
            <div key={a.name} className="rounded-xl border border-grey-300/60 bg-white p-6 text-center">
              <p className="text-trip-h3 font-bold text-ink">{a.name}</p>
              <p className="mt-1 text-meta text-ink/60">{a.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-meta text-ink/45">
          See these partners referenced across our site footer. For verification details, contact us any time.
        </p>
      </section>

      {/* CTA */}
      <section className="mt-16 rounded-2xl bg-nile px-8 py-12 text-center">
        <h2 className="text-section-h2 font-bold text-white">Ready to see Egypt properly?</h2>
        <p className="mx-auto mt-3 max-w-xl text-body text-white/75">
          Browse our tours or tell us what you have in mind — we&apos;ll help you shape the trip.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/tours" variant="primary" className="bg-white !text-nile hover:bg-white/90">
            Browse tours
          </Button>
          <Button href="/contact" variant="ghost-light">
            Start planning
          </Button>
        </div>
      </section>
    </Container>
  );
}
