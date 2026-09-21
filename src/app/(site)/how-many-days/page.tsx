import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "How Many Days in Egypt? | Ptah Tours",
  description:
    "How many days do you need in Egypt? A practical guide to trip length — from a 3-day Cairo taster to a two-week grand tour of the Nile, Red Sea, and beyond.",
  alternates: { canonical: "/how-many-days" },
};

const DURATIONS: { title: string; body: string; href: string; linkLabel: string }[] = [
  {
    title: "3–4 days — the essentials",
    body: "Enough for Cairo and Giza done properly: the pyramids, the Sphinx, the Egyptian Museum, and a wander through Islamic or Coptic Cairo. It's a taster, not the whole story, but it delivers the icons without feeling rushed.",
    href: "/tours?length=short",
    linkLabel: "See short trips",
  },
  {
    title: "5–7 days — the classic",
    body: "The sweet spot for a first visit. Pair Cairo and Giza with the south — the temples of Luxor and Karnak, the Valley of the Kings, and often a stretch of the Nile down to Aswan. You leave feeling you've truly seen Egypt.",
    href: "/tours?length=week",
    linkLabel: "See week-long tours",
  },
  {
    title: "8–10 days — the full Nile",
    body: "Room to slow down and go deeper. Add a proper Nile cruise between Luxor and Aswan, the temples at Edfu and Kom Ombo, and the unforgettable early start to Abu Simbel near the Sudanese border.",
    href: "/tours?length=grand",
    linkLabel: "See grand journeys",
  },
  {
    title: "10+ days — the grand tour",
    body: "Time to combine it all. Layer in the Red Sea for diving and downtime, Alexandria's Mediterranean history, or a desert excursion to the Western oases and White Desert. This is Egypt without compromise.",
    href: "/tours?length=grand",
    linkLabel: "See grand journeys",
  },
];

export default function HowManyDaysPage() {
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "How many days" }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">Trip length</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">How many days do you need in Egypt?</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">
          It depends on what you want to see and how you like to travel — but there are natural rhythms to a
          trip here. Here&apos;s an honest guide to what each length gives you, so you can match your time to
          your ambitions.
        </p>
      </header>

      <section className="mt-14 space-y-8">
        <div>
          <h2 className="text-card-title font-bold text-ink">Got just one day?</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            If you&apos;re passing through Cairo on a layover or squeezing in a side trip from the Red Sea, a
            single well-planned day still goes a long way — the Giza plateau in the morning, the Egyptian
            Museum after. Browse our{" "}
            <Link href="/tours?length=day" className="font-semibold text-rust">
              day tours
            </Link>{" "}
            to see what fits.
          </p>
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">A guide by trip length</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {DURATIONS.map((d) => (
            <div key={d.title} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <h3 className="text-trip-h3 font-semibold text-ink">{d.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{d.body}</p>
              <Link href={d.href} className="mt-4 inline-block text-meta font-semibold text-rust">
                {d.linkLabel}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 space-y-8">
        <div>
          <h2 className="text-card-title font-bold text-ink">It&apos;s not only about the number of days</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            Egypt&apos;s distances are real: the flight or overnight train between Cairo and Luxor eats into a
            short trip, and Abu Simbel is a long way south. The more time you have, the less each day has to
            carry — which usually means a better trip, not just a longer one. If your dates are tight, we&apos;d
            rather help you see fewer places well than sprint through all of them.
          </p>
        </div>

        <div>
          <h2 className="text-card-title font-bold text-ink">Not sure where you land?</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            Tell us your dates and what you most want to see, and we&apos;ll suggest a length and a route that
            fit. Because most of our journeys are private, we can stretch, trim, or reshape any itinerary to
            match the time you actually have.
          </p>
        </div>
      </section>

      <section className="mt-16 rounded-2xl bg-nile px-8 py-12 text-center">
        <h2 className="text-section-h2 font-bold text-white">Find the trip that fits your days</h2>
        <p className="mx-auto mt-3 max-w-xl text-body text-white/75">
          Browse tours by length, or tell us your dates and we&apos;ll build the right route around them.
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
