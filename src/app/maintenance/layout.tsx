import type { ReactNode } from "react";
import { cabin } from "@/lib/fonts";
import "../globals.css";

/* Root layout for the standalone maintenance page (Phase 3). The app has no
   single top-level app/layout.tsx any more (multiple root layouts — the public
   site is under [lang]), so this page must supply its own <html>/<body>. It
   carries the Cabin font variable (the page references var(--font-cabin)) and
   the shared globals for a consistent reset. English only — the proxy rewrites
   here before any locale is negotiated. */
export default function MaintenanceRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cabin.variable}>
      <body>{children}</body>
    </html>
  );
}
