import type { Metadata } from "next";
import Image from "next/image";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import DepartureList from "@/components/commerce/DepartureList";
import GroupPriceTable from "@/components/commerce/GroupPriceTable";
import WishlistButton from "@/components/account/WishlistButton";
import { getTourDetail, listPublishedTourSlugs } from "@/server/catalog";
import { getSessionUser } from "@/server/auth/session";
import { formatPriceCents } from "@/lib/utils";
import { isSafeUrl } from "@/lib/safe-url";
import { env } from "@/lib/env";
import { toLocale } from "@/i18n/config";
import { getPageContent } from "@/i18n/pages";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await listPublishedTourSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const tour = await getTourDetail(slug, toLocale(lang));
  if (!tour) return {};
  const canonical = `/tours/${slug}`;
  return {
    title: `${tour.metaTitle ?? tour.title} | Ptah Tours`,
    description: tour.metaDesc ?? tour.summary,
    alternates: { canonical },
    openGraph: {
      title: tour.metaTitle ?? tour.title,
      description: tour.metaDesc ?? tour.summary,
      url: canonical,
      images: tour.ogImage ?? tour.heroImage ? [{ url: (tour.ogImage ?? tour.heroImage) as string }] : undefined,
      type: "website",
    },
  };
}

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = toLocale(lang);
  const [tour, user, pc] = await Promise.all([
    getTourDetail(slug, locale),
    getSessionUser(),
    getPageContent(locale),
  ]);
  if (!tour) notFound();
  const isAuthenticated = user !== null;
  const t = pc.tourDetail;
  const difficultyLabels: Record<string, string> = {
    EASY: t.difficultyEasy,
    MODERATE: t.difficultyModerate,
    CHALLENGING: t.difficultyChallenging,
  };

  const cheapestDeparture = tour.departures.reduce<number | null>(
    (min, d) => (min === null || d.priceCents < min ? d.priceCents : min),
    null,
  );
  const fromPriceCents = cheapestDeparture ?? tour.basePriceCents;
  const hasBookable = tour.departures.some((d) => !d.soldOut);
  // Online booking can be paused tour-wide (bookingClosed) even when seats remain.
  // canBookNow gates the "book now" affordances; hasBookable still governs whether
  // any seats physically exist (used for the paused-notice wording below).
  const canBookNow = !tour.bookingClosed && hasBookable;

  // TouristTrip JSON-LD (Q15). `<` escaped to prevent breaking out of the script.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.title,
    description: tour.summary,
    ...(tour.heroImage ? { image: `${env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "")}${tour.heroImage}` } : {}),
    touristType: "Cultural, sightseeing",
    itinerary: {
      "@type": "ItemList",
      itemListElement: tour.itinerary.map((day) => ({
        "@type": "ListItem",
        position: day.dayNumber,
        item: { "@type": "TouristAttraction", name: day.title, description: day.description },
      })),
    },
    offers: {
      "@type": "Offer",
      price: (fromPriceCents / 100).toFixed(2),
      priceCurrency: tour.currency,
      availability: canBookNow ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
    },
  };
  const jsonLdString = JSON.stringify(jsonLd).replace(/</g, "\\u003c");

  // FAQPage JSON-LD (Q&A rich result) — only when the editor supplied FAQs.
  const faqJsonLdString =
    tour.faqs.length > 0
      ? JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: tour.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }).replace(/</g, "\\u003c")
      : null;

  // Custom detail-page CTA (D3): shows only when the editor set both fields and
  // the href passes the scheme allowlist (defense-in-depth — also checked at the
  // admin boundary). Falls back to the default book/enquire buttons otherwise.
  const customCta =
    tour.ctaLabel && tour.ctaHref && isSafeUrl(tour.ctaHref)
      ? { label: tour.ctaLabel, href: tour.ctaHref }
      : null;

  return (
    <Container className="py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString }} />
      {faqJsonLdString ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLdString }} />
      ) : null}

      <Breadcrumbs
        items={[
          { label: pc.common.home, href: "/" },
          { label: t.breadcrumbTours, href: "/tours" },
          ...(tour.destinations[0]
            ? [{ label: tour.destinations[0].name, href: `/tours?destination=${tour.destinations[0].slug}` }]
            : []),
          { label: tour.title },
        ]}
      />

      {/* Hero image */}
      <div className="relative mt-5 aspect-[16/7] w-full overflow-hidden rounded-2xl bg-papyrus">
        {tour.heroImage ? (
          <Image src={tour.heroImage} alt={tour.title} fill priority sizes="(min-width: 1180px) 1100px, 100vw" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-nile/40">
            {tour.destinations.map((d) => d.name).join(" · ") || t.heroFallback}
          </div>
        )}
      </div>

      {/* Gallery — additional views of the tour (hidden when none). */}
      {tour.gallery.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {tour.gallery.map((src, i) => (
            <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-papyrus">
              <Image
                src={src}
                alt={t.galleryAlt.replace("{title}", tour.title).replace("{n}", String(i + 2))}
                fill
                sizes="(min-width: 1180px) 360px, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2">
          {tour.destinations.length > 0 && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-rust">
              {tour.destinations.map((d) => d.name).join(" · ")}
            </p>
          )}
          <h1 className="mt-2 text-section-h2 font-bold leading-tight text-ink">{tour.title}</h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-meta text-ink/60">
            <span>
              {tour.durationDays} {tour.durationDays === 1 ? t.dayUnit : t.daysUnit}
            </span>
            <span aria-hidden>·</span>
            <span>{difficultyLabels[tour.difficulty] ?? tour.difficulty}</span>
            <span aria-hidden>·</span>
            <span>{t.upcomingDepartures.replace("{count}", String(tour.departures.length))}</span>
          </div>

          <section className="mt-8">
            <h2 className="text-card-title font-bold text-ink">{t.overview}</h2>
            <p className="mt-3 whitespace-pre-line text-body leading-relaxed text-ink/75">
              {tour.descriptionLong}
            </p>
          </section>

          {tour.itinerary.length > 0 && (
            <section className="mt-10">
              <h2 className="text-card-title font-bold text-ink">{t.itinerary}</h2>
              <div className="mt-4 space-y-3">
                {tour.itinerary.map((day) => (
                  <div
                    key={day.dayNumber}
                    className="flex gap-4 rounded-xl border border-grey-300/60 bg-white p-5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-nile/10 text-meta font-bold text-nile">
                      {day.dayNumber}
                    </span>
                    <div>
                      <p className="font-semibold text-ink">{day.title}</p>
                      <p className="mt-1 text-meta leading-relaxed text-ink/65">{day.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(tour.inclusions.length > 0 || tour.exclusions.length > 0) && (
            <section className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {tour.inclusions.length > 0 && (
                <div>
                  <h2 className="text-card-title font-bold text-ink">{t.included}</h2>
                  <ul className="mt-3 space-y-2">
                    {tour.inclusions.map((item) => (
                      <li key={item} className="flex gap-2.5 text-meta text-ink/75">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-nile" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {tour.exclusions.length > 0 && (
                <div>
                  <h2 className="text-card-title font-bold text-ink">{t.notIncluded}</h2>
                  <ul className="mt-3 space-y-2">
                    {tour.exclusions.map((item) => (
                      <li key={item} className="flex gap-2.5 text-meta text-ink/55">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-grey-300" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* Travel notes — practical prep (visa, packing, health). Hidden when empty. */}
          {tour.travelNotes.length > 0 && (
            <section className="mt-10">
              <h2 className="text-card-title font-bold text-ink">{t.goodToKnow}</h2>
              <ul className="mt-3 space-y-2">
                {tour.travelNotes.map((note) => (
                  <li key={note} className="flex gap-2.5 text-meta text-ink/75">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rust" />
                    {note}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Availability */}
          <section id="availability" className="mt-10 scroll-mt-28">
            <h2 className="text-card-title font-bold text-ink">{t.availability}</h2>
            <p className="mt-1 text-meta text-ink/60">{t.availabilityIntro}</p>
            {tour.bookingClosed ? (
              <p className="mt-4 rounded-xl border border-gold/40 bg-gold/5 p-4 text-meta text-ink/75">
                {t.bookingPausedNotice}
              </p>
            ) : null}
            <div className="mt-4">
              <DepartureList
                tourSlug={tour.slug}
                departures={tour.departures}
                labels={t.departureList}
                bookingClosed={tour.bookingClosed}
                onRequestDates={tour.onRequestDates}
              />
            </div>
          </section>

          {/* Price per person by group size — only for tours that have bands. */}
          <GroupPriceTable
            tiers={tour.priceTiers}
            currency={tour.currency}
            labels={t.groupPricing}
            className="mt-10 rounded-2xl border border-grey-300/60 bg-white p-6"
          />

          {/* FAQs — hidden when the editor supplied none. */}
          {tour.faqs.length > 0 && (
            <section className="mt-10">
              <h2 className="text-card-title font-bold text-ink">{t.faqHeading}</h2>
              <div className="mt-4 space-y-3">
                {tour.faqs.map((faq) => (
                  <details
                    key={faq.q}
                    className="group rounded-xl border border-grey-300/60 bg-white p-5 [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold text-ink">
                      {faq.q}
                      <span
                        aria-hidden
                        className="text-nile/50 transition-transform group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-2 whitespace-pre-line text-meta leading-relaxed text-ink/65">
                      {faq.a}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sticky booking summary */}
        <aside className="lg:col-span-1">
          <div className="sticky top-28 rounded-2xl border border-grey-300/60 bg-white p-6 shadow-[0_18px_44px_-28px_rgba(26,35,64,0.4)]">
            <p className="text-[11px] uppercase tracking-wide text-ink/50">{t.fromLabel}</p>
            <p className="mt-0.5 text-2xl font-bold text-nile">
              {formatPriceCents(fromPriceCents, tour.currency)}
              <span className="text-[13px] font-normal text-ink/50"> {t.perPerson}</span>
            </p>

            <dl className="mt-5 space-y-2.5 border-t border-grey-300/50 pt-5 text-meta">
              <div className="flex justify-between">
                <dt className="text-ink/55">{t.durationLabel}</dt>
                <dd className="text-ink">
                  {tour.durationDays} {tour.durationDays === 1 ? t.dayUnit : t.daysUnit}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/55">{t.difficultyLabel}</dt>
                <dd className="text-ink">{difficultyLabels[tour.difficulty] ?? tour.difficulty}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/55">{t.departuresLabel}</dt>
                <dd className="text-ink">{t.upcomingCount.replace("{count}", String(tour.departures.length))}</dd>
              </div>
            </dl>

            <div className="mt-6 space-y-3">
              {canBookNow ? (
                <Link
                  href="#availability"
                  className="block w-full rounded-full bg-nile px-6 py-3.5 text-center text-btn text-white transition-colors hover:bg-nile/90"
                >
                  {t.seeDatesBook}
                </Link>
              ) : (
                <Link
                  href="/contact"
                  className="block w-full rounded-full border border-nile/25 px-6 py-3.5 text-center text-btn text-nile transition-colors hover:border-nile"
                >
                  {t.enquireDates}
                </Link>
              )}
              {customCta ? (
                <Link
                  href={customCta.href}
                  className="block w-full rounded-full border border-gold/40 px-6 py-3 text-center text-btn text-rust transition-colors hover:border-gold hover:bg-gold/5"
                >
                  {customCta.label}
                </Link>
              ) : null}
            </div>
            <div className="mt-3 flex justify-center">
              <WishlistButton slug={tour.slug} isAuthenticated={isAuthenticated} variant="labelled" />
            </div>
            <p className="mt-3 text-center text-[11px] text-ink/45">
              {t.paymentNote}
            </p>
          </div>
        </aside>
      </div>
    </Container>
  );
}
