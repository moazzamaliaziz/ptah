"use client";

/**
 * Shared PWA-install controller (spec §3, D3). Replaces the old auto-popup card
 * (InstallPrompt) that collided with the floating widgets on mobile. It captures
 * the Chromium `beforeinstallprompt` event ONCE for the whole page and exposes it
 * through context, so any number of `InstallButton`s (header, footer, …) can
 * drive the same native prompt without each attaching its own listeners.
 *
 * `status`:
 *   - "unavailable" — nothing to offer (already installed, or a browser with no
 *     install path). Buttons render null. This is also the SSR / first-paint
 *     value, so it is deterministic and never causes a hydration mismatch.
 *   - "installable"  — Chromium fired the event; buttons trigger the real prompt.
 *   - "ios"          — iOS/iPadOS Safari (no event); buttons reveal manual
 *     "Add to Home Screen" steps instead.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type JSX,
  type ReactNode,
} from "react";
import type { PwaStrings } from "@/i18n/pwa";

/** `beforeinstallprompt` is not in the standard DOM lib types. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export type InstallStatus = "unavailable" | "installable" | "ios";

interface InstallContextValue {
  status: InstallStatus;
  /** Trigger the native install prompt (no-op unless status is "installable"). */
  promptInstall: () => Promise<void>;
  strings: PwaStrings["install"];
}

const InstallContext = createContext<InstallContextValue | null>(null);

export function useInstall(): InstallContextValue {
  const ctx = useContext(InstallContext);
  if (!ctx) throw new Error("useInstall must be used within <InstallProvider>");
  return ctx;
}

export default function InstallProvider({
  strings,
  children,
}: {
  strings: PwaStrings["install"];
  children: ReactNode;
}): JSX.Element {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [status, setStatus] = useState<InstallStatus>("unavailable");

  useEffect(() => {
    const nav = navigator as Navigator & { standalone?: boolean };
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
    if (standalone) return; // already installed — leave status "unavailable"

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // suppress the native mini-infobar; our buttons drive it
      setDeferred(e as BeforeInstallPromptEvent);
      setStatus("installable");
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    const onInstalled = () => {
      setDeferred(null);
      setStatus("unavailable");
    };
    window.addEventListener("appinstalled", onInstalled);

    // iOS/iPadOS Safari never fires beforeinstallprompt — detect it after mount
    // (UA/platform are browser-only, unknown during SSR) and offer manual steps.
    const ua = navigator.userAgent;
    const isIOS = /iphone|ipad|ipod/i.test(ua) || (nav.platform === "MacIntel" && nav.maxTouchPoints > 1);
    const isSafari = /^((?!chrome|android|crios|fxios|edgios|edg).)*safari/i.test(ua);
    // Post-mount environment sync: status starts "unavailable" on SSR + first
    // paint (deterministic, no hydration mismatch) and upgrades to "ios" only
    // once the UA is knowable. This one-time set is intentional, hence the
    // targeted disable of the cascading-render heuristic.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time platform detection, not reactive state
    if (isIOS && isSafari) setStatus("ios");

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferred) return;
    try {
      await deferred.prompt();
      await deferred.userChoice;
    } finally {
      setDeferred(null);
      setStatus("unavailable");
    }
  }, [deferred]);

  return (
    <InstallContext.Provider value={{ status, promptInstall, strings }}>
      {children}
    </InstallContext.Provider>
  );
}
