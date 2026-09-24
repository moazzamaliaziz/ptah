"use client";

/**
 * Cookie consent banner (design.md §2.6 + §4.8.13 rebuild default).
 *
 * - Client-mounted only; first paint is post-idle (`requestIdleCallback` with
 *   a setTimeout fallback) so the sheet never blocks LCP.
 * - Motion default per §4.8.13: bottom sheet translateY(102%) -> 0, 0.3s
 *   ease-out (0.2s reverse); under reduced motion the sheet swaps to a 0.2s
 *   opacity cross-fade via the chrome.css override.
 * - Footer "Manage Your Cookies" re-opens the preference center via the
 *   custom event shared in CookieManageButton.tsx.
 * - Persistence: versioned localStorage record; "necessary" is always on.
 */
import { useCallback, useEffect, useId, useRef, useState, type JSX } from "react";
import type { FooterContent } from "@/content/landing";
import type { CookieLabels } from "@/i18n/chrome";
import { COOKIE_MANAGE_EVENT } from "@/components/site/CookieManageButton";

const STORAGE_KEY = "ptah:cookie-consent:v1";

interface ConsentState {
  preferences: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface StoredConsent extends ConsentState {
  necessary: true;
  updatedAt: string;
}

function readConsent(): StoredConsent | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    const record = parsed as Record<string, unknown>;
    // Coerce to a well-formed record: a tampered or legacy payload must never
    // feed a non-boolean into a controlled checkbox `checked` prop downstream.
    return {
      necessary: true,
      preferences: record.preferences === true,
      analytics: record.analytics === true,
      marketing: record.marketing === true,
      updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : "",
    };
  } catch {
    return null;
  }
}

function saveConsent(state: ConsentState): void {
  try {
    const record: StoredConsent = { necessary: true, ...state, updatedAt: new Date().toISOString() };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    // Later phases (GA4, pixels) subscribe to this event to (un)load vendors.
    window.dispatchEvent(new CustomEvent("ptah:cookie-consent-changed", { detail: record }));
  } catch {
    /* private mode — session-scoped consent, banner shows again next visit */
  }
}

export interface CookieBannerProps {
  /** Localized cookie copy (heading, body, category names/descriptions). */
  content: FooterContent["cookie"];
  /** Localized cookie control labels (buttons, aria, "necessary" strings). */
  labels: CookieLabels;
}

export function CookieBanner({ content, labels }: CookieBannerProps): JSX.Element | null {
  // Two-phase mount: an element inserted already in its open pose has no
  // "before" computed style, so its CSS transition would never run. Mount
  // closed, then flip data-open on the next frame (design.md §4.8.13 entrance).
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [managing, setManaging] = useState(false);
  const [prefs, setPrefs] = useState<ConsentState>({
    preferences: false,
    analytics: false,
    marketing: false,
  });
  const headingId = useId();
  const panelId = useId();
  const closeTimer = useRef<number | null>(null);

  const openBanner = useCallback((showManage: boolean) => {
    setManaging(showManage);
    setMounted(true);
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setOpen(true));
    });
  }, []);

  const closeBanner = useCallback(() => {
    setOpen(false);
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setMounted(false);
      closeTimer.current = null;
    }, 320); // slide-out (0.2s, §4.8.13) + margin
  }, []);

  /* Clear a pending unmount timer if this island unmounts mid-close */
  useEffect(
    () => () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
    },
    [],
  );

  /* First paint: after idle, only when no stored choice exists */
  useEffect(() => {
    if (readConsent()) return;
    const openWhenIdle = () => openBanner(false);
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(openWhenIdle, { timeout: 2000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(openWhenIdle, 600);
    return () => window.clearTimeout(t);
  }, [openBanner]);

  /* Footer "Manage Your Cookies" button reopens the preference center */
  useEffect(() => {
    const handler = () => {
      const stored = readConsent();
      if (stored) {
        setPrefs({
          preferences: stored.preferences,
          analytics: stored.analytics,
          marketing: stored.marketing,
        });
      }
      openBanner(true);
    };
    window.addEventListener(COOKIE_MANAGE_EVENT, handler);
    return () => window.removeEventListener(COOKIE_MANAGE_EVENT, handler);
  }, [openBanner]);

  /* Escape closes without saving (consent stays pending -> reappears).
     A modal surface (search dialog, expanded header/curtain) owns Escape while
     it is open — don't collapse the sheet on the same keypress. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (
        document.querySelector(
          '[aria-modal="true"], .site-header[data-expanded="true"], .curtain[data-open="true"]',
        )
      ) {
        return;
      }
      closeBanner();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeBanner]);

  const acceptAll = () => {
    saveConsent({ preferences: true, analytics: true, marketing: true });
    closeBanner();
  };
  const rejectAll = () => {
    saveConsent({ preferences: false, analytics: false, marketing: false });
    closeBanner();
  };
  const saveSelection = () => {
    saveConsent(prefs);
    closeBanner();
  };

  if (!mounted) return null;

  return (
    <div className="cookie-banner" data-open={open} role="region" aria-label={labels.regionAria}>
      <div className="cookie-banner__inner" aria-labelledby={headingId}>
        <div className="cookie-banner__row">
          <div className="cookie-banner__copy">
            <h2 className="text-newsletter-h2" id={headingId} style={{ margin: 0 }}>
              {content.heading}
            </h2>
            <p className="text-meta">{content.copy}</p>
          </div>
          <div className="cookie-banner__actions">
            <button type="button" className="pill pill--solid" onClick={acceptAll}>
              {labels.acceptAll}
            </button>
            <button
              type="button"
              className="pill pill--outline"
              onClick={() => setManaging((v) => !v)}
              aria-expanded={managing}
              aria-controls={panelId}
            >
              {labels.manage}
            </button>
            <button
              type="button"
              className="cookie-manage text-meta"
              onClick={rejectAll}
            >
              {labels.rejectAll}
            </button>
          </div>
        </div>

        {managing ? (
          <div className="cookie-manage-panel" id={panelId} aria-label={content.manageHeading}>
            <div className="cookie-cat">
              <input type="checkbox" id="cookie-cat-necessary" checked disabled />
              <div>
                <label className="cookie-cat__name text-meta" htmlFor="cookie-cat-necessary">
                  {labels.necessaryName}
                </label>
                <p className="cookie-cat__desc">
                  {labels.necessaryDesc}
                </p>
              </div>
            </div>
            {content.categories.map((cat) => (
              <div className="cookie-cat" key={cat.key}>
                <input
                  type="checkbox"
                  id={`cookie-cat-${cat.key}`}
                  checked={prefs[cat.key]}
                  onChange={(e) => setPrefs((v) => ({ ...v, [cat.key]: e.target.checked }))}
                />
                <div>
                  <label className="cookie-cat__name text-meta" htmlFor={`cookie-cat-${cat.key}`}>
                    {cat.name}
                  </label>
                  <p className="cookie-cat__desc">{cat.description}</p>
                </div>
              </div>
            ))}
            <div className="cookie-manage-actions">
              <button type="button" className="pill pill--solid" onClick={saveSelection}>
                {labels.saveChoices}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default CookieBanner;
