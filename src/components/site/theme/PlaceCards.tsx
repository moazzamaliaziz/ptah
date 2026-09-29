import Image from "next/image";
import ThemeSectionHead from "./ThemeSectionHead";
import type { ThemeImage } from "@/content/theme-media";
import type { PlaceCard, SectionHead } from "@/content/theme-content";

/**
 * Secondary "more to see" places (server). Image cards in a responsive grid;
 * each card's image slug is resolved through the caller-supplied `resolveImage`
 * so the component serves any typed media set (theme or city pages) with
 * grounded alt + intrinsic sizing.
 */
export default function PlaceCards({
  resolveImage,
  head,
  cards,
}: {
  resolveImage: (slug: string) => ThemeImage;
  head: SectionHead;
  cards: PlaceCard[];
}) {
  return (
    <section>
      <ThemeSectionHead head={head} />
      <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => {
          const img = resolveImage(c.image);
          return (
            <li key={c.image} className="overflow-hidden rounded-2xl border border-grey-300/50 bg-white">
              <div className="relative aspect-[3/2] bg-papyrus">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-card-title font-bold text-ink">{c.name}</h3>
                <p className="mt-2 text-meta leading-relaxed text-ink/70">{c.body}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
