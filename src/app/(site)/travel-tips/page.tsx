import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Egypt Travel Health & Safety Tips | Ptah Tours",
  description:
    "Practical health and safety guidance for traveling in Egypt — staying hydrated in the heat, food and water, sun protection, money and valuables, and what to pack. General advice, not medical advice.",
  alternates: { canonical: "/travel-tips" },
};

const HEALTH: { title: string; body: string }[] = [
  {
    title: "Beat the heat",
    body: "Egypt runs hot, especially in the south from spring to autumn. Start sightseeing early, rest through the hottest hours, and drink more water than you think you need. Light, loose, long clothing keeps you cooler than bare skin.",
  },
  {
    title: "Food & water",
    body: "Stick to bottled or filtered water, including for brushing teeth, and enjoy freshly cooked, hot food. Egyptian cuisine is a highlight of any trip — a little sensible caution just means you enjoy it without interruption.",
  },
  {
    title: "Sun protection",
    body: "The sun is stronger than it feels near the water or in the desert. Pack a high-SPF sunscreen, a wide-brimmed hat, and good sunglasses, and reapply often. A reef-safe sunscreen is a must if you're snorkeling.",
  },
  {
    title: "Talk to a professional",
    body: "Before you travel, check current vaccination and health recommendations with a travel clinic or your doctor. This page is general guidance only — it is not medical advice, and your own health needs come first.",
  },
];

const SAFETY: { title: string; body: string }[] = [
  {
    title: "Money & valuables",
    body: "Carry small amounts of cash for tips and markets, keep the rest and your passport in your hotel safe, and use a card where you can. A cross-body bag that closes properly is your friend in busy places.",
  },
  {
    title: "Getting around",
    body: "Use hotel-arranged or reputable transport rather than flagging cars at random, agree fares before you set off, and keep our local number handy. On our tours, your transfers and drivers are arranged for you.",
  },
  {
    title: "Respect local customs",
    body: "Egypt is a warm, welcoming, and largely conservative country. Modest dress at religious sites, asking before photographing people, and a friendly greeting go a long way. A few words of Arabic are always appreciated.",
  },
  {
    title: "Check official advice",
    body: "Before and during your trip, review your own government's travel advice for Egypt, and follow any guidance from your guides on the ground. We plan around official information and keep a Cairo team on call throughout your trip.",
  },
];

export default function TravelTipsPage() {
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Health & Safety" }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">Travel smart</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">Health &amp; safety tips</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">
          A little preparation makes Egypt an easy, comfortable place to travel. Here&apos;s the practical
          guidance we share with our own travelers — on staying well in the heat, eating happily, and keeping
          your trip smooth from arrival to departure.
        </p>
      </header>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">Staying healthy</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {HEALTH.map((h) => (
            <div key={h.title} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <h3 className="text-trip-h3 font-semibold text-ink">{h.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{h.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">Staying safe</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {SAFETY.map((s) => (
            <div key={s.title} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <h3 className="text-trip-h3 font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-xl border border-grey-300/60 bg-papyrus/50 p-6">
        <p className="text-meta leading-relaxed text-ink/70">
          This page offers general travel guidance only and is not medical, legal, or safety advice. Conditions
          change — always confirm current health recommendations with a qualified professional and check your own
          government&apos;s official travel advice before you go.
        </p>
      </section>

      <section className="mt-16 rounded-2xl bg-nile px-8 py-12 text-center">
        <h2 className="text-section-h2 font-bold text-white">Traveling with us?</h2>
        <p className="mx-auto mt-3 max-w-xl text-body text-white/75">
          We handle the logistics so you can focus on the trip. Have a specific health or access need? Tell us
          and we&apos;ll plan around it.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/tours" variant="primary" className="bg-white !text-nile hover:bg-white/90">
            Browse tours
          </Button>
          <Button href="/contact" variant="ghost-light">
            Ask about your needs
          </Button>
        </div>
      </section>
    </Container>
  );
}
