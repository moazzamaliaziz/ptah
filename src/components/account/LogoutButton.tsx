"use client";

import { useParams } from "next/navigation";
import { logoutAction } from "@/app/[lang]/(site)/account/actions";
import { clearWishlist } from "@/lib/wishlist";
import type { PageContent } from "@/i18n/pages/en";

/**
 * Logout: clears the local wishlist (so one account's saved tours don't linger
 * for the next guest on a shared device) then submits the server action, which
 * destroys the session server-side and redirects home. A hidden `lang` field
 * carries the active locale so the post-logout redirect lands on the localized
 * home (`/{lang}`) rather than taking an extra proxy hop from bare `/`.
 */
export default function LogoutButton({ className, labels }: { className?: string; labels: PageContent["account"] }) {
  const { lang } = useParams<{ lang?: string }>();
  return (
    <form action={logoutAction} onSubmit={() => clearWishlist()}>
      {lang ? <input type="hidden" name="lang" value={lang} /> : null}
      <button
        type="submit"
        className={
          className ??
          "rounded-full border border-nile/25 px-5 py-2.5 text-btn text-nile transition-colors hover:border-nile"
        }
      >
        {labels.logout}
      </button>
    </form>
  );
}
