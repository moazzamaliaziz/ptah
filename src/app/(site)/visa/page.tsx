import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Egypt Visa & Entry Guidance | Ptah Tours",
  description:
    "General guidance on entering Egypt — the e-Visa portal, visa on arrival, and passport validity. Always confirm current rules with official Egyptian sources before you travel.",
  alternates: { canonical: "/visa" },
};

const OFFICIAL_PORTAL = "https://visa2egypt.gov.eg";

export default function VisaPage() {
  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Visa" }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">Entry &amp; visa</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">Egypt visa &amp; entry guidance</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">
          Most visitors need a visa to enter Egypt, and for many nationalities the process is straightforward.
          The notes below are a general orientation only — entry rules change often and vary by passport, so
          treat this as a starting point, not the final word.
        </p>
      </header>

      {/* Disclaimer block */}
      <section className="mt-10 rounded-xl border border-grey-300/60 bg-papyrus/40 p-6">
        <h2 className="text-card-title font-bold text-ink">Please read first</h2>
        <p className="mt-3 text-body leading-relaxed text-ink/75">
          Entry requirements change — always confirm current rules with official Egyptian government sources
          and your local embassy or consulate before you travel. Ptah Tours can point you in the right
          direction, but we can&apos;t issue visas or guarantee entry, and nothing here should be taken as
          legal or immigration advice.
        </p>
      </section>

      <section className="mt-14 space-y-8">
        <div>
          <h2 className="text-card-title font-bold text-ink">The official e-Visa portal</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            Egypt operates an official online visa system where eligible travellers can apply before they fly.
            It&apos;s the safest, most reliable route — apply directly through the government portal at{" "}
            <a
              href={OFFICIAL_PORTAL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-rust"
            >
              visa2egypt.gov.eg
            </a>{" "}
            and be wary of third-party sites that copy its look and charge extra. Check your eligibility and
            processing times there well ahead of your trip.
          </p>
        </div>

        <div>
          <h2 className="text-card-title font-bold text-ink">Visa on arrival</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            Travellers of many nationalities have historically been able to obtain a visa on arrival at major
            Egyptian airports. Whether this applies to you, and under what conditions, depends on your passport
            and can change — so confirm your specific situation with{" "}
            <a
              href={OFFICIAL_PORTAL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-rust"
            >
              the official portal
            </a>{" "}
            or your embassy before relying on it. When in doubt, applying online in advance removes the
            guesswork.
          </p>
        </div>

        <div>
          <h2 className="text-card-title font-bold text-ink">Passport validity</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            As a general rule, plan to hold a passport with at least six months&apos; validity beyond your
            date of entry, plus a blank page or two for stamps. Requirements differ by nationality, so verify
            the exact rules for your passport with your local embassy or consulate before you book flights.
          </p>
        </div>

        <div>
          <h2 className="text-card-title font-bold text-ink">Special zones and regions</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            Some regions and resort areas have had their own entry arrangements in the past, and rules for
            specific ports of entry or overland crossings can differ from the standard tourist visa. If your
            trip involves anything beyond the usual airport arrival, confirm the details for your exact route
            with official sources — and feel free to ask us what to check.
          </p>
        </div>

        <div>
          <h2 className="text-card-title font-bold text-ink">Where to confirm — every time</h2>
          <p className="mt-3 text-body leading-relaxed text-ink/75">
            Before you travel, verify your requirements against two authoritative sources: Egypt&apos;s
            official e-Visa portal at{" "}
            <a
              href={OFFICIAL_PORTAL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-rust"
            >
              visa2egypt.gov.eg
            </a>{" "}
            and your own country&apos;s embassy or consulate for Egypt. Rules can shift with little notice, so
            check close to your departure rather than relying on older information — including this page.
          </p>
        </div>
      </section>

      <section className="mt-16 rounded-2xl bg-nile px-8 py-12 text-center">
        <h2 className="text-section-h2 font-bold text-white">Sorted on paperwork? Let&apos;s plan the trip</h2>
        <p className="mx-auto mt-3 max-w-xl text-body text-white/75">
          Once your entry is squared away, we&apos;ll handle the rest. Browse tours or tell us what you have in
          mind.
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
