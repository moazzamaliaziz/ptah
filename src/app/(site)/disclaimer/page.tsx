import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Disclaimer | Ptah Tours",
  description:
    "The content on the Ptah Tours website is provided for general information purposes only. While we strive for accuracy, we cannot guarantee completeness or timeliness.",
};

export default function DisclaimerPage() {
  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Disclaimer" }]} />

      <div className="mt-6">
        <SectionHeading
          eyebrow="Disclaimer"
          title="Information on this site is provided"
          emphasis="as-is."
          description="The content on the Ptah Tours website is provided for general information purposes only. While we strive for accuracy, we cannot guarantee completeness or timeliness."
        />
      </div>

      <div className="mt-12 max-w-none space-y-8">
        <div>
          <h3 className="font-display text-2xl text-charcoal">Website content accuracy</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            While we endeavor to ensure that the information on this website is accurate
            and up to date, we make no representations or warranties of any kind, express
            or implied, about the completeness, accuracy, reliability, or availability of
            the content. Any reliance you place on the information is strictly at your
            own risk.
          </p>
          <ul>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              Tour descriptions and itineraries are subject to change
            </li>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              Activity details may be modified for safety or operational reasons
            </li>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              We do not guarantee that the website will be uninterrupted or error-free
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">Pricing and availability</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            All prices displayed on our website are subject to availability and may change
            without notice. We reserve the right to adjust prices due to currency
            fluctuations, seasonal demand, or supplier cost changes. Availability is
            confirmed only upon receipt of your deposit and our written confirmation.
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">Third-party links</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            Our website may contain links to external websites, services, or third-party
            content that are not owned or controlled by Ptah Tours. We have no control
            over and assume no responsibility for the content, privacy policies, or practices
            of any third-party sites.
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">User-generated content</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            Visitors may be able to submit reviews, comments, or other content to our
            website. We do not endorse or verify the accuracy of user-generated content
            and are not responsible for any content posted by users. We reserve the right
            to remove any content at our sole discretion.
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">Limitation of liability</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            To the fullest extent permitted by law, Ptah Tours, its directors, employees,
            partners, and agents exclude all liability for any direct, indirect, incidental,
            special, or consequential loss or damage arising out of or in connection with
            your use of the website or services.
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">Governing law</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            These terms and any dispute arising from your use of this website or our
            services shall be governed by and construed in accordance with the laws of
            Egypt, without regard to its conflict of law principles. Any legal action or
            proceeding shall be subject to the exclusive jurisdiction of the courts in
            Cairo, Egypt.
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
