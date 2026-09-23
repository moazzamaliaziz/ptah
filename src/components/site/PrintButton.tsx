"use client";

import type { ReactNode } from "react";
import { useCallback } from "react";

/**
 * "Download as PDF" via the browser's native print dialog (zero-dependency —
 * item #10). Sets data-printing="receipt" on <html> so the global print
 * stylesheet (globals.css) hides site chrome and prints only the receipt card,
 * then clears it again once the dialog closes.
 */
export default function PrintButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const onClick = useCallback(() => {
    const root = document.documentElement;
    root.setAttribute("data-printing", "receipt");
    const cleanup = () => {
      root.removeAttribute("data-printing");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup);
    window.print();
  }, []);

  return (
    <button type="button" onClick={onClick} className={className}>
      {children}
    </button>
  );
}
