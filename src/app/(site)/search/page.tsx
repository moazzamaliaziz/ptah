import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import TourCard from "@/components/commerce/TourCard";
import { searchPublishedTours } from "@/server/catalog";
import { getSessionUser } from "@/server/auth/session";

/* On-site search results are per-query and thin — never index them (Google's
   own guidance), but the homepage WebSite `SearchAction` still resolves here so
   the sitelinks searchbox works. */
export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

// Results depend on the `term` query param and live catalog state.
export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ term?: string }>;
}) {
  const { term } = await searchParams;
  const query = (term ?? "").trim();

  const [results, user] = await Promise.all([
    searchPublishedTours(query),
    getSessionUser(),
  ]);
  const isAuthenticated = user !== null;

  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">Search</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">
          {query ? `Results for “${query}”` : "Search Ptah Tours"}
        </h1>
        <p className="mt-3 text-body text-ink/65">
          {query
            ? `${results.length} ${results.length === 1 ? "tour" : "tours"} match your search.`
            : "Search our journeys by name, destination, or theme."}
        </p>
      </header>

      {/* Plain GET form — shareable result URLs, no client JS required. */}
      <form action="/search" method="get" role="search" className="mt-8 flex max-w-xl gap-2">
        <input
          type="search"
          name="term"
          defaultValue={query}
          aria-label="Search trips and destinations"
          placeholder="Pyramids, Nile cruise, Alexandria…"
          autoComplete="off"
          className="min-w-0 flex-1 rounded-full border border-grey-300/70 px-5 py-2.5 text-body text-ink outline-none focus-visible:border-nile focus-visible:ring-2 focus-visible:ring-nile/30"
        />
        <button
          type="submit"
          className="rounded-full bg-nile px-6 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-nile/90"
        >
          Search
        </button>
      </form>

      <div className="mt-10">
        {query && results.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((tour) => (
              <TourCard key={tour.slug} tour={tour} isAuthenticated={isAuthenticated} />
            ))}
          </div>
        ) : query ? (
          <div className="rounded-xl border border-grey-300/60 bg-papyrus/50 p-10 text-center">
            <p className="text-card-title font-semibold text-ink">No tours match “{query}”.</p>
            <p className="mt-2 text-body text-ink/60">
              Try a broader term, or{" "}
              <Link href="/tours" className="font-semibold text-rust hover:underline">
                browse every tour
              </Link>
              .
            </p>
          </div>
        ) : null}
      </div>
    </Container>
  );
}
