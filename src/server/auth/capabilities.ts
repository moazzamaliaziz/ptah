/**
 * Pure RBAC policy — capability matrix + predicates (Phase 2, Q12).
 *
 * Deliberately free of `server-only`, Next, and the DB so the authorization
 * matrix can be unit-tested in isolation (see the RBAC negative tests). The
 * Next-coupled guards (redirect, session lookup) live in rbac.ts and build on
 * these primitives.
 */
import type { Role } from "@prisma/client";

export const STAFF_ROLES: readonly Role[] = ["SUPER_ADMIN", "ADMIN", "EDITOR", "SUPPORT"];

export type Capability =
  | "admin.access"
  | "content.view"
  | "content.edit"
  | "toggles.view"
  | "toggles.edit"
  | "integrations.view"
  | "integrations.manage"
  | "bookings.view"
  | "bookings.edit"
  | "users.manage"
  | "audit.view"
  // Phase 7 (admin CMS completion) — catalog, media, branding, widgets.
  | "catalog.view"
  | "catalog.edit"
  | "media.view"
  | "media.manage"
  | "branding.view"
  | "branding.edit"
  | "widgets.view"
  | "widgets.edit"
  // Events/festivals + trip-idea themes (editorial content, catalog-shaped).
  | "events.view"
  | "events.edit"
  | "tripideas.view"
  | "tripideas.edit"
  // Contact-form inbox (customer enquiries).
  | "enquiries.view"
  | "enquiries.manage";

/** Which roles hold each capability. Absence = denied (no implicit bypass). */
export const CAPABILITY_MATRIX: Record<Capability, readonly Role[]> = {
  "admin.access": ["SUPER_ADMIN", "ADMIN", "EDITOR", "SUPPORT"],
  "content.view": ["SUPER_ADMIN", "ADMIN", "EDITOR", "SUPPORT"],
  "content.edit": ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  "toggles.view": ["SUPER_ADMIN", "ADMIN", "SUPPORT"],
  "toggles.edit": ["SUPER_ADMIN", "ADMIN"],
  "integrations.view": ["SUPER_ADMIN", "ADMIN"],
  "integrations.manage": ["SUPER_ADMIN", "ADMIN"],
  "bookings.view": ["SUPER_ADMIN", "ADMIN", "EDITOR", "SUPPORT"],
  "bookings.edit": ["SUPER_ADMIN", "ADMIN"],
  "users.manage": ["SUPER_ADMIN"],
  "audit.view": ["SUPER_ADMIN", "ADMIN"],
  // Catalog (tours + destinations): editors curate content; support reads only.
  "catalog.view": ["SUPER_ADMIN", "ADMIN", "EDITOR", "SUPPORT"],
  "catalog.edit": ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  // Media library: same shape as catalog (editors upload/manage, support views).
  "media.view": ["SUPER_ADMIN", "ADMIN", "EDITOR", "SUPPORT"],
  "media.manage": ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  // Branding + floating widgets: global site identity — admins only.
  "branding.view": ["SUPER_ADMIN", "ADMIN"],
  "branding.edit": ["SUPER_ADMIN", "ADMIN"],
  "widgets.view": ["SUPER_ADMIN", "ADMIN"],
  "widgets.edit": ["SUPER_ADMIN", "ADMIN"],
  // Events + trip ideas: editorial content — editors curate, support reads.
  "events.view": ["SUPER_ADMIN", "ADMIN", "EDITOR", "SUPPORT"],
  "events.edit": ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  "tripideas.view": ["SUPER_ADMIN", "ADMIN", "EDITOR", "SUPPORT"],
  "tripideas.edit": ["SUPER_ADMIN", "ADMIN", "EDITOR"],
  // Enquiries: support triages the inbox; admins can delete. Editors excluded
  // (customer PII is a support/admin concern, not content editing).
  "enquiries.view": ["SUPER_ADMIN", "ADMIN", "SUPPORT"],
  "enquiries.manage": ["SUPER_ADMIN", "ADMIN"],
};

export function can(user: { role: Role } | null | undefined, cap: Capability): boolean {
  if (!user) return false;
  return CAPABILITY_MATRIX[cap].includes(user.role);
}

export function isStaff(user: { role: Role } | null | undefined): boolean {
  return !!user && STAFF_ROLES.includes(user.role);
}

/** Thrown by assertCapability; server actions catch it and return a safe error. */
export class AuthzError extends Error {
  constructor(public readonly capability: Capability) {
    super(`Forbidden: missing capability "${capability}"`);
    this.name = "AuthzError";
  }
}

export function assertCapability(
  user: { role: Role } | null,
  cap: Capability,
): void {
  if (!can(user, cap)) throw new AuthzError(cap);
}
