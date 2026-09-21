"use client";

import type { JSX } from "react";

/**
 * CustomEvent name shared by the footer "Manage Your Cookies" button and the
 * consent banner (src/components/site/CookieBanner.tsx).
 */
export const COOKIE_MANAGE_EVENT = "ptah:open-cookie-preferences";

/** Footer legal-bar button that re-opens the cookie preference center. */
export function CookieManageButton(): JSX.Element {
  return (
    <button
      type="button"
      className="cookie-manage text-meta"
      aria-haspopup="dialog"
      onClick={() => window.dispatchEvent(new CustomEvent(COOKIE_MANAGE_EVENT))}
    >
      <span className="cookie-manage__long">Manage Your </span>
      Cookies
    </button>
  );
}

export default CookieManageButton;
