/**
 * Next-coupled RBAC guards (Phase 2, Q12).
 *
 * The pure policy (capability matrix, `can`, `isStaff`, `assertCapability`)
 * lives in capabilities.ts so it is unit-testable without Next/DB. This module
 * adds the request-time guards used by admin pages/layouts: they resolve the
 * current session user and `redirect()` on failure. Authorization is ALWAYS
 * enforced here (and re-checked in mutating server actions) — UI hiding via
 * `can` is convenience only.
 */
import "server-only";
import { redirect } from "next/navigation";
import type { SessionUser } from "@/server/auth/session";
import { getSessionUser } from "@/server/auth/session";
import { can, isStaff, type Capability } from "@/server/auth/capabilities";

export {
  can,
  isStaff,
  assertCapability,
  AuthzError,
  STAFF_ROLES,
  CAPABILITY_MATRIX,
  type Capability,
} from "@/server/auth/capabilities";

/**
 * Guard for admin pages/layouts: resolves the current user or redirects.
 * Unauthenticated → /admin/login (with a return path). Authenticated but not
 * staff → /admin/forbidden. Returns the staff user on success.
 */
export async function requireStaff(returnTo?: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    const q = returnTo ? `?from=${encodeURIComponent(returnTo)}` : "";
    redirect(`/admin/login${q}`);
  }
  if (!isStaff(user)) redirect("/admin/forbidden");
  return user;
}

/** Guard requiring a specific capability; same redirect semantics as above. */
export async function requireCapability(cap: Capability, returnTo?: string): Promise<SessionUser> {
  const user = await requireStaff(returnTo);
  if (!can(user, cap)) redirect("/admin/forbidden");
  return user;
}

/**
 * Guard for the public customer account area: resolves the current user or
 * redirects to the public /login (with a return path). Any ACTIVE authenticated
 * user passes — this is authentication, not a staff/capability check. Staff also
 * pass (they are users too), so the account area is reachable by everyone signed
 * in. Returns the user on success.
 */
export async function requireUser(returnTo?: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    const q = returnTo ? `?from=${encodeURIComponent(returnTo)}` : "";
    redirect(`/login${q}`);
  }
  return user;
}
