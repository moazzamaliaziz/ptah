import type { JSX } from "react";

/**
 * Skip link (design.md §2.4) — first focusable element in the document.
 * Revealed on focus; targets #reach-skip-nav which wraps <main> in the layout.
 */
export function SkipLink(): JSX.Element {
  return (
    <a href="#reach-skip-nav" className="skip-link" data-reach-skip-link>
      Skip to main content
    </a>
  );
}

export default SkipLink;
