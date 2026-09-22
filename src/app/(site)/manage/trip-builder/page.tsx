import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import TripBuilder from "@/components/trip/TripBuilder";
import { listPublishedTours } from "@/server/catalog";
import { getSessionUser } from "@/server/auth/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trip Builder | Ptah Tours",
  description:
    "Build your Egypt trip: bookmark the tours you like, gather them in one place, and send us your shortlist to shape into a single private itinerary.",
  alternates: { canonical: "/manage/trip-builder" },
};

export default async function TripBuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const [{ tab }, tours, user] = await Promise.all([
    searchParams,
    listPublishedTours(),
    getSessionUser(),
  ]);
  const initialTab = tab === "bookmarks" ? "bookmarks" : "plan";

  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Trip builder" }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">Plan with us</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">Trip builder</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">
          Your Egypt trip starts as a shortlist. Save the tours that speak to you, review them here, and
          we&apos;ll weave them into one private journey.
        </p>
      </header>

      <div className="mt-12">
        <TripBuilder tours={tours} isAuthenticated={user !== null} initialTab={initialTab} />
      </div>
    </Container>
  );
}
