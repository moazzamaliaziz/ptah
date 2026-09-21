import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Accessibility | Ptah Tours",
  description:
    "Our commitment to an accessible website and accessible travel in Egypt. How we build this site, how to tell us about access needs, and how we tailor trips for mobility, mobility aids, and more.",
  alternates: { canonical: "/accessibility" },
};

const WEBSITE: { title: string; body: string }[] = [
  {
    title: "How we build this site",
    body: "We aim to follow recognised web accessibility guidance: clear structure and headings, meaningful alternative text, keyboard-navigable menus and controls, visible focus states, and colour contrast chosen for readability.",
  },
  {
    title: "An ongoing effort",
    body: "Accessibility is never finished. We keep testing and improving, and we know some corners will fall short. If something on this site is hard to use with your device or assistive technology, we want to hear about it.",
  },
];

const TRIPS: { title: string; body: string }[] = [
  {
    title: "Tell us early",
    body: "The more we know, the better we plan. Share your access needs when you enquire — mobility, vision, hearing, dietary, or anything else — and we'll build the trip around them rather than bolting them on at the end.",
  },
  {
    title: "The reality on the ground",
    body: "Egypt's ancient sites vary widely: some have ramps and smooth paths, while others involve uneven ground, steps, or narrow tomb passages. We'll be honest about what each site involves so you can decide what's right for you.",
  },
  {
    title: "Private, adaptable pacing",
    body: "Private guides and transport let us slow the pace, add rest, choose step-free routes where they exist, and swap a demanding site for a rewarding alternative. Your day flexes to you.",
  },
  {
    title: "Practical support",
    body: "We can advise on accessible hotels, arrange suitable vehicles, and plan around mobility aids and medical needs. Where we can't make something fully accessible, we'll say so plainly and suggest the best alternative.",
  },
];

export default function AccessibilityPage() {
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Accessibility" }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">Accessible travel</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">Accessibility</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">
          We want Egypt to be open to as many travelers as possible — on this website and on the ground. Here&apos;s
          where we stand today, and how to tell us what you need so we can plan the right trip for you.
        </p>
      </header>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">This website</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {WEBSITE.map((w) => (
            <div key={w.title} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <h3 className="text-trip-h3 font-semibold text-ink">{w.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">Accessible trips</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {TRIPS.map((t) => (
            <div key={t.title} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <h3 className="text-trip-h3 font-semibold text-ink">{t.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{t.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-xl border border-grey-300/60 bg-papyrus/50 p-6">
        <h2 className="text-card-title font-bold text-ink">Found a problem, or have a need to share?</h2>
        <p className="mt-3 text-meta leading-relaxed text-ink/70">
          If any part of this site is difficult to use, or you&apos;d like to talk through access needs for a
          trip, please get in touch. We&apos;ll respond personally and do our best to help — and to fix anything
          on the site that&apos;s getting in your way.
        </p>
      </section>

      <section className="mt-16 rounded-2xl bg-nile px-8 py-12 text-center">
        <h2 className="text-section-h2 font-bold text-white">Let&apos;s plan a trip that works for you</h2>
        <p className="mx-auto mt-3 max-w-xl text-body text-white/75">
          Tell us what you need and we&apos;ll be honest about what&apos;s possible — then build the best trip
          around it.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/contact" variant="primary" className="bg-white !text-nile hover:bg-white/90">
            Talk to us
          </Button>
          <Button href="/tours" variant="ghost-light">
            Browse tours
          </Button>
        </div>
      </section>
    </Container>
  );
}
