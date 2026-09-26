import type { ReactNode } from "react";
import type { Metadata } from "next";
import { cabin } from "@/lib/fonts";
import { getAdminLocale } from "@/server/admin/locale";
import { adminDir, adminHtmlLang } from "@/i18n/admin/config";
import "../globals.css";
import "./admin.css";

/* The whole admin area is dynamic (reads cookies/DB, never cached) and must
   never be indexed. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
  // Point the admin area at its OWN web app manifest — a separate installable
  // PWA (see app/admin.webmanifest/route.ts). Set on the admin root layout, it
  // overrides the site manifest link that app/manifest.ts injects, so admin
  // pages advertise only the "Ptah … Admin" app.
  manifest: "/admin.webmanifest",
};

/* Root layout for the admin area (Phase 3): it renders its own <html>/<body>
   now that the app uses multiple root layouts (the public site is under [lang]).
   Wave 5: the admin UI itself is English⇄Arabic, chosen with the ADMIN_LOCALE
   cookie; <html lang/dir> is set from it so Arabic renders right-to-left across
   the whole panel. globals.css loads first, then admin.css overrides. */
export default async function AdminRootLayout({ children }: { children: ReactNode }) {
  const locale = await getAdminLocale();
  return (
    <html lang={adminHtmlLang(locale)} dir={adminDir(locale)} className={cabin.variable}>
      <body>{children}</body>
    </html>
  );
}
