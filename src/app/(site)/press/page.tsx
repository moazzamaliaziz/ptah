import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Press & Media | Ptah Tours",
  description:
    "Media resources and press contact for Ptah Tours — a Cairo-based team building private and small-group journeys across Egypt. Request our media kit or get in touch for interviews and imagery.",
  alternates: { canonical: "/press" },
};

const FACTS: { label: string; value: string }[] = [
  { label: "Company", value: "Ptah Tours" },
  { label: "Based in", value: "Cairo, Egypt" },
  { label: "What we do", value: "Private & small-group tours across Egypt" },
  { label: "Guiding", value: "Licensed Egyptologist guides" },
];

const KIT: { title: string; body: string }[] = [
  {
    title: "Company background",
    body: "A concise overview of who we are, how we work, and the story behind the name — everything you need for an accurate mention or profile.",
  },
  {
    title: "Imagery",
    body: "A selection of high-resolution photography from our own field archive, cleared for editorial use with credit. Tell us what you need and we'll send suitable selects.",
  },
  {
    title: "Spokespeople",
    body: "Our team can speak to Egyptian travel, guiding, responsible tourism, and destination trends. We're happy to arrange interviews and provide quotes on request.",
  },
];

export default function PressPage() {
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Press" }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">Press &amp; media</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">Media resources</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">
          Writing about Egyptian travel, guiding, or responsible tourism? We&apos;re glad to help with accurate
          information, imagery, and interviews. Here&apos;s where to start.
        </p>
      </header>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">Company at a glance</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {FACTS.map((f) => (
            <div key={f.label} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-rust">{f.label}</p>
              <p className="mt-1 text-trip-h3 font-semibold text-ink">{f.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">In the media kit</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {KIT.map((k) => (
            <div key={k.title}>
              <h3 className="text-trip-h3 font-semibold text-ink">{k.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{k.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl bg-nile px-8 py-12 text-center">
        <h2 className="text-section-h2 font-bold text-white">Press enquiries</h2>
        <p className="mx-auto mt-3 max-w-xl text-body text-white/75">
          Request the media kit, high-resolution imagery, or an interview through our contact page — mark your
          message &ldquo;Press&rdquo; and we&apos;ll route it to the right person and reply promptly.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/contact" variant="primary" className="bg-white !text-nile hover:bg-white/90">
            Contact our press team
          </Button>
          <Button href="/about" variant="ghost-light">
            About Ptah Tours
          </Button>
        </div>
      </section>
    </Container>
  );
}
