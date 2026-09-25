"use client";

import { useEffect, useState } from "react";
import { getAdminDict } from "@/i18n/admin/dictionary";
import type { AdminLocale } from "@/i18n/admin/config";

/**
 * Admin error boundary (App Router convention — Client Component). Catches
 * render/data errors in any protected admin page and renders inside the admin
 * shell's <main>. Inline-styled with brand hexes so it doesn't depend on the
 * admin CSS classes resolving; logs only the framework `digest`, never raw
 * error text (server detail is captured by onRequestError).
 *
 * It can't read the ADMIN_LOCALE cookie (Client Component), so it picks its
 * language from <html lang> after mount — first paint is English, then it
 * swaps to Arabic if the shell is Arabic (no hydration mismatch: server and
 * first client render agree on "en").
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [locale, setLocale] = useState<AdminLocale>("en");

  useEffect(() => {
    console.error("admin error boundary", { digest: error.digest });
  }, [error]);

  useEffect(() => {
    if (document.documentElement.lang === "ar") setLocale("ar");
  }, []);

  const t = getAdminDict(locale).errors;

  return (
    <div style={{ maxWidth: "40rem" }}>
      <h1 style={{ fontSize: "1.5rem", margin: 0, color: "#1a2340" }}>
        {t.title}
      </h1>
      <p style={{ marginTop: "0.75rem", lineHeight: 1.5, color: "rgba(38,38,38,0.7)" }}>
        {t.body}
      </p>
      {error.digest && (
        <p style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "rgba(38,38,38,0.45)" }}>
          {t.referenceLabel} {error.digest}
        </p>
      )}
      <button
        type="button"
        onClick={reset}
        style={{
          marginTop: "1.5rem",
          borderRadius: "9999px",
          border: "none",
          background: "#1a2340",
          color: "#ffffff",
          padding: "0.6rem 1.4rem",
          fontSize: "13px",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {t.tryAgain}
      </button>
    </div>
  );
}
