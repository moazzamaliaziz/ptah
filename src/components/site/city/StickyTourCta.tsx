"use client";

import { useEffect, useState } from "react";

/**
 * Mobile-only sticky bottom CTA (client component).
 *
 * Appears once the reader scrolls past the hero and deep-links to the on-page
 * tours section, keeping the primary conversion action within thumb reach on
 * small screens. Hidden on lg+, where the tour grid and header CTAs are always
 * visible. Uses the navy primary treatment (gold-on-white would fail contrast).
 */
export default function StickyTourCta({ label }: { label: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-grey-300/50 bg-white/95 p-3 backdrop-blur transition-transform duration-300 lg:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <a
        href="#tours"
        className="flex w-full items-center justify-center gap-2 rounded-full bg-nile px-6 py-3 text-sm font-semibold text-white"
      >
        {label}
      </a>
    </div>
  );
}
