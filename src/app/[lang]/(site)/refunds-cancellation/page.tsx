import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { getPageContent } from "@/i18n/pages";

export const metadata: Metadata = {
  title: "Refunds & Cancellation | Ptah Tours",
  description:
    "We understand that plans can shift. Here's how our cancellation and refund policy works, based on how much notice you give us.",
};

export default async function RefundsCancellationPage() {
  const pc = await getPageContent();
  const t = pc.refundsCancellation;
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
          <h3 className="font-display text-2xl text-charcoal">{t.tiersHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.tiersBody}
          </p>
          <ul>
            {t.tiersItems.map((item) => (
              <li key={item} className="mt-2 list-disc text-warm-gray pl-5">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.specialHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.specialBody}
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.processingHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.processingBody}
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.noShowHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.noShowBody}
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.forceMajeureHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.forceMajeureBody}
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
