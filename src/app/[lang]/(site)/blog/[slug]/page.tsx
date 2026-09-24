import type { Metadata } from "next";
import Image from "next/image";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import { getBlogPost, blogSlugs, formatBlogDate } from "@/content/blog";
import { toLocale } from "@/i18n/config";
import { getPageContent } from "@/i18n/pages";

export function generateStaticParams() {
  return blogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  const canonical = `/blog/${slug}`;
  return {
    title: `${post.title} | Ptah Tours Journal`,
    description: post.summary,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.summary,
      url: canonical,
      images: post.image.src ? [{ url: post.image.src }] : undefined,
      type: "article",
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();
  const pc = await getPageContent(toLocale(lang));
  const t = pc.blogDetail;

  return (
    <Container className="py-10">
      <Breadcrumbs
        items={[
          { label: pc.common.home, href: "/" },
          { label: t.breadcrumbJournal, href: "/blog" },
          { label: post.title },
        ]}
      />

      <div className="relative mt-5 aspect-[16/7] w-full overflow-hidden rounded-2xl bg-papyrus">
        {post.image.src ? (
          <Image src={post.image.src} alt={post.image.alt} fill priority sizes="(min-width: 1180px) 1100px, 100vw" className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-nile/40">{t.heroFallback}</div>
        )}
      </div>

      <article className="mx-auto mt-8 max-w-3xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">{t.eyebrow}</p>
        <h1 className="mt-2 text-section-h2 font-bold leading-tight text-ink">{post.title}</h1>
        <p className="mt-3 text-meta text-ink/55">
          {t.byPrefix} {post.author} · {formatBlogDate(post.publishedISO)} · {post.readMinutes} {t.minRead}
        </p>
        <p className="mt-6 text-body font-medium leading-relaxed text-ink/80">{post.summary}</p>

        <div className="mt-6 space-y-5">
          {post.body.map((block, i) =>
            block.kind === "h2" ? (
              <h2 key={i} className="text-card-title font-bold text-ink">{block.text}</h2>
            ) : (
              <p key={i} className="text-body leading-relaxed text-ink/75">{block.text}</p>
            ),
          )}
        </div>

        <p className="mt-8 text-meta text-ink/45">{t.imageCreditPrefix} {post.credit}</p>
      </article>

      <section className="mx-auto mt-14 max-w-3xl rounded-2xl border border-grey-300/60 bg-papyrus/40 p-6 text-center">
        <h2 className="text-card-title font-bold text-ink">{t.ctaHeading}</h2>
        <p className="mx-auto mt-2 max-w-lg text-meta text-ink/65">{t.ctaBody}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button href="/tours" variant="primary">{t.ctaPrimary}</Button>
          <Button href="/contact" variant="secondary">{t.ctaSecondary}</Button>
        </div>
        <p className="mt-6 text-meta text-ink/55">
          <Link href="/blog" className="font-semibold text-rust hover:underline">{t.backToJournal}</Link>
        </p>
      </section>
    </Container>
  );
}
