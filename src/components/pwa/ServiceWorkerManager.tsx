"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/**
 * Registers the service worker (production only) and surfaces a non-intrusive
 * "new version" prompt (spec §3). skipWaiting is off in the worker, so a new
 * build installs and waits; the user chooses when to reload. Accepting posts
 * SKIP_WAITING to the waiting worker and reloads once it takes control.
 *
 * The reload is gated on an explicit accept: the worker uses clientsClaim, so on
 * the very first visit it claims this (uncontrolled) page and fires
 * `controllerchange` on its own — we must NOT reload then. We only reload after
 * the user pressed the update button. The toast itself only appears for genuine
 * updates (an existing controller present when a new worker installs).
 *
 * Bundled by Next (loaded via a nonce/'self' script), so it is CSP-safe:
 * navigator.serviceWorker.register is an API call, not an inline script.
 */
export default function ServiceWorkerManager({
  strings,
}: {
  strings: { body: string; action: string; dismiss: string };
}) {
  const [waiting, setWaiting] = useState<ServiceWorker | null>(null);
  const acceptedRef = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;

    let reloading = false;
    const onControllerChange = () => {
      // Ignore the first-install auto-claim; only reload for a user-accepted update.
      if (!acceptedRef.current || reloading) return;
      reloading = true;
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    navigator.serviceWorker
      // updateViaCache:"none" — never satisfy the SW script (or its imports) from
      // the HTTP cache, so update checks always see the freshly deployed bytes.
      .register("/sw.js", { updateViaCache: "none" })
      .then((reg) => {
        // A worker already waiting from a previous visit (genuine update only).
        if (reg.waiting && navigator.serviceWorker.controller) setWaiting(reg.waiting);
        reg.addEventListener("updatefound", () => {
          const installing = reg.installing;
          if (!installing) return;
          installing.addEventListener("statechange", () => {
            if (installing.state === "installed" && navigator.serviceWorker.controller) {
              setWaiting(reg.waiting ?? installing);
            }
          });
        });
      })
      .catch(() => {
        /* SW registration failures are non-fatal — the site works without it. */
      });

    return () => navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
  }, []);

  if (!waiting) return null;

  const accept = () => {
    acceptedRef.current = true;
    waiting.postMessage({ type: "SKIP_WAITING" });
  };

  return (
    <div role="status" aria-live="polite" style={toast}>
      <span style={{ flex: 1 }}>{strings.body}</span>
      <button type="button" onClick={accept} style={primaryBtn}>
        {strings.action}
      </button>
      <button type="button" onClick={() => setWaiting(null)} aria-label={strings.dismiss} style={ghostBtn}>
        ×
      </button>
    </div>
  );
}

const toast: CSSProperties = {
  position: "fixed",
  insetInline: 0,
  bottom: "1rem",
  margin: "0 auto",
  maxWidth: "24rem",
  display: "flex",
  alignItems: "center",
  gap: "0.6rem",
  padding: "0.7rem 0.9rem",
  background: "#1a2340",
  color: "#f4f5f7",
  borderRadius: 12,
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  zIndex: 60,
  fontSize: "0.9rem",
};

const primaryBtn: CSSProperties = {
  border: 0,
  borderRadius: 8,
  padding: "0.45rem 0.85rem",
  background: "#c9a227",
  color: "#1a2340",
  fontWeight: 600,
  cursor: "pointer",
};

const ghostBtn: CSSProperties = {
  border: 0,
  background: "transparent",
  color: "#f4f5f7",
  fontSize: "1.2rem",
  lineHeight: 1,
  cursor: "pointer",
  padding: "0 0.2rem",
};
