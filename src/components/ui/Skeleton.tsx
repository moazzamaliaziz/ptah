import type { JSX } from "react";

/**
 * Presentational loading placeholder (Phase 5 UX states). A single pulsing
 * block; compose several to mirror a real layout's rhythm.
 *
 * The pulse is Tailwind's `animate-pulse`, which the global reduced-motion
 * subsystem (globals.css §4.6) clamps to a near-instant static state under
 * `prefers-reduced-motion: reduce` OR `html[data-reduced-motion="true"]`, so
 * no per-component motion guard is required here.
 *
 * Decoupled per the white-label rule (AGENTS.md): no data, no fetch, no brand
 * hardcoding beyond the neutral `--color-ink` token at low alpha. Rendered as a
 * <span> so it is valid inside both block and inline-flow parents; callers add
 * layout via `className`. Purely decorative — hidden from assistive tech (the
 * surrounding loading.tsx owns the `role="status"` announcement).
 */
export default function Skeleton({
  className = "",
}: {
  className?: string;
}): JSX.Element {
  return (
    <span
      aria-hidden="true"
      className={`block animate-pulse rounded-md bg-ink/10 ${className}`}
    />
  );
}
