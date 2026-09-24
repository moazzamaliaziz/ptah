import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { getPageContent } from "@/i18n/pages";

export const metadata: Metadata = {
  title: "Terms of Service | Ptah Tours",
  description:
    "These terms govern your use of the Ptah Tours website and any booking you make. Please read them carefully before confirming a reservation.",
};

export default async function TermsOfServicePage() {
  const pc = await getPageContent();
  const t = pc.termsOfService;
  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ label: pc.common.home, href: "/" }, { label: t.breadcrumb }]} />

      <div className="mt-6">
        <SectionHeading
          eyebrow={t.eyebrow}
          title={t.title}
          emphasis={t.emphasis}
          description={t.description}
        />
      </div>

      <div className="mt-12 max-w-none space-y-8">
        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.bookingHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.bookingBody}
          </p>
          <ul>
            {t.bookingItems.map((item) => (
              <li key={item} className="mt-2 list-disc text-warm-gray pl-5">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.paymentHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.paymentBody}
          </p>
          <ul>
            {t.paymentItems.map((item) => (
              <li key={item} className="mt-2 list-disc text-warm-gray pl-5">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.cancellationHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.cancellationBody}
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.responsibilitiesHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.responsibilitiesBody}
          </p>
          <ul>
            {t.responsibilitiesItems.map((item) => (
              <li key={item} className="mt-2 list-disc text-warm-gray pl-5">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.liabilityHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.liabilityBody}
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.forceMajeureHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.forceMajeureBody}
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.changesHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.changesBody}
          </p>
        </div>
      </div>

      <div className="mt-12">
        <Button href="/" variant="secondary">
          {t.backToHome}
        </Button>
      </div>
    </Container>
  );
}
