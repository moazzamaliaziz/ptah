"use client";

import { useEffect, useState } from "react";

export interface CityNavSection {
  /** Target section id on the page (matches the section's `id` + scroll-margin). */
  id: string;
  label: string;
}

/**
 * Sticky in-page section nav for the city detail page (TripAdvisor-style).
 *
 * Renders a horizontally scrollable row of chips that deep-link to the page's
 * section anchors and highlights whichever section is in view via an
 * IntersectionObserver. The site header is a hide-on-scroll sticky bar with the
 * top z-index, so this nav pins at top-0 with a low z-index: while the reader
 * scrolls down (header hidden) it sits at the top; on scroll-up the header
 * simply draws over it. Client component — needs scroll/observer state.
 */
export default function CityAnchorNav({ sections }: { sections: CityNavSection[] }) {
  const [active, setActive] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Highlight the top-most section currently crossing the viewport band.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav
      aria-label="On this page"
      className="sticky top-0 z-30 -mx-6 mt-2 border-y border-grey-300/40 bg-white/90 backdrop-blur lg:-mx-10"
    >
      <ul className="flex gap-1 overflow-x-auto px-6 py-2.5 [-ms-overflow-style:none] [scrollbar-width:none] lg:px-10 [&::-webkit-scrollbar]:hidden">
        {sections.map((s) => {
          const isActive = s.id === active;
          return (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`inline-block whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-nile text-white"
                    : "text-ink/70 hover:bg-papyrus hover:text-nile"
                }`}
              >
                {s.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
