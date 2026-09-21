import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Ptah Tours",
  description:
    "Answers to the questions travelers ask most before an Egypt trip — booking and payment, visas and safety, what's included, group sizes, and how to tailor a private itinerary.",
  alternates: { canonical: "/faqs" },
};

const FAQ_GROUPS: { heading: string; items: { q: string; a: string }[] }[] = [
  {
    heading: "Booking & payment",
    items: [
      {
        q: "How do I book a tour?",
        a: "Pick a tour and a departure date, then follow the booking steps. If you'd rather talk it through first — or want a private, tailored version — start a conversation on our contact page and we'll take it from there.",
      },
      {
        q: "How far in advance should I book?",
        a: "For the cool October-to-April peak, we suggest booking a few months ahead, since the best guides and departures fill up. Off-peak and last-minute trips are often possible too — ask and we'll tell you honestly what's still open.",
      },
      {
        q: "Can I change or cancel my booking?",
        a: "Yes. Changes and cancellations are handled per the terms shown at checkout and on our refunds and cancellation page. If your plans shift, get in touch early and we'll do what we can to help.",
      },
    ],
  },
  {
    heading: "Before you go",
    items: [
      {
        q: "Do I need a visa?",
        a: "Most visitors do. Many nationalities can obtain an e-visa or a visa on arrival, but rules change and depend on your passport. See our visa guide for general guidance, and always confirm with an official Egyptian government source or your nearest embassy before you travel.",
      },
      {
        q: "Is Egypt safe to visit?",
        a: "The tourist regions we operate in — Cairo, Luxor, Aswan, and the Red Sea coast — routinely welcome visitors from around the world. We plan around official guidance, keep a local team on call, and share practical health and safety tips ahead of every trip. Check your own government's travel advice as well.",
      },
      {
        q: "When is the best time to visit?",
        a: "October to April is the classic window — warm days, cool evenings, and comfortable temple weather in the south. Summer is hotter but quieter and better value, and the Red Sea is a year-round exception. Our when-to-visit guide breaks it down by season.",
      },
    ],
  },
  {
    heading: "On the tour",
    items: [
      {
        q: "What's included in the price?",
        a: "Each tour page lists exactly what's included and what isn't — typically your guiding, listed transfers, and stated entrance fees, with international flights and personal extras kept separate. The price you see is the price you pay; there are no surprise line items at the gate.",
      },
      {
        q: "How big are the groups?",
        a: "We cap group sizes and default to private departures, so the pace bends to you. If you prefer to travel just with your own party, most tours can be made fully private — just ask.",
      },
      {
        q: "Are your guides licensed?",
        a: "Yes. Every tour is led by a licensed Egyptologist guide who reads the sites for you rather than reciting a script, and who times each visit so you see it at its best, not its busiest.",
      },
      {
        q: "Can you tailor an itinerary for me?",
        a: "That's our favorite kind of trip. Tell us your dates, interests, and pace, and we'll shape a private itinerary around them — adding a felucca afternoon, a slow morning at Giza, or a few days on the reef.",
      },
    ],
  },
];

export default function FaqsPage() {
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQs" }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">Good to know</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">Frequently asked questions</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">
          The questions we hear most, answered plainly. Can&apos;t find what you&apos;re after? Reach out — a
          real person on our Cairo team will get back to you.
        </p>
      </header>

      {FAQ_GROUPS.map((group) => (
        <section key={group.heading} className="mt-16">
          <h2 className="text-section-h2 font-bold text-ink">{group.heading}</h2>
          <div className="mt-8 space-y-6">
            {group.items.map((item) => (
              <div key={item.q} className="rounded-xl border border-grey-300/60 bg-white p-6">
                <h3 className="text-trip-h3 font-semibold text-ink">{item.q}</h3>
                <p className="mt-2 text-meta leading-relaxed text-ink/65">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      ))}

      <section className="mt-16 rounded-2xl bg-nile px-8 py-12 text-center">
        <h2 className="text-section-h2 font-bold text-white">Still have a question?</h2>
        <p className="mx-auto mt-3 max-w-xl text-body text-white/75">
          Ask us anything — from dietary needs to accessibility to the best week to travel. We&apos;re happy to
          help you plan.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/contact" variant="primary" className="bg-white !text-nile hover:bg-white/90">
            Ask a question
          </Button>
          <Button href="/tours" variant="ghost-light">
            Browse tours
          </Button>
        </div>
      </section>
    </Container>
  );
}
