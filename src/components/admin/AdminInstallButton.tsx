"use client";

/**
 * "Install the admin app" button for the sign-in screen.
 *
 * This drives the SEPARATE admin PWA (manifest: /admin.webmanifest, id/scope
 * "/admin", distinct "Ptah … Admin" name + gold-plate lock icon) — a different
 * installed app from the public site PWA that is installed off the landing page.
 *
 * Consistency (the bug this fixes): the button now ALWAYS renders on the login
 * screen; the one exception is when the admin app is already running standalone
 * or was just installed. It adapts to what the browser can do:
 *   • Chromium fired `beforeinstallprompt` → one tap triggers the native install.
 *   • iOS/iPadOS Safari (no such event) → tapping reveals the manual
 *     "Add to Home Screen" steps.
 *   • Anything else (event not captured yet, or a browser that can't install)
 *     → tapping reveals a short "use your browser menu" hint.
 * Previously the control removed itself whenever no prompt was captured, so it
 * appeared on iPhones but silently vanished on desktop/Android Chrome — the
 * "shows on some devices, not on others" complaint. It never self-hides for
 * that reason anymore.
 */
import { useEffect, useState, type JSX } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function AdminInstallButton({
  label,
  iosHint,
  menuHint,
}: {
  label: string;
  iosHint: string;
  menuHint: string;
}): JSX.Element | null {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & { standalone?: boolean };
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
    if (standalone) {
      // Already running as the installed app — nothing to offer. Browser-only
      // signal, unavailable during SSR, so it must be read after mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect -- see comment above
      setHidden(true);
      return;
    }

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // keep the native mini-infobar suppressed; our button drives it
      setDeferred(e as BeforeInstallPromptEvent);
      setShowHint(false); // a real prompt is available now — drop any fallback hint
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    const onInstalled = () => setHidden(true);
    window.addEventListener("appinstalled", onInstalled);

    // iOS/iPadOS Safari never fires beforeinstallprompt — detect it so we can
    // offer the manual steps instead. Browser-only state, unknown during SSR,
    // so it can only be decided after mount.
    const ua = navigator.userAgent;
    const iOS = /iphone|ipad|ipod/i.test(ua) || (nav.platform === "MacIntel" && nav.maxTouchPoints > 1);
    const safari = /^((?!chrome|android|crios|fxios|edgios|edg).)*safari/i.test(ua);
    // Platform is known only after mount; this set-state is conditional (unlike
    // the standalone guard above) so the set-state-in-effect rule doesn't fire.
    if (iOS && safari) setIsIos(true);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  // Only truly disappears once the app is installed / running standalone.
  if (hidden) return null;

  async function install() {
    // Native path: fire the captured prompt.
    if (deferred) {
      try {
        await deferred.prompt();
        await deferred.userChoice;
      } finally {
        setDeferred(null);
        setHidden(true);
      }
      return;
    }
    // No native prompt (iOS Safari, or a browser that hasn't offered one yet) —
    // toggle the appropriate manual hint instead.
    setShowHint((v) => !v);
  }

  // Which hint the fallback shows: iOS gets the Share → Add-to-Home-Screen
  // steps, everything else gets the generic browser-menu hint.
  const hintText = isIos ? iosHint : menuHint;

  return (
    <div className="admin-install">
      <button
        type="button"
        className="admin-install__btn"
        onClick={install}
        aria-expanded={deferred ? undefined : showHint}
      >
        <span aria-hidden="true" className="admin-install__icon">
          {/* phone / download glyph */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect x="6" y="2.5" width="12" height="19" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
            <path d="M12 8v6m0 0 2.4-2.4M12 14l-2.4-2.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        {label}
      </button>
      {!deferred && showHint ? <p className="admin-install__hint">{hintText}</p> : null}
    </div>
  );
}
