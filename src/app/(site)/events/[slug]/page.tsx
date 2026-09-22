import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import { getEventDetail, listPublishedEventSlugs } from "@/server/events";
import { env } from "@/lib/env";

// Read-only event detail (no request-time APIs) — ISR with a 5-minute window;
// generateStaticParams pre-renders known slugs, admin mutations revalidate on demand.
export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await listPublishedEventSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventDetail(slug);
  if (!event) return {};
  const canonical = `/events/${slug}`;
  return {
    title: `${event.metaTitle ?? event.title} | Ptah Tours`,
    description: event.metaDesc ?? event.summary,
    alternates: { canonical },
    openGraph: {
      title: event.metaTitle ?? event.title,
      description: event.metaDesc ?? event.summary,
      url: canonical,
      images: (event.ogImage ?? event.heroImage) ? [{ url: (event.ogImage ?? event.heroImage) as string }] : undefined,
      type: "website",
    },
  };
}

function formatDate(d: Date): string {
  return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(d);
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEventDetail(slug);
  if (!event) notFound();

  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  // Event JSON-LD (rich result). `<` escaped so it can't break out of the script.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.summary,
    startDate: event.startDate.toISOString().slice(0, 10),
    ...(event.endDate ? { endDate: event.endDate.toISOString().slice(0, 10) } : {}),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    ...(event.heroImage ? { image: `${base}${event.heroImage}` } : {}),
    ...(event.location
      ? { location: { "@type": "Place", name: event.location, address: `${event.location}, Egypt` } }
      : {}),
    organizer: { "@type": "Organization", name: "Ptah Tours", url: base },
  };
  const jsonLdString = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  return (
    <Container className="py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString }} />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Events", href: "/events" },
          { label: event.title },
        ]}
      />

      <div className="relative mt-5 aspect-[16/7] w-full overflow-hidden rounded-2xl bg-papyrus">
        {event.heroImage ? (
          <Image src={event.heroImage} alt={event.title} fill priority sizes="(min-width: 1180px) 1100px, 100vw" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-nile/40">{event.location ?? "Egypt"}</div>
        )}
      </div>

      <div className="mx-auto mt-8 max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-rust">
          {formatDate(event.startDate)}
          {event.endDate ? ` – ${formatDate(event.endDate)}` : ""}
          {event.recurring ? " · held annually" : ""}
        </p>
        <h1 className="mt-2 text-section-h2 font-bold leading-tight text-ink">{event.title}</h1>
        {event.location ? <p className="mt-2 text-body text-ink/60">{event.location}</p> : null}

        <p className="mt-6 text-body leading-relaxed text-ink/75">{event.summary}</p>
        <div className="mt-6 whitespace-pre-line text-body leading-relaxed text-ink/75">{event.description}</div>

        <div className="mt-10 rounded-2xl border border-grey-300/60 bg-papyrus/40 p-6 text-center">
          <h2 className="text-card-title font-bold text-ink">Want to be there?</h2>
          <p className="mx-auto mt-2 max-w-lg text-meta text-ink/65">
            Tell us your dates and we&apos;ll build this event into a private itinerary — guides, transfers,
            and the best vantage points sorted.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button href="/contact" variant="primary">Plan a trip around this</Button>
            <Button href="/tours" variant="secondary">Browse tours</Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
