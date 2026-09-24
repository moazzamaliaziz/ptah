import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { getPageContent } from "@/i18n/pages";

export const metadata: Metadata = {
  title: "Cookie Policy | Ptah Tours",
  description:
    "This cookie policy explains what cookies and similar tracking technologies we use, why we use them, and how you can control them.",
};

export default async function CookiePolicyPage() {
  const pc = await getPageContent();
  const t = pc.cookiePolicy;
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
          <h3 className="font-display text-2xl text-charcoal">{t.whatHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.whatBody}
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.typesHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.typesBody}
          </p>
          <ul>
            {t.typesItems.map((item) => (
              <li key={item} className="mt-2 list-disc text-warm-gray pl-5">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.thirdPartyHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.thirdPartyBody}
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.manageHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.manageBody}
          </p>
          <ul>
            {t.manageItems.map((item) => (
              <li key={item} className="mt-2 list-disc text-warm-gray pl-5">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.dntHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.dntBody}
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
