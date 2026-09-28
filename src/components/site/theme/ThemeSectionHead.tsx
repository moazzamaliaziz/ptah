import type { SectionHead } from "@/content/theme-content";

/** Shared eyebrow + heading + optional intro block for theme page sections. */
export default function ThemeSectionHead({
  head,
  center = false,
  className = "",
}: {
  head: SectionHead;
  center?: boolean;
  className?: string;
}) {
  return (
    <div className={`${center ? "mx-auto max-w-2xl text-center" : "max-w-3xl"} ${className}`}>
      <p className="text-eyebrow uppercase tracking-[0.14em] text-rust">{head.eyebrow}</p>
      <h2 className="mt-2 text-section-h2 font-bold leading-tight text-ink">{head.heading}</h2>
      {head.intro ? <p className="mt-4 text-body leading-relaxed text-ink/75">{head.intro}</p> : null}
    </div>
  );
}
