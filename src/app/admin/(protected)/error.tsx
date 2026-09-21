"use client";

import { useEffect } from "react";

/**
 * Admin error boundary (App Router convention — Client Component). Catches
 * render/data errors in any protected admin page and renders inside the admin
 * shell's <main>. Inline-styled with brand hexes so it doesn't depend on the
 * admin CSS classes resolving; logs only the framework `digest`, never raw
 * error text (server detail is captured by onRequestError).
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("admin error boundary", { digest: error.digest });
  }, [error]);

  return (
    <div style={{ maxWidth: "40rem" }}>
      <h1 style={{ fontSize: "1.5rem", margin: 0, color: "#1a2340" }}>
        Something went wrong
      </h1>
      <p style={{ marginTop: "0.75rem", lineHeight: 1.5, color: "rgba(38,38,38,0.7)" }}>
        This admin view failed to load. Try again — if it persists, check the server
        logs for the reference below.
      </p>
      {error.digest && (
        <p style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "rgba(38,38,38,0.45)" }}>
          Reference: {error.digest}
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
        Try again
      </button>
    </div>
  );
}
