import Image from "next/image";
import ThemeSectionHead from "./ThemeSectionHead";
import type { ThemeImage } from "@/content/theme-media";
import type { FeatureRow, SectionHead } from "@/content/theme-content";

/**
 * Image-led feature rows (server). Alternating photo/text layout; each row's
 * image slug is resolved through the caller-supplied `resolveImage` so the
 * component works for any typed media set (theme pages or city pages) while
 * alt text and intrinsic dimensions stay source-grounded.
 */
export default function FeatureRows({
  resolveImage,
  head,
  rows,
}: {
  resolveImage: (slug: string) => ThemeImage;
  head: SectionHead;
  rows: FeatureRow[];
}) {
  return (
    <section>
      <ThemeSectionHead head={head} />
      <div className="mt-12 space-y-16">
        {rows.map((row, i) => {
          const img = resolveImage(row.image);
          const flip = i % 2 === 1;
          return (
            <article key={row.image} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
              <div
                className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-papyrus ${flip ? "lg:order-2" : ""}`}
              >
                <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 520px, 100vw" className="object-cover" />
              </div>
              <div className={flip ? "lg:order-1" : ""}>
                {row.eyebrow ? (
                  <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">{row.eyebrow}</p>
                ) : null}
                <h3 className="mt-2 text-kbyg-h2 font-bold leading-tight text-ink">{row.heading}</h3>
                <div className="mt-4 space-y-4 text-body leading-relaxed text-ink/75">
                  {row.body.map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
