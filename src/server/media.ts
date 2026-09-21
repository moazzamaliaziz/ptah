/**
 * Media library service (Phase 7 — Subsystem 1, D1: media bytes stored in MySQL).
 *
 * WordPress-style library: image bytes live in `media_blobs` (LONGBLOB), metadata
 * in `media_assets`. The split means listings (`listMedia`) NEVER load bytes —
 * only the serving route (`getMediaBlob`) selects them.
 *
 * Upload is security-critical and goes through the pure validators in
 * src/lib/media-validation.ts (MIME allowlist + magic-byte sniff + size cap +
 * SVG sanitization + declared-vs-actual mismatch rejection). This module owns
 * persistence + dedupe only; authorization (`media.manage`) and audit are the
 * caller's (server action) responsibility.
 */
import "server-only";
import { db } from "@/lib/db";
import { validateUpload, ALLOWED_IMAGE_MIME } from "@/lib/media-validation";
import { MEDIA_FOLDERS, isMediaFolder, type MediaFolder, type MediaSummary } from "@/lib/media-shared";

// Re-export the client-safe domain constants/types so existing server-side
// importers (`@/server/media`) keep working unchanged. Client components must
// import these from `@/lib/media-shared` directly (this module is server-only).
export { MEDIA_FOLDERS, isMediaFolder, type MediaFolder, type MediaSummary };

const SUMMARY_SELECT = {
  id: true,
  filename: true,
  mimeType: true,
  byteSize: true,
  width: true,
  height: true,
  altText: true,
  folder: true,
  createdAt: true,
} as const;

export interface CreateMediaInput {
  filename: string;
  declaredMime: string;
  bytes: Buffer;
  folder?: string;
  altText?: string | null;
}

export type CreateMediaResult =
  | { ok: true; asset: MediaSummary; deduped: boolean }
  | { ok: false; error: string };

function normalizeFolder(folder?: string): MediaFolder {
  return folder && isMediaFolder(folder) ? folder : "general";
}

/** A safe, extension-normalized display filename (never used as a filesystem path). */
function safeFilename(original: string, mimeType: string): string {
  const ext = ALLOWED_IMAGE_MIME[mimeType] ?? "bin";
  const base = original
    .replace(/\.[^.]+$/, "") // drop original extension
    .replace(/[^\w.-]+/g, "-") // keep word chars, dot, dash
    .replace(/^-+|-+$/g, "")
    .slice(0, 200)
    .toLowerCase();
  return `${base || "image"}.${ext}`;
}

/**
 * Validate + persist an uploaded image. Deduplicates by sha256 checksum: an
 * identical upload reuses the existing asset (returns it with `deduped: true`)
 * instead of storing the bytes twice.
 */
export async function createMedia(input: CreateMediaInput): Promise<CreateMediaResult> {
  const validation = validateUpload(input.declaredMime, input.bytes);
  if (!validation.ok) return { ok: false, error: validation.error };

  const folder = normalizeFolder(input.folder);
  const altText = input.altText?.trim() ? input.altText.trim().slice(0, 512) : null;

  // Dedupe: an asset with the same content already exists → reuse it.
  const existing = await db.mediaAsset.findFirst({
    where: { checksum: validation.checksum },
    select: SUMMARY_SELECT,
  });
  if (existing) return { ok: true, asset: existing, deduped: true };

  const asset = await db.mediaAsset.create({
    data: {
      filename: safeFilename(input.filename, validation.mimeType),
      mimeType: validation.mimeType,
      byteSize: validation.byteSize,
      width: validation.width,
      height: validation.height,
      checksum: validation.checksum,
      altText,
      folder,
      // new Uint8Array(buf) yields Uint8Array<ArrayBuffer> — the exact type the
      // Prisma `Bytes` column expects (a Buffer is typed Uint8Array<ArrayBufferLike>).
      blob: { create: { bytes: new Uint8Array(validation.bytes) } },
    },
    select: SUMMARY_SELECT,
  });
  return { ok: true, asset, deduped: false };
}

/** List library assets (metadata only), newest first, optionally by folder. */
export async function listMedia(folder?: string): Promise<MediaSummary[]> {
  const where = folder && isMediaFolder(folder) ? { folder } : {};
  return db.mediaAsset.findMany({
    where,
    select: SUMMARY_SELECT,
    orderBy: { createdAt: "desc" },
    take: 500,
  });
}

/** One asset's metadata, or null. */
export async function getMedia(id: string): Promise<MediaSummary | null> {
  return db.mediaAsset.findUnique({ where: { id }, select: SUMMARY_SELECT });
}

export interface MediaBlobResult {
  mimeType: string;
  checksum: string;
  bytes: Uint8Array;
}

/**
 * Fetch bytes + the headers the serving route needs. Returns null when the row
 * (or its blob) is missing. This is the ONLY function that reads blob bytes.
 */
export async function getMediaBlob(id: string): Promise<MediaBlobResult | null> {
  const row = await db.mediaAsset.findUnique({
    where: { id },
    select: { mimeType: true, checksum: true, blob: { select: { bytes: true } } },
  });
  if (!row || !row.blob) return null;
  return { mimeType: row.mimeType, checksum: row.checksum, bytes: row.blob.bytes };
}

/** Update an asset's alt text (accessibility metadata). Returns the fresh summary. */
export async function updateMediaAltText(id: string, altText: string): Promise<MediaSummary> {
  const trimmed = altText.trim().slice(0, 512);
  return db.mediaAsset.update({
    where: { id },
    data: { altText: trimmed || null },
    select: SUMMARY_SELECT,
  });
}

/** Hard-delete an asset; the blob row cascades (schema onDelete: Cascade). */
export async function deleteMedia(id: string): Promise<void> {
  await db.mediaAsset.delete({ where: { id } });
}
