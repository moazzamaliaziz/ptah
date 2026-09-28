"use client";

/**
 * SSR-safe matchMedia hook. Returns `null` before hydration so chrome can
 * render a deterministic placeholder variant and swap markup post-mount
 * (design.md §5.2 rule 2: JS swaps mobile/desktop header markup at 744px —
 * do not CSS-hide one variant for the other).
 */
import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const apply = () => setMatches(mql.matches);
    apply();
    mql.addEventListener("change", apply);
    return () => mql.removeEventListener("change", apply);
  }, [query]);

  return matches;
}

/** 744px primary switch (design.md: 46.5em — the "BIG" breakpoint). */
export const MQ_DESKTOP = "(min-width: 46.5em)";

/**
 * 1128px header desktop switch. The primary bar carries a full logo + 7 nav
 * items + 6 action controls in one row; that content cannot fit below ~1128px,
 * so the header shows the hamburger curtain (which holds the identical nav) up
 * to 1127px and the desktop mega-menu bar at 1128px+. Kept separate from
 * MQ_DESKTOP so the landing hero keeps its own 744px behavior. Mirrors 70.5em
 * (MQ_WIDE) intentionally — the bar's tidy spacing is tuned for that floor. */
export const MQ_HEADER_DESKTOP = "(min-width: 70.5em)";

/** 950px "laptop-small": rail -> grid switch, GI 4-up math, docked arrows. */
export const MQ_LAPTOP = "(min-width: 59.375em)";

/** 1128px desktop: fluid container padding, KBYG reveal + hover choreography. */
export const MQ_WIDE = "(min-width: 70.5em)";

/** Precise pointer capability gate for the hero custom cursor (§3.1.5). */
export const MQ_HOVER_FINE = "(hover: hover) and (pointer: fine)";
