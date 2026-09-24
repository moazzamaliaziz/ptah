import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { getPageContent } from "@/i18n/pages";

export const metadata: Metadata = {
  title: "Disclaimer | Ptah Tours",
  description:
    "The content on the Ptah Tours website is provided for general information purposes only. While we strive for accuracy, we cannot guarantee completeness or timeliness.",
};

export default async function DisclaimerPage() {
  const pc = await getPageContent();
  const t = pc.disclaimer;
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
          <h3 className="font-display text-2xl text-charcoal">{t.accuracyHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.accuracyBody}
          </p>
          <ul>
            {t.accuracyItems.map((item) => (
              <li key={item} className="mt-2 list-disc text-warm-gray pl-5">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.pricingHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.pricingBody}
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.linksHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.linksBody}
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.ugcHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.ugcBody}
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.liabilityHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.liabilityBody}
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.governingHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.governingBody}
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
