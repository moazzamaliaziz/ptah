"use client";

/**
 * Submit button with an automatic pending state.
 *
 * Server Actions give no built-in "in flight" feedback, so a plain submit
 * button looks frozen while the action runs (a network hop + DB round trips).
 * Users then think it's stuck and either wait or mash the button — the reported
 * "login looks stuck" and "sign-out needs 4-5 clicks" bugs. useFormStatus reads
 * the enclosing <form>'s pending state; while pending we DISABLE the button
 * (blocking duplicate submits) and swap in a "working…" label, so there is
 * instant feedback no matter how slow the backend is.
 */
import { useFormStatus } from "react-dom";
import type { CSSProperties, JSX, ReactNode } from "react";

export default function SubmitButton({
  children,
  pendingLabel,
  className = "admin-btn",
  style,
}: {
  children: ReactNode;
  /** Shown in place of `children` while the action is running. */
  pendingLabel?: ReactNode;
  className?: string;
  style?: CSSProperties;
}): JSX.Element {
  const { pending } = useFormStatus();
  return (
    <button
      className={className}
      type="submit"
      disabled={pending}
      aria-busy={pending}
      style={style}
    >
      {pending ? pendingLabel ?? children : children}
    </button>
  );
}
