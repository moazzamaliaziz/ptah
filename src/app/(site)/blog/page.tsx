import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/layout/Container";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { getAllBlogPosts, formatBlogDate } from "@/content/blog";

export const metadata: Metadata = {
  title: "The Ptah Tours Journal | Stories from Egypt",
  description:
    "Field notes and travel stories from our team in Egypt — Cairo beyond the guidebook, an evening at Karnak, Alexandria's Mediterranean soul, Red Sea reef etiquette, and slow days on the Nile.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();
  const [lead, ...rest] = posts;

  return (
    <Container className="py-14">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Journal" }]} />

      <header className="mt-6 max-w-2xl">
        <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">The journal</p>
        <h1 className="mt-2 text-section-h2 font-bold text-ink">Stories from Egypt</h1>
        <p className="mt-4 text-body leading-relaxed text-ink/70">
          Field notes from our team on the ground — the places we send travelers, the ones we keep for
          ourselves, and how to get the most out of both.
        </p>
      </header>

      {lead && (
        <Link
          href={lead.href}
          className="group mt-12 grid grid-cols-1 gap-6 overflow-hidden rounded-2xl border border-grey-300/60 bg-white lg:grid-cols-2"
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-papyrus lg:aspect-auto">
            {lead.image.src ? (
              <Image
                src={lead.image.src}
                alt={lead.image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 590px, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-nile/40">Egypt</div>
            )}
          </div>
          <div className="flex flex-col justify-center p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-rust">Latest</p>
            <h2 className="mt-2 text-section-h2 font-bold leading-tight text-ink transition-colors group-hover:text-rust">
              {lead.title}
            </h2>
            <p className="mt-3 line-clamp-3 text-body leading-relaxed text-ink/70">{lead.summary}</p>
            <p className="mt-4 text-meta text-ink/55">
              {formatBlogDate(lead.publishedISO)} · {lead.readMinutes} min read
            </p>
          </div>
        </Link>
      )}

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((post) => (
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
                <div className="flex h-full w-full items-center justify-center text-meta text-nile/40">Egypt</div>
              )}
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-trip-h3 font-semibold text-ink transition-colors group-hover:text-rust">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-meta text-ink/65">{post.summary}</p>
              <p className="mt-4 text-meta text-ink/50">
                {formatBlogDate(post.publishedISO)} · {post.readMinutes} min read
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
}
