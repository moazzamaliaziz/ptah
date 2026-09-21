/**
 * Shared navigation-URL scheme allowlist for Phase 7 admin-editable links
 * (branding socials, CTA hrefs, floating-widget targets).
 *
 * Mirrors the security rule established in content/landing-schema.ts (Phase 2
 * stored-XSS hardening): React renders an `href` verbatim, so any admin-editable
 * href is a stored-XSS sink unless restricted to schemes that cannot execute
 * script. Allowed:
 *   - relative paths  ("/tours", "/about#team", "/tours?type=classic")
 *   - absolute https:// (external links)
 *   - mailto: / tel:
 *
 * Rejected: protocol-relative "//host" (scheme-inherit / open-redirect),
 * `javascript:` and `data:` (script execution), and every other scheme.
 *
 * Pure + dependency-free (no zod / server-only) so it is unit-testable in the
 * Phase 7 probe and importable from both server and client modules.
 */
export const SAFE_URL_RE = /^(?:\/(?!\/)|https:\/\/|mailto:|tel:)/i;

/** True when `value` is a navigation target that cannot execute script. */
export function isSafeUrl(value: string): boolean {
  return SAFE_URL_RE.test(value.trim());
}

/**
 * Normalize a phone number to the digits (plus a single leading `+`) that
 * `tel:` and `https://wa.me/<digits>` expect. Returns "" when no digits remain.
 */
export function normalizePhone(raw: string): string {
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/[^\d]/g, "");
  if (!digits) return "";
  return hasPlus ? `+${digits}` : digits;
}
