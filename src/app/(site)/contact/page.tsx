import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ContactForm from "@/components/marketing/ContactForm";
import { getSettings } from "@/server/settings";
import { normalizePhone } from "@/lib/safe-url";

export const metadata: Metadata = {
  title: "Contact | Ptah Tours",
  description:
    "Get in touch with the Ptah Tours team in Cairo. Ask about a tour, plan a custom itinerary, or get help with an existing booking — we usually reply within one business day.",
  alternates: { canonical: "/contact" },
};

// Reads DB-backed contact settings (admin-editable), so render dynamically.
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSettings();
  const email = settings["contact.email"] || "hello@ptahtours.com";
  const phone = settings["contact.phone"];
  const whatsapp = settings["contact.whatsapp"];
  const telHref = phone ? normalizePhone(phone) : "";
  const waDigits = whatsapp ? normalizePhone(whatsapp).replace(/^\+/, "") : "";

  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">Contact</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">Let&apos;s plan your Egypt trip</h1>
        <p className="mt-3 text-body text-ink/65">
          Questions about a tour, a custom itinerary, or an existing booking? Send us a note and the
          Cairo team will get back to you — usually within one business day.
        </p>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          <ContactForm />
        </div>

        {/* Contact details */}
        <aside className="lg:col-span-1">
          <div className="rounded-2xl border border-grey-300/60 bg-papyrus/40 p-6">
            <h2 className="text-card-title font-bold text-ink">Reach us directly</h2>
            <dl className="mt-4 space-y-4 text-body">
              <div>
                <dt className="text-meta uppercase tracking-wide text-ink/50">Email</dt>
                <dd className="mt-0.5">
                  <a href={`mailto:${email}`} className="font-semibold text-nile hover:underline">{email}</a>
                </dd>
              </div>
              {phone && telHref ? (
                <div>
                  <dt className="text-meta uppercase tracking-wide text-ink/50">Phone</dt>
                  <dd className="mt-0.5">
                    <a href={`tel:${telHref}`} className="font-semibold text-nile hover:underline">{phone}</a>
                  </dd>
                </div>
              ) : null}
              {waDigits ? (
                <div>
                  <dt className="text-meta uppercase tracking-wide text-ink/50">WhatsApp</dt>
                  <dd className="mt-0.5">
                    <a
                      href={`https://wa.me/${waDigits}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-nile hover:underline"
                    >
                      Message us on WhatsApp
                    </a>
                  </dd>
                </div>
              ) : null}
              <div>
                <dt className="text-meta uppercase tracking-wide text-ink/50">Office</dt>
                <dd className="mt-0.5 text-ink/75">Cairo, Egypt</dd>
              </div>
            </dl>
            <p className="mt-6 text-meta leading-relaxed text-ink/55">
              Prefer to browse first? Explore our{" "}
              <a href="/tours" className="font-semibold text-rust hover:underline">tours</a> or get
              inspired by our{" "}
              <a href="/trip-ideas" className="font-semibold text-rust hover:underline">trip ideas</a>.
            </p>
          </div>
        </aside>
      </div>
    </Container>
  );
}
