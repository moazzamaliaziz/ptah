import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { getSetting } from "@/server/settings";
import { getPageContent } from "@/i18n/pages";

export const metadata: Metadata = {
  title: "Privacy Policy | Ptah Tours",
  description:
    "Ptah Tours is committed to protecting your personal data. This policy explains what we collect, why we collect it, and how you can control it.",
};

export default async function PrivacyPolicyPage() {
  // DB-driven canonical contact address (Phase 7 S3) — resolves the legacy
  // privacy@ptah-tours.com typo; falls back to hello@ptahtours.com when unset.
  const contactEmail = (await getSetting("contact.email")) || "hello@ptahtours.com";
  const pc = await getPageContent();
  const t = pc.privacyPolicy;
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
          <h3 className="font-display text-2xl text-charcoal">{t.collectHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.collectBody}
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.useHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.useBody}
          </p>
          <ul>
            {t.useItems.map((item) => (
              <li key={item} className="mt-2 list-disc text-warm-gray pl-5">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.sharingHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.sharingBody}
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.retentionHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.retentionBody}
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.cookiesHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.cookiesBody}
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.rightsHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.rightsBody}
          </p>
          <ul>
            {t.rightsItems.map((item) => (
              <li key={item} className="mt-2 list-disc text-warm-gray pl-5">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">{t.contactHeading}</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            {t.contactPre}{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-burgundy underline hover:text-burgundy-dark"
            >
              {contactEmail}
            </a>
            {t.contactPost}
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
