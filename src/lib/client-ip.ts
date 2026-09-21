/**
 * Trusted-proxy-aware client IP resolution (Phase 5).
 *
 * WHY THIS EXISTS: the naive `x-forwarded-for.split(",")[0]` (leftmost entry)
 * that used to be inlined at every rate-limit call site is CLIENT-SPOOFABLE.
 * `X-Forwarded-For` is a list that each proxy APPENDS to with the address that
 * connected to it. A hostile client can send `X-Forwarded-For: 1.2.3.4` and the
 * outermost trusted proxy appends the real client IP AFTER it — so the leftmost
 * value is attacker-controlled, while the trustworthy client IP sits N entries
 * from the RIGHT, where N = the number of proxies we sit behind.
 *
 * Chain example (client → nginx → app, TRUSTED_PROXY_COUNT=1):
 *   client sends:  X-Forwarded-For: evil.spoof
 *   nginx appends: X-Forwarded-For: evil.spoof, <realClientIp>
 *   → the real client is the LAST entry, not the first.
 *
 * So we index `length - trustedProxyCount` from the left (clamped ≥ 0): the
 * entries a trusted proxy added are the rightmost `trustedProxyCount`, and the
 * originating client is the one immediately before them. Anything further left
 * is untrusted client-supplied noise and is ignored.
 *
 * Deployment note: set TRUSTED_PROXY_COUNT to the exact number of reverse
 * proxies in front of the app (default 1 — the single-VPS + one nginx shape
 * this project targets). Setting it too HIGH lets a client spoof by padding the
 * header; too LOW rate-limits everyone behind the proxy as one bucket. There is
 * no socket peer address available inside Server Actions / route handlers, so
 * this header chain is the only signal — hence the strict, count-based trust.
 *
 * server-only: reads the (server-only) env module.
 */
import "server-only";
import { env } from "@/lib/env";

/** Minimal structural view of the Next `headers()` result (avoids importing internals). */
export interface HeaderReader {
  get(name: string): string | null;
}

/** Loose IPv4/IPv6 shape check — rejects garbage so it can't become a rate-limit key. */
function looksLikeIp(value: string): boolean {
  if (value.length === 0 || value.length > 45) return false;
  // IPv4 dotted-quad, or IPv6 hex groups with colons. Deliberately permissive:
  // we only need to reject obvious junk / header-injection, not fully validate.
  return /^[0-9a-fA-F:.]+$/.test(value);
}

/** Strip an optional `:port` and IPv6 brackets a proxy may have added. */
function normalize(raw: string): string {
  let v = raw.trim();
  if (v.startsWith("[")) {
    // [::1]:1234 → ::1
    const end = v.indexOf("]");
    if (end !== -1) return v.slice(1, end);
  }
  // IPv4:port → IPv4 (only split when there's a single colon, so IPv6 is untouched).
  if (v.includes(".") && v.includes(":")) v = v.split(":")[0];
  return v;
}

/**
 * Resolve the best-effort client IP from request headers, honoring
 * TRUSTED_PROXY_COUNT. Returns `"unknown"` when nothing usable is present, so
 * callers always get a stable, non-empty rate-limit key.
 */
export function getClientIp(headers: HeaderReader): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map(normalize).filter((p) => p.length > 0);
    if (parts.length > 0) {
      const idx = Math.max(0, parts.length - env.TRUSTED_PROXY_COUNT);
      const candidate = parts[Math.min(idx, parts.length - 1)];
      if (candidate && looksLikeIp(candidate)) return candidate;
    }
  }

  // Fallbacks: nginx `X-Real-IP` (set, not appended, so trustworthy behind a
  // configured proxy), then give up with a stable sentinel.
  const realIp = headers.get("x-real-ip");
  if (realIp) {
    const v = normalize(realIp);
    if (looksLikeIp(v)) return v;
  }

  return "unknown";
}
