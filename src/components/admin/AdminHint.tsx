import type { JSX } from "react";

/**
 * A small "?" help chip that reveals a plain-language explanation on hover or
 * keyboard focus (P8 admin UX polish). Pure markup — no client JS — so it drops
 * straight into any admin server component. The explanation is exposed to
 * assistive tech via `aria-label`; the visible bubble is decorative (aria-hidden)
 * to avoid a double announcement.
 *
 * Usage: <AdminHint text="What this number means, in easy words." />
 */
export default function AdminHint({ text, label }: { text: string; label?: string }): JSX.Element {
  return (
    <span className="admin-hint">
      <span className="admin-hint__trigger" role="note" tabIndex={0} aria-label={label ?? `Help: ${text}`}>
        ?
      </span>
      <span className="admin-hint__bubble" aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
