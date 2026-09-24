import type { JSX } from "react";
import { getDictionary } from "@/i18n/dictionaries";

/**
 * Skip link (design.md §2.4) — first focusable element in the document.
 * Revealed on focus; targets #reach-skip-nav which wraps <main> in the layout.
 * Server component: resolves the active locale's label via getDictionary.
 */
export async function SkipLink(): Promise<JSX.Element> {
  const dict = await getDictionary();
  return (
    <a href="#reach-skip-nav" className="skip-link" data-reach-skip-link>
      {dict.skip.toContent}
    </a>
  );
}

export default SkipLink;
