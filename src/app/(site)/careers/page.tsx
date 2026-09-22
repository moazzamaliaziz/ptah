import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Careers at Ptah Tours | Work in Egyptian Travel",
  description:
    "Join a Cairo-based team building thoughtful journeys across Egypt. The kinds of roles we hire for — guiding, trip design, and support — and how to introduce yourself.",
  alternates: { canonical: "/careers" },
};

// Illustrative role types the company hires for — general descriptions, not
// live vacancies. Applicants are directed to /contact to introduce themselves.
const ROLES: { title: string; body: string }[] = [
  {
    title: "Egyptologist guides",
    body: "Licensed guides who can read a temple wall and hold a room — turning three thousand years of history into a day people never forget. Fluency in a second language beyond Arabic is a real plus.",
  },
  {
    title: "Trip designers",
    body: "Detail-obsessed planners who craft private itineraries: sequencing sites around light and crowds, matching guides to travelers, and sweating the logistics so the trip feels effortless.",
  },
  {
    title: "Travel support & operations",
    body: "The people on the ground and on the phone who keep trips running — coordinating transfers and hotels, solving the unexpected, and being the calm Cairo voice that always picks up.",
  },
  {
    title: "Content & storytelling",
    body: "Writers, photographers, and editors who can capture Egypt honestly and make our journal and tour pages sing — without ever overselling the place.",
  },
];

const VALUES: { title: string; body: string }[] = [
  {
    title: "Local expertise, valued",
    body: "We're an Egyptian company that pays and treats its team as the experts they are. Guiding here is a profession, not a gig.",
  },
  {
    title: "Care over volume",
    body: "We'd rather run fewer, better trips. If you take pride in the details, you'll fit right in.",
  },
  {
    title: "Room to grow",
    body: "As we grow, our team grows with us. We back people who want to deepen their craft and take on more.",
  },
];

export default function CareersPage() {
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Careers" }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">Join the team</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">Careers at Ptah Tours</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">
          We&apos;re a Cairo-based team who love this country and want travelers to love it too. If that sounds
          like your kind of work, we&apos;d like to hear from you — even when we&apos;re not actively hiring.
        </p>
      </header>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">The roles we hire for</h2>
        <p className="mt-3 max-w-2xl text-meta text-ink/60">
          These describe the kinds of people we look for. We&apos;re not always actively recruiting for each,
          but we always want to meet good ones.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {ROLES.map((r) => (
            <div key={r.title} className="rounded-xl border border-grey-300/60 bg-white p-6">
              <h3 className="text-trip-h3 font-semibold text-ink">{r.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-section-h2 font-bold text-ink">Why work with us</h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.title}>
              <h3 className="text-trip-h3 font-semibold text-ink">{v.title}</h3>
              <p className="mt-2 text-meta leading-relaxed text-ink/65">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl bg-nile px-8 py-12 text-center">
        <h2 className="text-section-h2 font-bold text-white">Introduce yourself</h2>
        <p className="mx-auto mt-3 max-w-xl text-body text-white/75">
          Tell us who you are, what you do, and why Egypt. Send a note through our contact page and it&apos;ll
          reach the right person.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/contact" variant="primary" className="bg-white !text-nile hover:bg-white/90">
            Get in touch
          </Button>
          <Button href="/about" variant="ghost-light">
            About Ptah Tours
          </Button>
        </div>
      </section>
    </Container>
  );
}
