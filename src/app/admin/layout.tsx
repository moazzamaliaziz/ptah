import type { ReactNode } from "react";
import type { Metadata } from "next";
import { cabin } from "@/lib/fonts";
import "../globals.css";
import "./admin.css";

/* The whole admin area is dynamic (reads cookies/DB, never cached) and must
   never be indexed. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

/* Root layout for the admin area (Phase 3): it renders its own <html>/<body>
   now that the app uses multiple root layouts (the public site is under [lang]
   and admin stays English, never localized). Previously a pass-through that
   leaned on the deleted top-level app/layout.tsx. globals.css loads first, then
   admin.css overrides. */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cabin.variable}>
      <body>{children}</body>
    </html>
  );
}
