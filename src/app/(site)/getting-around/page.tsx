import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Getting Around Egypt | Ptah Tours",
  description:
    "How to get around Egypt: domestic flights, sleeper trains, private drivers, Nile boats, and ride-hailing — and what Ptah Tours handles for you versus useful independent-travel tips.",
  alternates: { canonical: "/getting-around" },
};

const MODES: { title: string; body: string }[] = [
  {
    title: "Domestic flights",
    body: "EgyptAir and others link Cairo with Luxor, Aswan, and the Red Sea in about an hour. Flying is the fastest way to cover Egypt's long distances and the easiest way to fit the south into a shorter trip.",
  },
  {
    title: "Trains",
    body: "The Nile Valley line runs Cairo–Luxor–Aswan, with comfortable sleeper services that turn the long southbound journey into an overnight. A scenic, characterful alternative to flying for those with time.",
  },
  {
    title: "Private drivers",
    body: "For flexibility on the ground, a private car with a driver is hard to beat — door to door, on your schedule, with someone who knows the roads. This is how we move guests around within a destination.",
  },
  {
    title: "Nile boats and feluccas",
    body: "Between Luxor and Aswan, the river is the road. Multi-day cruise boats and traditional sail-powered feluccas let you travel the Nile itself, with temples appearing along the banks as you go.",
  },
  {
    title: "Ride-hailing in cities",
    body: "In Cairo and other big cities, ride-hailing apps make short hops simple and remove the need to negotiate fares. Handy for independent evenings out when you're not with your guide.",
  },
  {
    title: "On foot",
    body: "The best way to feel a place. Old Cairo's lanes, Luxor's east-bank streets, and the temple complexes themselves reward slow walking — always with sun protection and water in the warmer months.",
  },
];

export default function GettingAroundPage() {
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Getting around" }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">Getting around</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">Getting around Egypt</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">
          Egypt is a big country, and how you move between its highlights shapes the whole trip. Here are your
          options — from a quick domestic flight to a slow sail down the Nile — and a clear line on what we
          take care of versus what&apos;s worth knowing if you head out on your own.
        </p>
      </header>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">Ways to travel</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {MODES.map((m) => (
            <div key={m.title} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <h3 className="text-trip-h3 font-semibold text-ink">{m.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{m.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 space-y-8">
        <div>
          <h2 className="text-card-title font-bold text-ink">What we handle</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            On our tours, transport is one less thing to think about. We arrange private, air-conditioned
            vehicles with vetted drivers for your sightseeing days, coordinate domestic flights and train
            legs where they make sense, and sort your Nile cruise or felucca time as part of the itinerary.
            Everything is timed to link up, so you&apos;re never left working out how to get from one place to
            the next.
          </p>
        </div>

        <div>
          <h2 className="text-card-title font-bold text-ink">Tips for independent travel</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            Striking out on your own between tour days? A few pointers help. Agree fares before you set off if
            you use a metered or negotiated taxi, or lean on a ride-hailing app in the cities to keep things
            simple. Carry small notes for tips and short trips, book longer-distance trains and flights ahead
            in peak season, and keep your hotel&apos;s address written in Arabic for the return journey. Your
            guide is always happy to point you to the safe, sensible option.
          </p>
        </div>

        <div>
          <h2 className="text-card-title font-bold text-ink">Getting the mix right</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            The best trips blend modes: fly to save time on the long hops, take the train or a cruise where
            the journey is part of the experience, and keep a private driver for the days packed with sites.
            Tell us your priorities and we&apos;ll build the right combination into your route.
          </p>
        </div>
      </section>

      <section className="mt-16 rounded-2xl bg-nile px-8 py-12 text-center">
        <h2 className="text-section-h2 font-bold text-white">Leave the logistics to us</h2>
        <p className="mx-auto mt-3 max-w-xl text-body text-white/75">
          Browse tours with transport built in, or tell us your plans and we&apos;ll connect the dots.
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
