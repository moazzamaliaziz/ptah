import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Terms of Service | Ptah Tours",
  description:
    "These terms govern your use of the Ptah Tours website and any booking you make. Please read them carefully before confirming a reservation.",
};

export default function TermsOfServicePage() {
  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms of Service" }]} />

      <div className="mt-6">
        <SectionHeading
          eyebrow="Terms of Service"
          title="The rules for booking and travelling with us."
          emphasis="together."
          description="These terms govern your use of the Ptah Tours website and any booking you make. Please read them carefully before confirming a reservation."
        />
      </div>

      <div className="mt-12 max-w-none space-y-8">
        <div>
          <h3 className="font-display text-2xl text-charcoal">Booking and confirmation</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            When you place a booking through our website or with one of our team members,
            you are making an offer to purchase the services listed. We will confirm your
            booking by email, which constitutes acceptance of these terms. You must be at
            least 18 years old to make a booking.
          </p>
          <ul>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              All bookings require a valid payment method at the time of reservation
            </li>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              Confirmation is sent via email and acts as your receipt
            </li>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              Changes to your booking may be subject to availability and additional fees
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">Payment terms</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            We accept major credit cards and other payment methods displayed at checkout.
            A deposit is required to secure your booking, with the balance due no later
            than 30 days before your scheduled start date. Late payments may result in
            cancellation of the reservation without refund.
          </p>
          <ul>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              A non-refundable deposit secures your spot on the tour
            </li>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              Full balance is due 30 days before departure
            </li>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              Prices are quoted in the local currency and include applicable taxes
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">Cancellation policy</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            Our cancellation policy is tiered based on the amount of notice you provide.
            Full details are set out in our Refunds & Cancellation page. In summary,
            cancellations made more than 48 hours before departure are eligible for a full
            refund, while those made within 48 hours may incur partial or full charges.
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">Your responsibilities</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            You are responsible for ensuring you have all necessary travel documents,
            visas, vaccinations, and insurance coverage required for your destination.
            You must also adhere to the local laws and customs of the countries you visit,
            and follow all reasonable instructions given by our guides and drivers during
            the tour.
          </p>
          <ul>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              Valid passport with at least six months remaining validity
            </li>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              Required visas, vaccinations, and travel insurance
            </li>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              Compliance with local laws and guide instructions
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">Limitation of liability</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            To the fullest extent permitted by law, Ptah Tours excludes all warranties,
            representations, conditions, and terms not expressly set out in these terms.
            We shall not be liable for any indirect, incidental, special, or consequential
            damages arising out of or in connection with your use of our services, even if
            we have been advised of the possibility of such damages.
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">Force majeure</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            We are not liable for any failure or delay in performing our obligations
            under these terms where such failure or delay is caused by events beyond our
            reasonable control, including but not limited to acts of God, war, terrorism,
            riots, embargoes, government orders, natural disasters, or strikes.
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">Changes to these terms</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            We may update these terms from time to time. Any changes will be posted on
            this page with an updated effective date. Your continued use of the website
            and services after any changes constitutes acceptance of the revised terms.
            For material changes affecting an existing booking, we will notify you directly.
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
