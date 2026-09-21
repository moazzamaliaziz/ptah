/**
 * Media upload validation — pure functions, no `server-only` / DB / Next imports
 * so the logic is unit-testable in isolation (see scripts/phase7-foundations.mts)
 * and importable from both the upload Server Action and probes.
 *
 * Defense in depth for user-uploaded bytes (Phase 7, D1 — media stored in MySQL):
 *   1. MIME allowlist            — only image types we intend to serve.
 *   2. Magic-byte sniffing       — the real bytes must match the declared MIME;
 *                                  a `.png` that is actually an HTML/JS payload
 *                                  is rejected (defeats content-type spoofing).
 *   3. Size caps                 — per-type ceilings (raster vs SVG) bound DB
 *                                  growth and the Server Action body.
 *   4. SVG sanitization          — strip <script>, on* handlers, and external
 *                                  refs before storage (SVG is XML → active).
 *   5. Dimension parse           — cheap header read (PNG/JPEG/WebP) for the
 *                                  library UI; best-effort, never fatal.
 */
import { createHash } from "node:crypto";

/** MIME → canonical extension. The keys ARE the upload allowlist. */
export const ALLOWED_IMAGE_MIME: Record<string, string> = {
  "image/webp": "webp",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
};

/** 8 MiB for raster; SVG/ICO are tiny by nature so cap them far lower. */
export const MAX_RASTER_BYTES = 8 * 1024 * 1024;
export const MAX_VECTOR_BYTES = 512 * 1024;

export interface MediaValidationOk {
  ok: true;
  mimeType: string;
  /** Sanitized bytes to persist (identical to input except sanitized SVG). */
  bytes: Buffer;
  byteSize: number;
  checksum: string;
  width: number | null;
  height: number | null;
}
export interface MediaValidationErr {
  ok: false;
  error: string;
}
export type MediaValidationResult = MediaValidationOk | MediaValidationErr;

/** sha256 hex of raw bytes — the media ETag and dedupe key. */
export function sha256Bytes(bytes: Buffer): string {
  return createHash("sha256").update(bytes).digest("hex");
}

/**
 * Sniff the true image type from magic bytes. Returns the canonical MIME, or
 * null if the bytes match no known image signature. SVG is text/XML so it is
 * detected by a leading `<?xml`/`<svg` token (after optional BOM/whitespace).
 */
