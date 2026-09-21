"use client";

import { useFormStatus } from "react-dom";
import { type JSX, type ReactNode } from "react";

export interface ConfirmSubmitButtonProps {
  /** Confirmation prompt shown before the form submits. */
  confirm: string;
  children: ReactNode;
  className?: string;
  /** Label shown while the parent form action is pending. */
  pendingLabel?: string;
}

/**
 * A submit button that requires an explicit confirm() before its form submits —
 * guards destructive server actions (delete tour/departure/day) against a
 * fat-finger single click. Uses useFormStatus so it also disables + shows a
 * pending label while the action runs. Must be rendered inside a <form>.
 */
export default function ConfirmSubmitButton({
  confirm,
  children,
  className = "admin-btn admin-btn--danger",
  pendingLabel,
}: ConfirmSubmitButtonProps): JSX.Element {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className={className}
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(confirm)) e.preventDefault();
      }}
    >
      {pending && pendingLabel ? pendingLabel : children}
    </button>
  );
}
