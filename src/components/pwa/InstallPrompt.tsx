"use client";

import { useEffect, useState, type CSSProperties } from "react";
import type { PwaStrings } from "@/i18n/pwa";

/**
 * Custom install UX (spec §3, D3). On Chromium we intercept the native
 * `beforeinstallprompt`, suppress the mini-infobar, and show our own card so
 * the prompt matches the brand and copy is localized. iOS/iPadOS Safari has no
 * such event, so we show manual "Add to Home Screen" steps instead.
 *
 * We never nag: the card is hidden once the app runs standalone, once the user
 * installs, and for anyone who dismissed it (remembered in localStorage).
 */
const DISMISS_KEY = "ptah-pwa-install-dismissed";

/** `beforeinstallprompt` is not in the standard DOM lib types. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt({ strings }: { strings: PwaStrings["install"] }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [iosHint, setIosHint] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      /* private mode / storage disabled — treat as not dismissed */
    }
    if (dismissed) return;

    // Already running as an installed app? Nothing to offer.
    const nav = navigator as Navigator & { standalone?: boolean };
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
    if (standalone) return;

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // suppress the default mini-infobar; we show our own card
      setDeferred(e as BeforeInstallPromptEvent);
      setOpen(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    const onInstalled = () => {
      setOpen(false);
      remember();
    };
    window.addEventListener("appinstalled", onInstalled);

    // iOS/iPadOS Safari never fires beforeinstallprompt — offer manual steps.
    const ua = navigator.userAgent;
    const isIOS = /iphone|ipad|ipod/i.test(ua) || (nav.platform === "MacIntel" && nav.maxTouchPoints > 1);
    const isSafari = /^((?!chrome|android|crios|fxios|edgios|edg).)*safari/i.test(ua);
    if (isIOS && isSafari) {
      // iOS capability is derived from navigator/UA + display-mode, all
      // browser-only and unavailable during SSR render — so this decision can
      // only be made after mount, from inside the effect. A lazy state
      // initializer would run on the server (returning false) and hydration
      // would reuse that value, so the effect is the only correct place.
      /* eslint-disable react-hooks/set-state-in-effect -- see comment above: platform is known only after mount */
      setIosHint(true);
      setOpen(true);
      /* eslint-enable react-hooks/set-state-in-effect */
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!open) return null;

  return (
    <div role="dialog" aria-label={strings.title} style={card}>
      {/* eslint-disable-next-line @next/next/no-img-element -- precached brand icon, no next/image runtime needed */}
      <img src="/icons/icon-192.png" alt="" width={40} height={40} style={{ borderRadius: 8, flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <strong style={{ display: "block" }}>{strings.title}</strong>
        <p style={{ margin: "0.15rem 0 0", fontSize: "0.85rem", color: "#c7cbd6" }}>
          {iosHint ? strings.iosHint : strings.body}
        </p>
      </div>
      {!iosHint && (
        <button type="button" onClick={install} style={primaryBtn}>
          {strings.action}
        </button>
      )}
      <button type="button" onClick={dismiss} aria-label={strings.dismiss} style={ghostBtn}>
        ×
      </button>
    </div>
  );

  function remember() {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore storage failures */
    }
  }

  function dismiss() {
    setOpen(false);
    remember();
  }

  async function install() {
    if (!deferred) return;
    try {
      await deferred.prompt();
      await deferred.userChoice;
    } finally {
      setDeferred(null);
      setOpen(false);
      remember();
    }
  }
}

const card: CSSProperties = {
  position: "fixed",
  insetInline: 0,
  bottom: "1rem",
  margin: "0 auto",
  maxWidth: "26rem",
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: "0.8rem 0.95rem",
  background: "#1a2340",
  color: "#f4f5f7",
  borderRadius: 14,
  boxShadow: "0 12px 34px rgba(0,0,0,0.3)",
  zIndex: 60,
};

const primaryBtn: CSSProperties = {
  border: 0,
  borderRadius: 8,
  padding: "0.5rem 0.9rem",
  background: "#c9a227",
  color: "#1a2340",
  fontWeight: 600,
  cursor: "pointer",
  flexShrink: 0,
};

const ghostBtn: CSSProperties = {
  border: 0,
  background: "transparent",
  color: "#f4f5f7",
  fontSize: "1.25rem",
  lineHeight: 1,
  cursor: "pointer",
  padding: "0 0.2rem",
  flexShrink: 0,
};
