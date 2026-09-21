/**
 * Media serving route (Phase 7 — Subsystem 1). GET /api/media/<uuid>.
 *
 * Streams the bytes for a MediaAsset from MySQL. The id is an immutable UUID and
 * the content is content-addressed (checksum ETag), so responses are cached
 * `immutable` for a year — next/image optimizes this same-origin, extensionless
 * URL with zero extra config, and `img-src 'self'` in the proxy CSP already
 * allows it.
 *
 * Security:
 *   - UUID primary-key lookup — no filesystem path is ever built, so there is no
 *     traversal surface (the `id` is only ever a DB key).
 *   - `X-Content-Type-Options: nosniff` on every response.
 *   - SVG (active XML, sanitized on upload) is additionally served under a
 *     restrictive `Content-Security-Policy: default-src 'none'; …` and
 *     `Content-Disposition: inline` so a stored vector cannot execute script or
 *     pull external resources even if a sanitizer gap is ever found.
 *   - Public read: media is public marketing imagery — no auth (uploads ARE
 *     gated by `media.manage`).
 */
import { getMediaBlob } from "@/server/media";

export const dynamic = "force-dynamic";

const IMMUTABLE_CACHE = "public, max-age=31536000, immutable";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;

  const blob = await getMediaBlob(id);
  if (!blob) {
    return new Response("Not found", { status: 404 });
  }

  const etag = `"${blob.checksum}"`;

  // Conditional request — content is immutable per id, so a checksum match is a
  // guaranteed hit.
  if (request.headers.get("if-none-match") === etag) {
    return new Response(null, {
      status: 304,
      headers: { ETag: etag, "Cache-Control": IMMUTABLE_CACHE },
    });
  }

  const headers = new Headers({
    "Content-Type": blob.mimeType,
    "Content-Length": String(blob.bytes.byteLength),
    "Cache-Control": IMMUTABLE_CACHE,
    ETag: etag,
    "X-Content-Type-Options": "nosniff",
  });

  if (blob.mimeType === "image/svg+xml") {
    headers.set(
      "Content-Security-Policy",
      "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    );
    headers.set("Content-Disposition", "inline");
  }

  // Copy into a standalone ArrayBuffer so the response body is a plain
  // BodyInit (the Prisma-returned view may be backed by a pooled buffer).
  const body = blob.bytes.slice().buffer;
  return new Response(body, { status: 200, headers });
}
