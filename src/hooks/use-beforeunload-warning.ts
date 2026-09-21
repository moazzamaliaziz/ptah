"use client";

import { useEffect } from "react";

/**
 * Warn the user before they navigate away / close the tab while `active` is true
 * (i.e. there are unsaved form edits). Browsers show their own generic prompt;
 * the returned string is ignored by modern browsers but `preventDefault` +
 * `returnValue` is still required to trigger it.
 *
 * This guards the real data-loss paths (tab close, back button, hard nav). It is
 * intentionally simple and dependency-free so any admin editor can opt in.
 */
export function useBeforeUnloadWarning(active: boolean): void {
  useEffect(() => {
    if (!active) return;
    function handler(event: BeforeUnloadEvent): void {
      event.preventDefault();
      // Legacy assignment required by some browsers to trigger the native prompt.
      event.returnValue = "";
    }
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [active]);
}
