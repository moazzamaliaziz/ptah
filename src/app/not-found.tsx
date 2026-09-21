import Link from "next/link";
import SiteLogo from "@/components/site/SiteLogo";
import NotFoundView from "@/components/site/NotFoundView";

/**
 * Global not-found — served for URLs that match no route at all. This renders
 * on the ROOT layout only (no SiteHeader/SiteFooter, which live in the (site)
 * group layout), so it carries its own minimal branded chrome: the cartouche
 * logo as a home link, then the shared 404 body. In-app notFound() calls from
 * public pages render src/app/(site)/not-found.tsx instead, inside full chrome.
 */
export default function RootNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-12 bg-white px-6 py-16">
      <Link
        href="/"
        aria-label="Ptah Tours home"
        className="block w-16 text-nile [&>svg]:h-auto [&>svg]:w-full"
      >
        <SiteLogo />
      </Link>
      <NotFoundView />
    </main>
  );
}
