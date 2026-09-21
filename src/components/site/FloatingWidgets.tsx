/**
 * Floating contact widgets (Phase 7 — Subsystem 4). RSC mounted in
 * (site)/layout.tsx: reads the enabled widgets and renders a bottom-anchored
 * cluster of contact buttons (phone, WhatsApp, Tripadvisor, email, messenger,
 * custom). Admin-managed via /admin/widgets — zero code changes to add/remove.
 *
 * Design choices:
 *   • Always-visible stacked buttons (no expand/collapse state) — the most
 *     reliable, testable UX for a few contact affordances; needs no client JS,
 *     so this stays a server component. Hover labels + reduced-motion are CSS.
 *   • Two independent stacks: bottom-right and/or bottom-left, each ordered by
 *     sortOrder. z-index: var(--z-chat) — below the cookie sheet so the banner
 *     wins when open (correct consent-first UX).
 *   • showDesktop/showMobile gate visibility via CSS classes (≥44px targets).
 *   • href scheme is allowlisted at write time; tel:/mailto: open same-tab,
 *     https: opens a new tab with rel="noopener noreferrer".
 */
import type { JSX } from "react";
import { getEnabledWidgets } from "@/server/widgets";
import { Icon } from "@/components/ui/Icon";
import type { PublicWidget, WidgetPosition } from "@/content/widget-admin-schema";

function visibilityClass(w: PublicWidget): string {
  if (w.showDesktop && w.showMobile) return "";
  if (w.showDesktop) return " fw-btn--desktop-only";
  if (w.showMobile) return " fw-btn--mobile-only";
  return " fw-btn--hidden"; // neither → effectively off (also filtered below)
}

function externalProps(href: string): { target?: string; rel?: string } {
  if (href.startsWith("tel:") || href.startsWith("mailto:")) return {};
  return { target: "_blank", rel: "noopener noreferrer" };
}

function Stack({ widgets, position }: { widgets: PublicWidget[]; position: WidgetPosition }): JSX.Element | null {
  const inStack = widgets.filter((w) => w.position === position && (w.showDesktop || w.showMobile));
  if (inStack.length === 0) return null;
  return (
    <div className={`fw-cluster fw-cluster--${position}`} role="group" aria-label="Contact options">
      {inStack.map((w) => (
        <a
          key={w.id}
          href={w.href}
          className={`fw-btn${visibilityClass(w)}`}
          style={{ backgroundColor: w.bgColor }}
          aria-label={w.label}
          {...externalProps(w.href)}
        >
          <Icon name={w.iconKey} size={24} />
          <span className="fw-btn__label">{w.label}</span>
        </a>
      ))}
    </div>
  );
}

export async function FloatingWidgets(): Promise<JSX.Element | null> {
  const widgets = await getEnabledWidgets();
  if (widgets.length === 0) return null;
  return (
    <>
      <Stack widgets={widgets} position="bottom-right" />
      <Stack widgets={widgets} position="bottom-left" />
    </>
  );
}

export default FloatingWidgets;
