"use client";

/**
 * Inert demo form — prevents the browser's default submission.
 *
 * Phase 0 rationale: without this, a bare <form> submits via GET to the
 * current URL, placing credentials (e.g. `?password=...`) into the address
 * bar, history, and any server/proxy logs. The real auth Server Actions
 * (auth phase) will replace this component; until then the demo forms must
 * never actually submit.
 */
import type { FormEvent, ReactNode } from "react";

export default function NoSubmitForm({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <form className={className} onSubmit={(e: FormEvent) => e.preventDefault()}>
      {children}
    </form>
  );
}