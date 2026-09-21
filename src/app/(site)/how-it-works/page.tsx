import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "How It Works | Ptah Tours",
  description:
    "How booking a trip with Ptah Tours works, step by step — from choosing a tour to travelling Egypt with a licensed guide and 24/7 local support.",
  alternates: { canonical: "/how-it-works" },
};

const STEPS: { title: string; body: string }[] = [
  {
    title: "1. Browse and choose",
    body: "Explore our tours by destination, length, and style. Every listing shows the full route, what's included, and all-in pricing in USD and EGP — so you know exactly what you're booking before you commit.",
  },
  {
    title: "2. Enquire or book online",
    body: "Ready to go? Book directly on the site. Still deciding? Send an enquiry and tell us what you have in mind — dates, group size, the sites you can't miss — and we'll come back with options.",
  },
  {
    title: "3. We confirm the details",
    body: "Our Cairo team reviews your request, confirms availability, and matches you with a licensed Egyptologist guide. We'll flag anything worth knowing — timing, site closures, or a smarter order to see things.",
  },
  {
    title: "4. Pay securely",
    body: "Once the plan is set, you pay through our secure checkout. Pricing stays transparent and all-in: entrance fees, transfers, and the specifics are laid out with no surprise line items at the temple gate.",
  },
  {
    title: "5. Receive your itinerary",
    body: "You'll get a clear day-by-day itinerary with your guide's details, pickup times, and practical notes. Everything you need for the trip lives in one place, ready before you fly.",
  },
  {
    title: "6. Travel with local support",
    body: "On the ground, your guide runs the day. Behind them, a Cairo phone line is on call 24/7 — so if plans shift, someone who knows the ground is there to sort it out.",
  },
];

export default function HowItWorksPage() {
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "How it works" }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">How it works</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">Booking a trip with us, step by step</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">
          Planning a trip to Egypt shouldn&apos;t feel like a second job. Here&apos;s exactly how it works with
          Ptah Tours — from the first browse to the day you&apos;re standing in front of the pyramids with a
          guide who knows their history cold.
        </p>
      </header>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">Six simple steps</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {STEPS.map((s) => (
            <div key={s.title} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <h3 className="text-trip-h3 font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 space-y-8">
        <div>
          <h2 className="text-card-title font-bold text-ink">Private or small-group — your call</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            Most of our journeys default to private departures: just your party, your guide, and a pace that
            bends to you. Prefer to travel alongside a few like-minded people and keep costs down? Our
            small-group options cap numbers so the experience never feels like a crowd. Either way, you get a
            licensed Egyptologist and the same all-in pricing.
          </p>
        </div>

        <div>
          <h2 className="text-card-title font-bold text-ink">Make it your own</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            Our published itineraries are a starting point, not a straitjacket. Want an extra day in Luxor, a
            slower morning at Giza, a hot-air balloon at dawn, or to swap a museum for a market? Tell us during
            the enquiry and we&apos;ll reshape the route around what matters to you — then confirm the details
            and any change in price before you pay.
          </p>
        </div>

        <div>
          <h2 className="text-card-title font-bold text-ink">What happens after you book</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            Booking is the beginning, not the end of the conversation. You&apos;ll have your written itinerary,
            your guide&apos;s introduction, and a single point of contact in Cairo. In the days before travel
            we confirm pickups and timings, and while you&apos;re here our team stays reachable around the
            clock. If a tomb closes or the weather turns, we adjust the day so you don&apos;t miss out.
          </p>
        </div>
      </section>

      <section className="mt-16 rounded-2xl bg-nile px-8 py-12 text-center">
        <h2 className="text-section-h2 font-bold text-white">Ready to start planning?</h2>
        <p className="mx-auto mt-3 max-w-xl text-body text-white/75">
          Browse our tours to find your route, or tell us what you have in mind and we&apos;ll shape the trip
          around you.
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
