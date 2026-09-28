import ThemeSectionHead from "./ThemeSectionHead";
import type { ClimateBand, WhenToVisitContent } from "@/content/theme-content";

/** Band → swatch colour. Qualitative only (no invented precise temperatures). */
const bandDot: Record<ClimateBand, string> = {
  peak: "bg-nile",
  good: "bg-sand",
  shoulder: "bg-grey-300",
  hot: "bg-rust",
};

/**
 * Month-by-month "when to visit" widget (server). A legend maps colour bands to
 * sightseeing conditions; each month is a card with its band swatch and note.
 */
export default function ClimateWidget({ climate }: { climate: WhenToVisitContent["climate"] }) {
  return (
    <section>
      <ThemeSectionHead head={climate.head} />
      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
        {climate.legend.map((l) => (
          <li key={l.band} className="flex items-center gap-2 text-meta text-ink/70">
            <span className={`h-2.5 w-2.5 rounded-full ${bandDot[l.band]}`} aria-hidden />
            {l.label}
          </li>
        ))}
      </ul>
      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {climate.months.map((m) => (
          <li key={m.abbr} className="rounded-xl border border-grey-300/50 bg-white p-4">
            <div className="flex items-center justify-between">
              <span className="text-card-title font-bold text-ink">{m.month}</span>
              <span className={`h-2.5 w-2.5 rounded-full ${bandDot[m.band]}`} aria-hidden />
            </div>
            <p className="mt-2 text-meta leading-relaxed text-ink/70">{m.note}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
