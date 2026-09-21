import type { ReactNode } from "react";
import { requireUser } from "@/server/auth/rbac";

/**
 * Account-area guard (Phase 6 hardening). Enforcing auth in the LAYOUT — the
 * way the admin `(protected)` area does — makes the redirect resolve before the
 * account page streams, so an unauthenticated request gets a clean server-side
 * redirect to `/login?from=/account` rather than a 200 whose RSC payload merely
 * carries a client-side redirect. `force-dynamic` because it reads the session
 * cookie (and the account pages are per-user, never cached).
 *
 * The page still calls `requireUser` too (defense in depth); this layer just
 * guarantees the guard runs first.
 */
export const dynamic = "force-dynamic";

export default async function AccountLayout({ children }: { children: ReactNode }) {
  await requireUser("/account");
  return <>{children}</>;
}
