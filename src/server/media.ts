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
import sharp from "sharp";
import { db } from "@/lib/db";
import {
  validateUpload,
  ALLOWED_IMAGE_MIME,
  CONVERT_TO_WEBP_MIME,
  UNSUPPORTED_IMAGE_HINTS,
  MAX_RASTER_BYTES,
  sniffImageMime,
} from "@/lib/media-validation";
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

/** Raster formats sharp's prebuilt binary can decode — used to backfill dims. */
const SHARP_READABLE = new Set([
  "image/avif",
  "image/webp",
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/tiff",
]);

interface PreparedUpload {
  /** Final MIME to validate + store (WebP for transcoded inputs). */
  declaredMime: string;
  /** Final bytes to validate + store. */
  bytes: Buffer;
}

/**
 * Pre-process raw upload bytes before the pure (sync) validator sees them:
 *   • refuse recognized-but-unsupported types (HEIC/HEIF) with a helpful hint;
 *   • transcode convert-only types (TIFF) to WebP via sharp, so the stored
 *     bytes are always something a browser can render from /api/media/<id>;
 *   • otherwise pass the bytes through unchanged.
 * A cheap raw-size guard runs first so we never hand a huge buffer to sharp.
 */
async function prepareUpload(
  declaredMime: string,
  input: Buffer,
): Promise<{ ok: true; prepared: PreparedUpload } | { ok: false; error: string }> {
  if (input.length === 0) return { ok: false, error: "File is empty." };
  if (input.length > MAX_RASTER_BYTES) {
    return {
      ok: false,
      error: `File too large (${(input.length / 1024 / 1024).toFixed(1)} MB). Max ${(MAX_RASTER_BYTES / 1024 / 1024).toFixed(1)} MB.`,
    };
  }

  const sniffed = sniffImageMime(input);
  if (sniffed && UNSUPPORTED_IMAGE_HINTS[sniffed]) {
    return { ok: false, error: UNSUPPORTED_IMAGE_HINTS[sniffed] };
  }
  if (sniffed && CONVERT_TO_WEBP_MIME.has(sniffed)) {
    try {
      const webp = await sharp(input).webp({ quality: 82 }).toBuffer();
      return { ok: true, prepared: { declaredMime: "image/webp", bytes: webp } };
    } catch {
      return { ok: false, error: "Could not read that image file — it may be corrupt." };
    }
  }
  return { ok: true, prepared: { declaredMime, bytes: input } };
}

/**
 * Validate + persist an uploaded image. HEIC/HEIF is refused and TIFF is
 * transcoded to WebP up front (see prepareUpload); the pure validator then
 * gates the final bytes. Deduplicates by sha256 checksum: an identical upload
 * reuses the existing asset (returns it with `deduped: true`) instead of
 * storing the bytes twice.
 */
export async function createMedia(input: CreateMediaInput): Promise<CreateMediaResult> {
  const prep = await prepareUpload(input.declaredMime, input.bytes);
  if (!prep.ok) return { ok: false, error: prep.error };

  const validation = validateUpload(prep.prepared.declaredMime, prep.prepared.bytes);
  if (!validation.ok) return { ok: false, error: validation.error };

  // Backfill dimensions for formats the pure header parser can't read (e.g.
  // AVIF) but sharp can. Best-effort — never fatal; dims stay null on failure.
  let { width, height } = validation;
  if ((width === null || height === null) && SHARP_READABLE.has(validation.mimeType)) {
    try {
      const meta = await sharp(validation.bytes).metadata();
      if (typeof meta.width === "number" && typeof meta.height === "number") {
        width = meta.width;
        height = meta.height;
      }
    } catch {
      /* best-effort; leave dims null */
    }
  }

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
      width,
      height,
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

/** A logo prepared for embedding in a server-rendered PDF (react-pdf `<Image>`). */
export interface PdfImageBytes {
  data: Buffer;
  /** react-pdf's <Image> only decodes these two — everything else is rasterized to PNG. */
  format: "png" | "jpg";
  width: number;
  height: number;
}

/**
 * Load a media asset as PNG/JPEG bytes for embedding in a server-generated PDF.
 * react-pdf's `<Image>` supports ONLY PNG and JPEG, so PNG/JPEG originals pass
 * through untouched while every other stored format (WebP/AVIF/GIF/SVG) is
 * rasterized to PNG via sharp. Best-effort: returns null when the asset is
 * missing or cannot be decoded, so the caller falls back to a text-only header
 * instead of failing the whole render.
 */
export async function getMediaAsPngOrJpeg(id: string): Promise<PdfImageBytes | null> {
  const blob = await getMediaBlob(id);
  if (!blob) return null;
  const src = Buffer.from(blob.bytes);
  try {
    if (blob.mimeType === "image/png" || blob.mimeType === "image/jpeg") {
      const meta = await sharp(src).metadata();
      return {
        data: src,
        format: blob.mimeType === "image/png" ? "png" : "jpg",
        width: meta.width ?? 0,
        height: meta.height ?? 0,
      };
    }
    const png = await sharp(src).png().toBuffer({ resolveWithObject: true });
    return { data: png.data, format: "png", width: png.info.width, height: png.info.height };
  } catch {
    return null; // unreadable/corrupt — caller renders the text wordmark instead
  }
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
