"use client";

/**
 * usePrefersReducedMotion — JS twin of the CSS subsystem in globals.css.
 *
 * TRUE when the OS setting is `prefers-reduced-motion: reduce` OR when the
 * document root carries `data-reduced-motion="true"` (manual override hook for
 * a future accessibility settings toggle). Motion-emitting client components
 * (hero autoplay, parallax, curtain JS) must consult this (design.md §4.6
 * requirement, gap D-3).
 */
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void): () => void {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  const mo = new MutationObserver(callback);
  mo.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-reduced-motion"],
  });
  return () => {
    mq.removeEventListener("change", callback);
    mo.disconnect();
  };
}

function getSnapshot(): boolean {
  if (document.documentElement.dataset.reducedMotion === "true") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/** OS media query only (used where the manual override should not apply). */
export function useSystemPrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}
