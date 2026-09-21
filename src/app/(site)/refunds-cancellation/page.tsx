import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Refunds & Cancellation | Ptah Tours",
  description:
    "We understand that plans can shift. Here's how our cancellation and refund policy works, based on how much notice you give us.",
};

export default function RefundsCancellationPage() {
  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Refunds & Cancellation" }]} />

      <div className="mt-6">
        <SectionHeading
          eyebrow="Refunds & Cancellation"
          title="What happens if plans change."
          emphasis="here."
          description="We understand that plans can shift. Here's how our cancellation and refund policy works, based on how much notice you give us."
        />
      </div>

      <div className="mt-12 max-w-none space-y-8">
        <div>
          <h3 className="font-display text-2xl text-charcoal">Cancellation tiers</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            The amount of notice you give determines the refund you receive. All
            cancellations must be submitted in writing to our team, and refunds are
            processed within 14 business days of approval.
          </p>
          <ul>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              Cancellations made 48 hours or more before departure receive a full refund
              minus any non-refundable deposit fees.
            </li>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              Cancellations made between 24 and 48 hours before departure receive a
              partial refund of 50 percent.
            </li>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              Cancellations made less than 24 hours before departure or no-shows are not
              eligible for a refund.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">Special circumstances</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            If we need to cancel a tour due to severe weather, a guide unavailability, or
            any other operational reason, you will receive a full refund or the option to
            rebook on an alternative date. We will notify you as soon as possible if this
            situation arises.
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">Refund processing</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            Once your cancellation is approved, the refund will be credited back to the
            original payment method used at the time of booking. Please allow 5 to 10
            business days for the refund to appear on your statement, depending on your
            bank or card issuer.
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">No-shows and deposits</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            If you fail to arrive for your scheduled tour without prior notice, the
            deposit paid at the time of booking will be forfeited. The same applies to
            late arrivals that cause us to miss the scheduled departure.
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">Force majeure exceptions</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            In the event of a force majeure situation such as natural disasters,
            government travel restrictions, or civil unrest, standard cancellation
            penalties do not apply. You will be offered a full refund, a travel credit,
            or the option to rebook on a future date, depending on the circumstances.
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
