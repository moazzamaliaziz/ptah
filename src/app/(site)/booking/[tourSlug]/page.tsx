import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import BookingForm, { type BookingDepartureOption } from "@/components/commerce/BookingForm";
import { getTourDetail } from "@/server/catalog";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tourSlug: string }>;
}): Promise<Metadata> {
  const { tourSlug } = await params;
  const tour = await getTourDetail(tourSlug);
  return {
    title: tour ? `Book ${tour.title} | Ptah Tours` : "Book | Ptah Tours",
    description: tour?.summary,
    robots: { index: false, follow: false }, // booking funnel is not indexable
  };
}

function departureLabel(start: Date, end: Date): string {
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(d);
  return start.getTime() === end.getTime() ? fmt(start) : `${fmt(start)} – ${fmt(end)}`;
}

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ tourSlug: string }>;
  searchParams: Promise<{ departure?: string }>;
}) {
  const { tourSlug } = await params;
  const { departure } = await searchParams;
  const tour = await getTourDetail(tourSlug);
  if (!tour) notFound();

  const options: BookingDepartureOption[] = tour.departures.map((d) => ({
    id: d.id,
    label: departureLabel(d.startDate, d.endDate),
    priceCents: d.priceCents,
    currency: d.currency,
    remainingCapacity: d.remainingCapacity,
  }));

  const anyBookable = options.some((o) => o.remainingCapacity > 0);

  return (
    <Container className="py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Tours", href: "/tours" },
          { label: tour.title, href: `/tours/${tour.slug}` },
          { label: "Book" },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-rust">Booking</p>
          <h1 className="mt-2 text-section-h2 font-bold text-ink">{tour.title}</h1>
          <p className="mt-3 text-body text-ink/65">{tour.summary}</p>

          <div className="mt-8">
            {anyBookable ? (
              <BookingForm departures={options} initialDepartureId={departure} />
            ) : (
              <div className="rounded-xl border border-grey-300/60 bg-papyrus/50 p-8 text-center">
                <p className="text-card-title font-semibold text-ink">No seats available right now.</p>
                <p className="mt-2 text-body text-ink/60">
                  All upcoming departures are full.{" "}
                  <Link href="/contact" className="font-semibold text-rust hover:underline">
                    Contact us
                  </Link>{" "}
                  to arrange a private date.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="lg:col-span-2">
          <div className="rounded-2xl border border-grey-300/60 bg-white p-6">
            <h2 className="text-card-title font-bold text-ink">What happens next</h2>
            <ol className="mt-4 space-y-3 text-meta text-ink/70">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-nile/10 text-[11px] font-bold text-nile">1</span>
                Pick your date and travelers, then enter your details.
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-nile/10 text-[11px] font-bold text-nile">2</span>
                Pay securely via Stripe. Your seats are held during checkout.
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-nile/10 text-[11px] font-bold text-nile">3</span>
                Get instant confirmation and a receipt by email.
              </li>
            </ol>
            <p className="mt-5 border-t border-grey-300/50 pt-4 text-[11px] text-ink/45">
              Payments are processed by Stripe. Ptah Tours never sees your card details.
            </p>
          </div>
        </aside>
      </div>
    </Container>
  );
}
