import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { listPublishedEvents } from "@/server/events";

export const metadata: Metadata = {
  title: "Egypt Events & Festivals | Ptah Tours",
  description:
    "Time your trip around Egypt's cultural calendar — the Abu Simbel Sun Festival, moulids, and seasonal celebrations. Curated by the Cairo team at Ptah Tours.",
  alternates: { canonical: "/events" },
};

// Read-only editorial catalog (no request-time APIs) — ISR with a 5-minute
// window; admin mutations revalidate /events on demand for freshness.
export const revalidate = 300;

function formatDateRange(start: Date, end: Date | null, recurring: boolean): string {
  const fmt = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", timeZone: "UTC" });
  const fmtYear = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
  if (recurring) {
    // Annual festival — show month/day only (the year repeats).
    return end ? `${fmt.format(start)} – ${fmt.format(end)} · annual` : `${fmt.format(start)} · annual`;
  }
  return end ? `${fmt.format(start)} – ${fmtYear.format(end)}` : fmtYear.format(start);
}

export default async function EventsPage() {
  const events = await listPublishedEvents();

  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Events" }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">Events &amp; festivals</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">Egypt&apos;s cultural calendar</h1>
        <p className="mt-3 text-body text-ink/65">
          From the twice-yearly sun alignment at Abu Simbel to local moulids and seasonal celebrations,
          these are the moments worth planning a trip around. Ask us to build any of them into your itinerary.
        </p>
      </header>

      <div className="mt-10">
        {events.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <article
                key={e.slug}
                className="group flex flex-col overflow-hidden rounded-xl border border-grey-300/60 bg-white transition-shadow duration-200 hover:shadow-[0_18px_44px_-24px_rgba(26,35,64,0.45)]"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-papyrus">
                  {e.heroImage ? (
                    <Image
                      src={e.heroImage}
                      alt={e.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-meta text-nile/40">
                      {e.location ?? "Egypt"}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-rust">
                    {formatDateRange(e.startDate, e.endDate, e.recurring)}
                  </p>
                  <h2 className="mt-1.5 text-trip-h3 font-semibold text-ink transition-colors group-hover:text-rust">
                    <Link href={`/events/${e.slug}`} className="after:absolute after:inset-0 after:content-['']">
                      {e.title}
                    </Link>
                  </h2>
                  {e.location ? <p className="mt-1 text-meta text-ink/55">{e.location}</p> : null}
                  <p className="mt-2 line-clamp-3 text-meta text-ink/65">{e.summary}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-grey-300/60 bg-papyrus/50 p-10 text-center">
            <p className="text-card-title font-semibold text-ink">No events published yet.</p>
            <p className="mt-2 text-body text-ink/60">
              Check back soon, or{" "}
              <Link href="/contact" className="font-semibold text-rust hover:underline">ask us</Link>{" "}
              what&apos;s happening during your travel dates.
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}
