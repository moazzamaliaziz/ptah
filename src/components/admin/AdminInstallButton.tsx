"use client";

/**
 * "Install the admin app" button for the sign-in screen.
 *
 * Reuses the site's PWA install mechanism (see components/pwa/InstallPrompt):
 * on Chromium we capture the `beforeinstallprompt` event and trigger it on
 * click; on iOS/iPadOS Safari (which has no such event) we reveal the manual
 * "Add to Home Screen" steps. The button renders nothing until it knows an
 * install is actually offer-able, so operators never see a dead control, and it
 * hides itself once the app is already running standalone.
 *
 * Installing here installs the whole PWA (manifest scope is "/"), the admin
 * panel included — this is just the entry point staff see first.
 */
import { useEffect, useState, type JSX } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function AdminInstallButton({
  label,
  iosHint,
}: {
  label: string;
  iosHint: string;
}): JSX.Element | null {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const [showIosHint, setShowIosHint] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const nav = navigator as Navigator & { standalone?: boolean };
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
    if (standalone) {
      // Browser-only signal, unavailable during SSR — must be read after mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect -- see comment above
      setHidden(true);
      return;
    }

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // keep the native mini-infobar suppressed; our button drives it
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    const onInstalled = () => setHidden(true);
    window.addEventListener("appinstalled", onInstalled);

    // iOS/iPadOS Safari never fires beforeinstallprompt — detect it so we can
    // offer manual steps instead. This is browser-only state, unknown during
    // SSR, so it can only be decided after mount.
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

  // Nothing to offer: already installed, or a browser that can't install and
  // isn't iOS Safari (so no manual path either).
  if (hidden || (!deferred && !isIos)) return null;

  async function install() {
    if (isIos) {
      setShowIosHint((v) => !v);
      return;
    }
    if (!deferred) return;
    try {
      await deferred.prompt();
      await deferred.userChoice;
    } finally {
      setDeferred(null);
      setHidden(true);
    }
  }

  return (
    <div className="admin-install">
      <button
        type="button"
        className="admin-install__btn"
        onClick={install}
        aria-expanded={isIos ? showIosHint : undefined}
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
      {isIos && showIosHint ? <p className="admin-install__hint">{iosHint}</p> : null}
    </div>
  );
}
