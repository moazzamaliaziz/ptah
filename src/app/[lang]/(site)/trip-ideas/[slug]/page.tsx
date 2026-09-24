import type { Metadata } from "next";
import Image from "next/image";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import TourCard from "@/components/commerce/TourCard";
import { getTripIdeaDetail, listPublishedTripIdeaSlugs, toTourListItem } from "@/server/events";
import { getSessionUser } from "@/server/auth/session";
import { toLocale } from "@/i18n/config";
import { getPageContent } from "@/i18n/pages";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const slugs = await listPublishedTripIdeaSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const idea = await getTripIdeaDetail(slug, toLocale(lang));
  if (!idea) return {};
  const canonical = `/trip-ideas/${slug}`;
  return {
    title: `${idea.metaTitle ?? idea.title} | Ptah Tours`,
    description: idea.metaDesc ?? idea.summary,
    alternates: { canonical },
    openGraph: {
      title: idea.metaTitle ?? idea.title,
      description: idea.metaDesc ?? idea.summary,
      url: canonical,
      images: (idea.ogImage ?? idea.heroImage) ? [{ url: (idea.ogImage ?? idea.heroImage) as string }] : undefined,
      type: "website",
    },
  };
}

export default async function TripIdeaDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = toLocale(lang);
  const [idea, user, pc] = await Promise.all([
    getTripIdeaDetail(slug, locale),
    getSessionUser(),
    getPageContent(locale),
  ]);
  if (!idea) notFound();
  const isAuthenticated = user !== null;
  const t = pc.tripIdeaDetail;

  return (
    <Container className="py-10">
      <Breadcrumbs
        items={[
          { label: pc.common.home, href: "/" },
          { label: t.breadcrumbTripIdeas, href: "/trip-ideas" },
          { label: idea.title },
        ]}
      />

      <div className="relative mt-5 aspect-[16/7] w-full overflow-hidden rounded-2xl bg-papyrus">
        {idea.heroImage ? (
          <Image src={idea.heroImage} alt={idea.title} fill priority sizes="(min-width: 1180px) 1100px, 100vw" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-nile/40">{t.heroFallback}</div>
        )}
      </div>

      {/* Editorial intro */}
      <div className="mx-auto mt-8 max-w-3xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">{t.eyebrow}</p>
        <h1 className="mt-2 text-section-h2 font-bold leading-tight text-ink">{idea.title}</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/75">{idea.summary}</p>
        <div className="mt-4 whitespace-pre-line text-body leading-relaxed text-ink/75">{idea.descriptionLong}</div>
      </div>

      {/* Curated tours */}
      <section className="mt-14">
        <h2 className="text-section-h2 font-bold text-ink">{t.toursHeading}</h2>
        {idea.tours.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {idea.tours.map((tour) => (
              <TourCard key={tour.slug} tour={toTourListItem(tour)} isAuthenticated={isAuthenticated} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-xl border border-grey-300/60 bg-papyrus/50 p-8 text-center">
            <p className="text-body text-ink/70">
              {t.emptyPre}{" "}
              <Link href="/contact" className="font-semibold text-rust hover:underline">{t.emptyLink}</Link>{" "}
              {t.emptyPost}
            </p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="mx-auto mt-14 max-w-3xl rounded-2xl border border-grey-300/60 bg-papyrus/40 p-6 text-center">
        <h2 className="text-card-title font-bold text-ink">{t.ctaHeading}</h2>
        <p className="mx-auto mt-2 max-w-lg text-meta text-ink/65">{t.ctaBody}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button href="/contact" variant="primary">{t.ctaPrimary}</Button>
          <Button href="/tours" variant="secondary">{t.ctaSecondary}</Button>
        </div>
      </section>
    </Container>
  );
}
