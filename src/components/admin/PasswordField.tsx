"use client";

/**
 * Admin password input with a show/hide toggle (login redesign).
 *
 * The field name stays `password` and autoComplete stays `current-password`, so
 * the sign-in Server Action and password managers behave exactly as before —
 * this is presentation only. The eye button flips the input `type` between
 * `password` and `text`; its accessible label swaps with the state and it is
 * `tabIndex={-1}` so keyboard users tab straight from the field to the submit
 * button (they can still reach it, it's just not in the primary flow).
 */
import { useState, type JSX } from "react";

export default function PasswordField({
  label,
  showLabel,
  hideLabel,
}: {
  label: string;
  showLabel: string;
  hideLabel: string;
}): JSX.Element {
  const [visible, setVisible] = useState(false);

  return (
    <label className="admin-field">
      <span>{label}</span>
      <span className="admin-pw">
        <input
          className="admin-input admin-pw__input"
          type={visible ? "text" : "password"}
          name="password"
          autoComplete="current-password"
          required
        />
        <button
          type="button"
          className="admin-pw__toggle"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? hideLabel : showLabel}
          aria-pressed={visible}
          title={visible ? hideLabel : showLabel}
          tabIndex={-1}
        >
          {visible ? <EyeOff /> : <Eye />}
        </button>
      </span>
    </label>
  );
}

/* Inline SVGs (no icon dependency); decorative, so aria-hidden. */
function Eye(): JSX.Element {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function EyeOff(): JSX.Element {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2M9.9 5.2A9.5 9.5 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.3 4M6.6 6.6A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 3.4-.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
