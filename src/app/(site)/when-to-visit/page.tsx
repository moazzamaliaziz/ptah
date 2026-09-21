import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Best Time to Visit Egypt | Ptah Tours",
  description:
    "When to visit Egypt: a season-by-season guide to weather, crowds, and cost across Cairo, Luxor, Aswan, and the Red Sea — so you can pick the right time to travel.",
  alternates: { canonical: "/when-to-visit" },
};

const SEASONS: { title: string; body: string }[] = [
  {
    title: "October–April — peak season",
    body: "The classic window. Days are warm and comfortable, evenings cool, and Upper Egypt — Luxor, Aswan, Abu Simbel — is at its most pleasant for temple-hopping. It's the busiest and priciest time, so popular dates book up early.",
  },
  {
    title: "May–September — summer",
    body: "Hot, and genuinely so in the south, where Luxor and Aswan can push past 40°C. But crowds thin, prices soften, and the Red Sea coast comes into its own. With early starts and shaded afternoons, summer travel is very doable.",
  },
  {
    title: "Shoulder months — October & April/May",
    body: "The edges of peak season often hit the sweet spot: pleasant weather, thinner crowds than midwinter, and slightly gentler pricing. If you want the best of both, aim for these transitional weeks.",
  },
];

export default function WhenToVisitPage() {
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "When to visit" }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">When to go</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">The best time to visit Egypt</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">
          There&apos;s no single perfect month — it depends on where you&apos;re headed and what you can handle
          heat-wise. Here&apos;s how the year breaks down, from the cool, crowded peak to the quiet, sun-baked
          summer, so you can choose the season that suits your trip.
        </p>
      </header>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">Egypt by season</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {SEASONS.map((s) => (
            <div key={s.title} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <h3 className="text-trip-h3 font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 space-y-8">
        <div>
          <h2 className="text-card-title font-bold text-ink">Heat in Upper Egypt and the desert</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            Luxor, Aswan, and the Western Desert get seriously hot from late spring through early autumn.
            It&apos;s not a reason to stay away — just to travel smart. We schedule the big sites for early
            morning, build in shaded downtime through the middle of the day, and keep water close. If you
            wilt in heat, the cooler October-to-April window will be far more comfortable in the south.
          </p>
        </div>

        <div>
          <h2 className="text-card-title font-bold text-ink">The Red Sea is a year-round exception</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            Hurghada and Sharm El Sheikh stay warm and inviting almost all year, with sea temperatures that
            make diving and snorkelling a pleasure even when Cairo cools off. Summer is high season on the
            coast precisely because it&apos;s a comfortable base when inland Egypt is at its hottest — a
            natural pairing with a few days on the reefs.
          </p>
        </div>

        <div>
          <h2 className="text-card-title font-bold text-ink">Travelling during Ramadan</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            Ramadan, the Islamic month of fasting, moves through the calendar year by year. It&apos;s a
            special time to visit — evenings come alive after sunset — but daytime hours can be quieter and
            some cafés and shops keep shorter schedules. Sites and tours run as normal, and travellers are
            warmly welcomed; a little sensitivity around eating and drinking in public during the day goes a
            long way. If you&apos;d prefer to plan around it, just ask and we&apos;ll flag the dates for your
            year.
          </p>
        </div>
      </section>

      <section className="mt-16 rounded-2xl bg-nile px-8 py-12 text-center">
        <h2 className="text-section-h2 font-bold text-white">Pick your season, then your route</h2>
        <p className="mx-auto mt-3 max-w-xl text-body text-white/75">
          Whatever time of year suits you, we&apos;ll build a trip that works around the weather. Browse tours
          or tell us your dates.
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
