import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { getSetting } from "@/server/settings";

export const metadata: Metadata = {
  title: "Privacy Policy | Ptah Tours",
  description:
    "Ptah Tours is committed to protecting your personal data. This policy explains what we collect, why we collect it, and how you can control it.",
};

export default async function PrivacyPolicyPage() {
  // DB-driven canonical contact address (Phase 7 S3) — resolves the legacy
  // privacy@ptah-tours.com typo; falls back to hello@ptahtours.com when unset.
  const contactEmail = (await getSetting("contact.email")) || "hello@ptahtours.com";
  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />

      <div className="mt-6">
        <SectionHeading
          eyebrow="Privacy Policy"
          title="How we handle your information."
          emphasis="transparently."
          description="Ptah Tours is committed to protecting your personal data. This policy explains what we collect, why we collect it, and how you can control it."
        />
      </div>

      <div className="mt-12 max-w-none space-y-8">
        <div>
          <h3 className="font-display text-2xl text-charcoal">What data we collect</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            We collect information you provide directly to us when you book a tour,
            subscribe to our newsletter, or contact us. This includes your name, email
            address, phone number, travel dates, and any special requirements you share
            with us. We also automatically collect browsing information such as your IP
            address, browser type, and pages visited through cookies and similar tracking
            technologies.
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">How we use your data</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            We use your information to process and manage your bookings, communicate with
            you about your tours, send administrative updates, and improve our website and
            services. We may also use aggregated, anonymized data for analytics and
            marketing insights to better understand how our visitors engage with the site.
          </p>
          <ul>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              Itinerary planning and booking management
            </li>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              Targeted communications and service updates
            </li>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              Website analytics and performance improvement
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">Data sharing and disclosure</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            We do not sell your personal data. We share information only with our trusted
            partners when necessary to fulfill your bookings such as local guides, drivers,
            accommodations, and transport providers in your destination. We may also
            disclose your data if required by law, to protect our rights and safety, or
            to respond to valid legal requests.
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">Data retention</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            We retain your personal information for as long as necessary to provide our
            services, comply with legal obligations, resolve disputes, and enforce our
            agreements. Booking records are retained for at least seven years to comply
            with accounting and tax regulations.
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">Cookies and tracking</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            Our website uses essential cookies to enable core functionality and improve
            your browsing experience. You can control and manage cookies through your
            browser settings. For more details, please see our separate Cookie Policy.
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">Your rights</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            You have the right to access, correct, or delete your personal data held by
            us. You may also request to restrict or object to certain processing activities.
            To make a data request or to unsubscribe from marketing communications, contact
            us using the details below and we will respond within a reasonable timeframe.
          </p>
          <ul>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              Request access to the personal data we hold about you
            </li>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              Request correction of inaccurate or incomplete information
            </li>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              Request deletion of your data where retention is no longer necessary
            </li>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              Object to or restrict certain uses of your information
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">Contact us</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            If you have any questions about this Privacy Policy or how we handle your
            personal data, please contact us at{" "}
            <a
              href={`mailto:${contactEmail}`}
              className="text-burgundy underline hover:text-burgundy-dark"
            >
              {contactEmail}
            </a>
            . We will respond to your inquiry as soon as possible.
          </p>
        </div>
      </div>

      <div className="mt-12">
        <Button href="/" variant="secondary">
          Back to home
        </Button>
      </div>
    </Container>
  );
}
