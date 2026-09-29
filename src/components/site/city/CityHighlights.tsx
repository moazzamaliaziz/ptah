import ThemeSectionHead from "@/components/site/theme/ThemeSectionHead";
import type { SectionHead } from "@/content/theme-content";
import type { CityHighlight } from "@/content/city-content";

/**
 * Ranked "things to do" list for a city (server component).
 *
 * A numbered, editorial list of the city's headline sights — the SEO-friendly
 * "top things to do in <city>" block that mirrors the intent travellers search
 * for. Each item is a navy rank medallion + name + one-paragraph description,
 * laid out single-column on mobile and two-column from md up so the list reads
 * top-to-bottom, left column then right.
 */
export default function CityHighlights({
  head,
  items,
}: {
  head: SectionHead;
  items: CityHighlight[];
}) {
  return (
    <section>
      <ThemeSectionHead head={head} />
      <ol className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2">
        {items.map((item) => (
          <li key={item.rank} className="flex gap-4">
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-nile text-sm font-bold text-white ring-4 ring-gold/15"
            >
              {item.rank}
            </span>
            <div>
              <h3 className="text-trip-h3 font-semibold text-ink">{item.name}</h3>
              <p className="mt-1.5 text-body leading-relaxed text-ink/70">{item.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
