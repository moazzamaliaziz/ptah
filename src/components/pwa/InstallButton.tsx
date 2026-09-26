"use client";

/**
 * Reusable "Install app" control (spec §3, D3). Reads the shared install state
 * from <InstallProvider> so it never attaches its own event listeners, and it
 * renders nothing until an install is actually offer-able — no dead controls.
 *
 * Variants:
 *   - "header" — icon-only round button that slots into the site header's
 *     `.icon-button` row (pass the matching className so it sits with its
 *     siblings). The accessible name comes from aria-label + title.
 *   - "footer" — icon + text button for the footer legal bar.
 *
 * On iOS/iPadOS Safari (no `beforeinstallprompt`) the click reveals the manual
 * "Add to Home Screen" steps instead of firing a prompt the browser won't honor.
 */
import { useState, type JSX } from "react";
import { Icon } from "@/components/ui/Icon";
import { useInstall } from "@/components/pwa/InstallProvider";

export default function InstallButton({
  variant,
  className,
}: {
  variant: "header" | "footer";
  /** For the header variant: the icon-button class(es) of the surrounding row. */
  className?: string;
}): JSX.Element | null {
  const { status, promptInstall, strings } = useInstall();
  const [showHint, setShowHint] = useState(false);

  if (status === "unavailable") return null;
  const isIos = status === "ios";

  const onClick = () => {
    if (isIos) {
      setShowHint((v) => !v); // toggle the manual A2HS hint
      return;
    }
    void promptInstall();
  };

  if (variant === "header") {
    return (
      <div className="install-trigger">
        <button
          type="button"
          className={className ?? "icon-button"}
          onClick={onClick}
          aria-label={strings.short}
          title={strings.short}
          aria-expanded={isIos ? showHint : undefined}
        >
          <Icon name="install" size={20} />
        </button>
        {isIos && showHint ? (
          <span role="status" className="install-hint install-hint--pop">
            <Icon name="share-ios" size={16} />
            {strings.iosHint}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <div className="install-trigger install-trigger--footer">
      <button
        type="button"
        className="install-cta"
        onClick={onClick}
        aria-expanded={isIos ? showHint : undefined}
      >
        <Icon name="install" size={18} />
        <span>{strings.short}</span>
      </button>
      {isIos && showHint ? (
        <p role="status" className="install-hint">
          <Icon name="share-ios" size={16} />
          {strings.iosHint}
        </p>
      ) : null}
    </div>
  );
}
