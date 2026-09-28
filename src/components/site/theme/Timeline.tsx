import ThemeSectionHead from "./ThemeSectionHead";
import type { SectionHead, TimelineEntry } from "@/content/theme-content";

/**
 * Vertical civilization timeline (server). Renders a labelled section head plus
 * an ordered list of eras on a single connecting rule.
 */
export default function Timeline({ head, entries }: { head: SectionHead; entries: TimelineEntry[] }) {
  return (
    <section>
      <ThemeSectionHead head={head} />
      <ol className="mt-10 border-l-2 border-grey-300/60">
        {entries.map((e, i) => (
          <li key={i} className="relative pb-8 pl-8 last:pb-0">
            <span
              className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-nile bg-white"
              aria-hidden
            />
            <p className="text-eyebrow uppercase tracking-[0.12em] text-rust">{e.span}</p>
            <h3 className="mt-1 text-card-title font-bold text-ink">{e.era}</h3>
            <p className="mt-2 max-w-2xl text-body leading-relaxed text-ink/75">{e.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
