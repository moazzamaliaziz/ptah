import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Cookie Policy | Ptah Tours",
  description:
    "This cookie policy explains what cookies and similar tracking technologies we use, why we use them, and how you can control them.",
};

export default function CookiePolicyPage() {
  return (
    <Container className="py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cookie Policy" }]} />

      <div className="mt-6">
        <SectionHeading
          eyebrow="Cookie Policy"
          title="How we use cookies and tracking."
          emphasis="technologies."
          description="This cookie policy explains what cookies and similar tracking technologies we use, why we use them, and how you can control them."
        />
      </div>

      <div className="mt-12 max-w-none space-y-8">
        <div>
          <h3 className="font-display text-2xl text-charcoal">What are cookies?</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            Cookies are small text files stored on your device when you visit a website.
            They help websites remember information about your visit, such as your language
            preference or login status. We also use similar tracking technologies such as
            web beacons, pixels, and local storage.
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">Types of cookies we use</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            We categorize our cookies based on their purpose:
          </p>
          <ul>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              Essential cookies — necessary for core website functionality, such as
              maintaining your session and securing your account.
            </li>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              Performance cookies — collect anonymous data about how visitors use our site,
              helping us understand which pages are popular and optimize performance.
            </li>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              Functional cookies — remember your preferences, such as language, region,
              and display settings, to provide enhanced personalization.
            </li>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              Targeting cookies — used by our advertising partners to deliver relevant ads
              based on your interests and browsing behavior.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">Third-party cookies</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            We work with trusted third parties who may set cookies on our site, including
            analytics providers like Google Analytics and advertising networks. These
            third parties have their own privacy and cookie policies governing their use of
            cookies. We are not responsible for the cookie practices of these parties.
          </p>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">How to manage cookies</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            You can control and manage cookies through your browser settings. Most browsers
            allow you to view, disable, or delete cookies. Please note that disabling
            essential cookies may impact the functionality of our site.
          </p>
          <ul>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              Browser cookie settings — adjust your preferences in Chrome, Firefox, Safari,
              or Edge.
            </li>
            <li className="mt-2 list-disc text-warm-gray pl-5">
              Opt-out tools — use industry platforms like the Network Advertising Initiative
              or the Digital Advertising Alliance.
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-2xl text-charcoal">Do Not Track signals</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
            Some browsers transmit Do Not Track signals to websites. Our site does not
            currently respond to these signals, but you can manage your cookie preferences
            directly through your browser settings as described above.
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
