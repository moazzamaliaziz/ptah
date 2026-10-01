import type { JSX } from "react";
import Image from "next/image";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { getAllBlogPosts, formatBlogDate } from "@/content/blog";
import { getPageContent } from "@/i18n/pages";
import type { Locale } from "@/i18n/config";

/**
 * Landing section — "The Journal" blog grid (replaces the DB-backed Stories
 * carousel at the foot of the landing, design decision A).
 *
 * Server component. Reads the static blog catalog directly via getAllBlogPosts()
 * — the same source the /blog index uses — so new posts added to the content
 * SSOT surface here without a DB reseed. Shows the six most recent posts in the
 * same card pattern as /blog, then links through to the full journal.
 */
export default async function LandingJournal({ locale }: { locale: Locale }): Promise<JSX.Element> {
  const [pc, allPosts] = await Promise.all([getPageContent(locale), getAllBlogPosts(locale)]);
  const t = pc.blog;
  const posts = allPosts.slice(0, 6);

  return (
    <section
      className="section-shell"
      style={{ marginTop: "var(--section-margin)" }}
      aria-labelledby="landing-journal-heading"
    >
      <header className="max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">{t.eyebrow}</p>
        <h2 id="landing-journal-heading" className="mt-2 text-section-h2 font-bold text-ink">
          {t.heading}
        </h2>
        <p className="mt-4 text-body leading-relaxed text-ink/70">{t.intro}</p>
      </header>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={post.href}
            className="group flex flex-col overflow-hidden rounded-xl border border-grey-300/60 bg-white transition-shadow duration-200 hover:shadow-[0_18px_44px_-24px_rgba(26,35,64,0.45)]"
          >
            <div className="relative aspect-[3/2] w-full overflow-hidden bg-papyrus">
              {post.image.src ? (
                <Image
                  src={post.image.src}
                  alt={post.image.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-meta text-nile/40">
                  {t.heroFallback}
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-trip-h3 font-semibold text-ink transition-colors group-hover:text-rust">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-meta text-ink/65">{post.summary}</p>
              <p className="mt-4 text-meta text-ink/50">
                {formatBlogDate(post.publishedISO, locale)} · {post.readMinutes} {t.minRead}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <Link className="pill pill--outline" href="/blog">
          {pc.landing.journalCta}
        </Link>
      </div>
    </section>
  );
}
