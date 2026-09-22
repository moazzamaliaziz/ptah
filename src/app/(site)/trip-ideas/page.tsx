import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { listPublishedTripIdeas } from "@/server/events";

export const metadata: Metadata = {
  title: "Trip Ideas | Ptah Tours",
  description:
    "Not sure where to start? Browse Ptah Tours' curated Egypt trip ideas — Nile cruises, family journeys, honeymoons, and more — each pairing an editorial guide with hand-picked tours.",
  alternates: { canonical: "/trip-ideas" },
};

// Read-only editorial catalog (no request-time APIs) — ISR with a 5-minute
// window; admin mutations revalidate /trip-ideas on demand for freshness.
export const revalidate = 300;

export default async function TripIdeasPage() {
  const ideas = await listPublishedTripIdeas();

  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Trip ideas" }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">Trip ideas</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">Ways to see Egypt</h1>
        <p className="mt-3 text-body text-ink/65">
          Every traveler is different. These are our favorite ways into Egypt — each one a short guide
          paired with the real tours that bring it to life.
        </p>
      </header>

      <div className="mt-10">
        {ideas.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ideas.map((idea) => (
              <article
                key={idea.slug}
                className="group flex flex-col overflow-hidden rounded-xl border border-grey-300/60 bg-white transition-shadow duration-200 hover:shadow-[0_18px_44px_-24px_rgba(26,35,64,0.45)]"
              >
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-papyrus">
                  {idea.heroImage ? (
                    <Image
                      src={idea.heroImage}
                      alt={idea.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-meta text-nile/40">Egypt</div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-trip-h3 font-semibold text-ink transition-colors group-hover:text-rust">
                    <Link href={`/trip-ideas/${idea.slug}`} className="after:absolute after:inset-0 after:content-['']">
                      {idea.title}
                    </Link>
                  </h2>
                  <p className="mt-2 line-clamp-3 text-meta text-ink/65">{idea.summary}</p>
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-ink/45">
                    {idea.tourCount} {idea.tourCount === 1 ? "tour" : "tours"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-grey-300/60 bg-papyrus/50 p-10 text-center">
            <p className="text-card-title font-semibold text-ink">No trip ideas published yet.</p>
            <p className="mt-2 text-body text-ink/60">
              In the meantime,{" "}
              <Link href="/tours" className="font-semibold text-rust hover:underline">browse every tour</Link>.
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}
