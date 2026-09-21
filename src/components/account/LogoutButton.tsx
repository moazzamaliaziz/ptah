"use client";

import { logoutAction } from "@/app/(site)/account/actions";
import { clearWishlist } from "@/lib/wishlist";

/**
 * Logout: clears the local wishlist (so one account's saved tours don't linger
 * for the next guest on a shared device) then submits the server action, which
 * destroys the session server-side and redirects home.
 */
export default function LogoutButton({ className }: { className?: string }) {
  return (
    <form action={logoutAction} onSubmit={() => clearWishlist()}>
      <button
        type="submit"
        className={
          className ??
          "rounded-full border border-nile/25 px-5 py-2.5 text-btn text-nile transition-colors hover:border-nile"
        }
      >
        Log out
      </button>
    </form>
  );
}
