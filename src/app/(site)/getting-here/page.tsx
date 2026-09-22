import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Flying Into Egypt | Ptah Tours",
  description:
    "Getting to Egypt: the main international gateways at Cairo, Luxor, Hurghada, Sharm El Sheikh, and Aswan — plus what to expect on arrival and how we handle transfers.",
  alternates: { canonical: "/getting-here" },
};

const GATEWAYS: { title: string; body: string }[] = [
  {
    title: "Cairo (CAI)",
    body: "The main international hub and the natural starting point for most trips. Direct flights from Europe, the Gulf, North America, and beyond land here, minutes from Giza and the heart of the city.",
  },
  {
    title: "Luxor (LXR)",
    body: "The gateway to Upper Egypt, with seasonal and regional connections. Handy if you want to start in the south among the temples and the Valley of the Kings before heading elsewhere.",
  },
  {
    title: "Hurghada (HRG)",
    body: "The Red Sea's busiest airport, well served by charter and scheduled flights from Europe. Ideal if beaches, diving, and the reef are high on your list.",
  },
  {
    title: "Sharm El Sheikh (SSH)",
    body: "The southern Sinai gateway on the Red Sea, popular for resort stays and world-class diving. A comfortable base for the coast, with connections across the region.",
  },
  {
    title: "Aswan (ASW)",
    body: "The far-south gateway, useful for Nile journeys and the trip to Abu Simbel. Often paired with Luxor as the two ends of a classic Upper Egypt route.",
  },
];

export default function GettingHerePage() {
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Getting here" }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">Getting here</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">Flying into Egypt</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">
          Egypt is well connected, with several international airports to choose from depending on where your
          trip begins. Here&apos;s a look at the main gateways and what to expect when you touch down — plus
          how we make the arrival itself painless.
        </p>
      </header>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">Main international gateways</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {GATEWAYS.map((g) => (
            <div key={g.title} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <h3 className="text-trip-h3 font-semibold text-ink">{g.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{g.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="arrivals" className="mt-16 scroll-mt-24">
        <h2 className="text-section-h2 font-bold text-ink">Arriving at the airport</h2>
        <p className="mt-4 max-w-2xl text-body leading-relaxed text-ink/70">
          The first hour in a new country sets the tone. Here&apos;s what to expect on arrival, and how we
          smooth it out.
        </p>

        <div className="mt-8 space-y-8">
          <div>
            <h3 className="text-card-title font-bold text-ink">Meet and greet</h3>
            <p className="mt-3 text-body leading-relaxed text-ink/75">
              When your trip includes an airport transfer, a representative meets you in the arrivals hall
              with a name board, helps with any arrival formalities, and walks you to your vehicle. No
              hunting for a taxi, no haggling at the curb after a long flight.
            </p>
          </div>

          <div>
            <h3 className="text-card-title font-bold text-ink">Immigration and customs</h3>
            <p className="mt-3 text-body leading-relaxed text-ink/75">
              Have your passport, any pre-arranged visa documentation, and your onward details ready. Lines
              can be busy when several flights land together, so build in a little patience — and see our
              visa guidance for what to sort out before you fly.
            </p>
          </div>

          <div>
            <h3 className="text-card-title font-bold text-ink">Currency and a local SIM</h3>
            <p className="mt-3 text-body leading-relaxed text-ink/75">
              Airports have ATMs and exchange desks if you want some Egyptian pounds in hand, and SIM cards
              from local mobile operators are usually available in the arrivals area. It&apos;s worth grabbing
              a little cash for tips and small purchases, and a SIM if you want data from the moment you land.
            </p>
          </div>

          <div>
            <h3 className="text-card-title font-bold text-ink">Private transfers, arranged</h3>
            <p className="mt-3 text-body leading-relaxed text-ink/75">
              We arrange private airport transfers as part of most trips — a clean, air-conditioned vehicle
              and a driver who knows the way to your hotel. Tell us your flight details and we&apos;ll have
              someone waiting, whatever the hour.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-16 rounded-2xl bg-nile px-8 py-12 text-center">
        <h2 className="text-section-h2 font-bold text-white">We&apos;ll be there when you land</h2>
        <p className="mx-auto mt-3 max-w-xl text-body text-white/75">
          Book a tour with transfers included, or tell us your flights and we&apos;ll arrange the welcome.
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