export function sniffImageMime(bytes: Buffer): string | null {
  if (bytes.length >= 8 &&
      bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
      bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a) {
    return "image/png";
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (bytes.length >= 6 && bytes.toString("ascii", 0, 6).match(/^GIF8[79]a$/)) {
    return "image/gif";
  }
  if (bytes.length >= 12 &&
      bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") {
    return "image/webp";
  }
  // ICO: reserved(0x0000) + type(0x0001 icon | 0x0002 cursor); accept icon.
  if (bytes.length >= 4 && bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0x01 && bytes[3] === 0x00) {
    return "image/x-icon";
  }
  // SVG — skip a UTF-8 BOM and leading whitespace, then look for xml/svg.
  const head = bytes.subarray(0, 512).toString("utf8").replace(/^﻿/, "").trimStart().toLowerCase();
  if (head.startsWith("<?xml") || head.startsWith("<svg") || head.startsWith("<!doctype svg")) {
    return "image/svg+xml";
  }
  return null;
}

/** True when declared and sniffed MIME are the same image family (ico aliases unify). */
function mimeFamilyMatches(declared: string, sniffed: string): boolean {
  const norm = (m: string) => (m === "image/vnd.microsoft.icon" ? "image/x-icon" : m);
  return norm(declared) === norm(sniffed);
}

/**
 * Remove active content from an SVG so it is safe to store and serve via <img>:
 * drop <script> blocks, inline event handlers (on*=), <foreignObject>, and
 * javascript:/data: hrefs. Returns sanitized UTF-8 bytes.
 */
export function sanitizeSvg(bytes: Buffer): Buffer {
  let svg = bytes.toString("utf8");
  svg = svg.replace(/<script[\s\S]*?<\/script\s*>/gi, "");
  svg = svg.replace(/<foreignObject[\s\S]*?<\/foreignObject\s*>/gi, "");
  // on*="..." / on*='...' / on*=bare event handlers.
  svg = svg.replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  // javascript: or data: inside href/xlink:href.
  svg = svg.replace(/((?:xlink:)?href)\s*=\s*("|')\s*(?:javascript|data):[^"']*\2/gi, '$1=$2#$2');
  return Buffer.from(svg, "utf8");
}

/** Parse pixel dimensions from image headers where cheap. Best-effort → null. */
export function parseImageDimensions(bytes: Buffer, mime: string): { width: number; height: number } | null {
  try {
    if (mime === "image/png" && bytes.length >= 24) {
      return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
    }
    if (mime === "image/gif" && bytes.length >= 10) {
      return { width: bytes.readUInt16LE(6), height: bytes.readUInt16LE(8) };
    }
    if (mime === "image/jpeg") {
      let offset = 2;
      while (offset + 9 < bytes.length) {
        if (bytes[offset] !== 0xff) { offset++; continue; }
        const marker = bytes[offset + 1];
        // SOF0..SOF3, SOF5..SOF7, SOF9..SOF11, SOF13..SOF15 carry dimensions.
        if ((marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7) ||
            (marker >= 0xc9 && marker <= 0xcb) || (marker >= 0xcd && marker <= 0xcf)) {
          return { height: bytes.readUInt16BE(offset + 5), width: bytes.readUInt16BE(offset + 7) };
        }
        offset += 2 + bytes.readUInt16BE(offset + 2);
      }
    }
    if (mime === "image/webp" && bytes.length >= 30) {
      const format = bytes.toString("ascii", 12, 16);
      if (format === "VP8 ") {
        return { width: bytes.readUInt16LE(26) & 0x3fff, height: bytes.readUInt16LE(28) & 0x3fff };
      }
      if (format === "VP8L") {
        const b = bytes.readUInt32LE(21);
        return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
      }
      if (format === "VP8X") {
        const w = 1 + (bytes[24] | (bytes[25] << 8) | (bytes[26] << 16));
        const h = 1 + (bytes[27] | (bytes[28] << 8) | (bytes[29] << 16));
        return { width: w, height: h };
      }
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Full upload validation gate. `declaredMime` is the browser-reported type;
 * the real bytes must corroborate it. Returns the bytes to persist (SVG
 * sanitized), checksum, and parsed dimensions — or a safe error message.
 */
export function validateUpload(declaredMime: string, input: Buffer): MediaValidationResult {
  const mime = declaredMime.toLowerCase().trim();
  if (!(mime in ALLOWED_IMAGE_MIME)) {
    return { ok: false, error: `Unsupported file type "${declaredMime}". Allowed: JPEG, PNG, WebP, GIF, SVG, ICO.` };
  }
  if (input.length === 0) return { ok: false, error: "File is empty." };

  const isVector = mime === "image/svg+xml";
  const cap = isVector ? MAX_VECTOR_BYTES : MAX_RASTER_BYTES;
  if (input.length > cap) {
    return { ok: false, error: `File too large (${(input.length / 1024 / 1024).toFixed(1)} MB). Max ${(cap / 1024 / 1024).toFixed(1)} MB.` };
  }

  const sniffed = sniffImageMime(input);
  if (!sniffed) return { ok: false, error: "File content is not a recognized image." };
  if (!mimeFamilyMatches(mime, sniffed)) {
    return { ok: false, error: `File content (${sniffed}) does not match its type (${mime}).` };
  }

  const bytes = isVector ? sanitizeSvg(input) : input;
  const dims = parseImageDimensions(bytes, sniffed);
  return {
    ok: true,
    mimeType: mime,
    bytes,
    byteSize: bytes.length,
    checksum: sha256Bytes(bytes),
    width: dims?.width ?? null,
    height: dims?.height ?? null,
  };
}
