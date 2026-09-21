"use client";

import { useEffect } from "react";

/**
 * Root error boundary — the last line of defense. It renders ONLY when the
 * root layout itself throws, which means it must supply its own <html>/<body>
 * (the failed layout can't) and cannot assume the design system loaded. So it
 * is intentionally dependency-free and inline-styled with the brand hexes
 * (nile #1a2340, rust #9a5c1b, ink #262626) rather than token utilities.
 *
 * Like the site boundary, it logs only the framework `digest`, never raw
 * error text.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("global error boundary", { digest: error.digest });
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, Helvetica, sans-serif",
          background: "#ffffff",
          color: "#262626",
          padding: "1.5rem",
        }}
      >
        <div style={{ maxWidth: "32rem", textAlign: "center" }}>
          <p
            style={{
              margin: 0,
              fontSize: "12px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#9a5c1b",
            }}
          >
            Something went wrong
          </p>
          <h1 style={{ margin: "0.75rem 0 0", fontSize: "1.75rem", color: "#1a2340" }}>
            The page failed to load
          </h1>
          <p
            style={{
              margin: "1rem 0 0",
              fontSize: "1rem",
              lineHeight: 1.5,
              color: "rgba(38,38,38,0.65)",
            }}
          >
            An unexpected error interrupted the app. Please try again.
          </p>
          {error.digest && (
            <p
              style={{
                margin: "0.75rem 0 0",
                fontSize: "0.8rem",
                color: "rgba(38,38,38,0.45)",
              }}
            >
              Reference: {error.digest}
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "2rem",
              borderRadius: "9999px",
              border: "none",
              background: "#1a2340",
              color: "#ffffff",
              padding: "0.7rem 1.6rem",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
