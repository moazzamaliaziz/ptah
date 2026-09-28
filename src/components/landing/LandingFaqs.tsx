import type { JSX } from "react";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { getPageContent } from "@/i18n/pages";

/* The six questions we surface on the landing (design decision B), by position
   in the flattened faqs list: How do I book · Do I need a visa · Is Egypt safe ·
   When is the best time · What's included · Can you tailor an itinerary. The
   full set lives on /faqs. */
const LANDING_FAQ_INDICES = [0, 3, 4, 5, 6, 9] as const;

/**
 * Landing section — FAQ accordion (design decision B), nearest the footer.
 *
 * Server component. Reuses the already-translated answers from `pc.faqs`, so no
 * new copy is authored here. Expand/collapse is native `<details>/<summary>`,
 * which is keyboard-accessible with no client JS. Emits FAQPage structured data
 * for the six shown questions; /faqs itself renders no FAQPage JSON-LD, so this
 * does not duplicate structured data across the site.
 */
export default async function LandingFaqs(): Promise<JSX.Element> {
  const pc = await getPageContent();
  const t = pc.faqs;
  const allItems = t.groups.flatMap((g) => g.items);
  const faqs = LANDING_FAQ_INDICES.map((i) => allItems[i]).filter(Boolean);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section
      className="section-shell"
      style={{ marginTop: "var(--section-margin)" }}
      aria-labelledby="landing-faqs-heading"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqLd).replace(/</g, "\\u003c"),
        }}
      />

      <header className="max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">{t.eyebrow}</p>
        <h2 id="landing-faqs-heading" className="mt-2 text-section-h2 font-bold text-ink">
          {t.title}
        </h2>
        <p className="mt-4 text-body leading-relaxed text-ink/70">{t.lede}</p>
      </header>

      <div className="mt-10 border-y border-grey-300/60">
        {faqs.map((f) => (
          <details key={f.q} className="group border-b border-grey-300/60 last:border-b-0">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-trip-h3 font-semibold text-ink transition-colors hover:text-rust [&::-webkit-details-marker]:hidden">
              <span>{f.q}</span>
              <span
                aria-hidden
                className="ml-4 shrink-0 text-2xl font-normal leading-none text-rust transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
              >
                +
              </span>
            </summary>
            <p className="-mt-1 pb-5 pr-8 text-body leading-relaxed text-ink/70">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link className="pill pill--outline" href="/faqs">
          {pc.landing.faqsCta}
        </Link>
      </div>
    </section>
  );
}
