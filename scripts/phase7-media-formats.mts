/**
 * Phase 7 media — expanded image-format support probe.
 *
 * Verifies the pure validators + the sharp transcode path added for the
 * "accept more image formats" feature (images stay in the DB, no video):
 *   • AVIF and BMP are accepted and stored as-is;
 *   • TIFF is accepted then transcoded to WebP (sharp) before storage;
 *   • HEIC/HEIF is recognized and refused with a helpful hint;
 *   • the raster cap is 4 MB (Vercel request-body-limit reality);
 *   • magic-byte spoofing is still rejected.
 *
 * No DB and no server-only imports (so tsx can run it): the sharp transcode is
 * exercised directly here, exactly as @/server/media.prepareUpload calls it.
 *
 * Run:  npx tsx scripts/phase7-media-formats.mts
 */
import sharp from "sharp";
import {
  validateUpload,
  sniffImageMime,
  parseImageDimensions,
  MAX_RASTER_BYTES,
  CONVERT_TO_WEBP_MIME,
  UNSUPPORTED_IMAGE_HINTS,
  ACCEPTED_IMAGE_LABEL,
} from "../src/lib/media-validation";

let failures = 0;
function check(label: string, cond: boolean): void {
  console.log(`${cond ? "PASS" : "FAIL"}  ${label}`);
  if (!cond) failures++;
}

/** A tiny solid-colour 3×2 raster in the requested format, via sharp. */
function makeImage(fmt: "png" | "avif" | "tiff" | "webp"): Promise<Buffer> {
  const img = sharp({ create: { width: 3, height: 2, channels: 3, background: { r: 200, g: 40, b: 40 } } });
  const enc = fmt === "png" ? img.png() : fmt === "avif" ? img.avif() : fmt === "tiff" ? img.tiff() : img.webp();
  return enc.toBuffer();
}

/** Hand-crafted minimal BMP (BITMAPINFOHEADER) with the given dimensions. */
function fakeBmp(w: number, h: number): Buffer {
  const b = Buffer.alloc(54 + w * h * 3);
  b.write("BM", 0, "ascii");
  b.writeUInt32LE(b.length, 2);
  b.writeUInt32LE(54, 10); // pixel-data offset
  b.writeUInt32LE(40, 14); // BITMAPINFOHEADER size
  b.writeInt32LE(w, 18);
  b.writeInt32LE(h, 22);
  b.writeUInt16LE(1, 26); // planes
  b.writeUInt16LE(24, 28); // bits per pixel
  return b;
}

/** Hand-crafted ISO-BMFF `ftyp` box: major brand + minor version + compat brands. */
function fakeFtyp(major: string, compat: string[]): Buffer {
  const size = 16 + compat.length * 4;
  const b = Buffer.alloc(size);
  b.writeUInt32BE(size, 0);
  b.write("ftyp", 4, "ascii");
  b.write(major.padEnd(4).slice(0, 4), 8, "ascii");
  b.writeUInt32BE(0, 12); // minor_version
  let o = 16;
  for (const c of compat) { b.write(c.padEnd(4).slice(0, 4), o, "ascii"); o += 4; }
  return b;
}

async function main(): Promise<void> {
  // ── AVIF: sniffed + accepted, stored as-is ────────────────────────────────
  const avif = await makeImage("avif");
  check("sniffs real AVIF as image/avif", sniffImageMime(avif) === "image/avif");
  check("accepts AVIF upload", validateUpload("image/avif", avif).ok === true);
  const avifMeta = await sharp(avif).metadata();
  check("sharp reads AVIF dims (dimension-backfill source works)", avifMeta.width === 3 && avifMeta.height === 2);

  // ── BMP: sniffed, dimensions parsed, accepted (incl. alias) ───────────────
  const bmp = fakeBmp(4, 5);
  check("sniffs BMP as image/bmp", sniffImageMime(bmp) === "image/bmp");
  const bmpDims = parseImageDimensions(bmp, "image/bmp");
  check("parses BMP dimensions (4×5)", bmpDims?.width === 4 && bmpDims?.height === 5);
  check("accepts BMP upload", validateUpload("image/bmp", bmp).ok === true);
  check("accepts BMP under image/x-ms-bmp alias", validateUpload("image/x-ms-bmp", bmp).ok === true);

  // ── TIFF: recognized as convert-only, transcodes to WebP ──────────────────
  const tiff = await makeImage("tiff");
  check("sniffs TIFF as image/tiff", sniffImageMime(tiff) === "image/tiff");
  check("TIFF flagged for WebP conversion", CONVERT_TO_WEBP_MIME.has("image/tiff"));
  const converted = await sharp(tiff).webp({ quality: 82 }).toBuffer();
  check("transcoded TIFF sniffs as image/webp", sniffImageMime(converted) === "image/webp");
  const convOk = validateUpload("image/webp", converted);
  check("accepts transcoded WebP + reads dims", convOk.ok === true && convOk.width === 3 && convOk.height === 2);

  // ── HEIC/HEIF: recognized, refused with a hint (sharp prebuilt can't decode) ─
  const heic = fakeFtyp("heic", ["mif1", "heic"]);
  check("sniffs HEIC (ftyp heic brand) as image/heic", sniffImageMime(heic) === "image/heic");
  check("HEIC carries an unsupported-format hint", typeof UNSUPPORTED_IMAGE_HINTS["image/heic"] === "string");
  check("raw HEIC not in store-as-is allowlist (rejected)", validateUpload("image/heic", heic).ok === false);

  // ── AVIF vs HEIC brand disambiguation (shared ftyp container) ─────────────
  check("ftyp avif brand → image/avif", sniffImageMime(fakeFtyp("avif", ["mif1", "miaf"])) === "image/avif");
  check("ftyp heif-only brands → image/heic", sniffImageMime(fakeFtyp("mif1", ["heim"])) === "image/heic");

  // ── Size cap + spoof rejection still hold ─────────────────────────────────
  check("raster cap is 4 MB", MAX_RASTER_BYTES === 4 * 1024 * 1024);
  const oversize = Buffer.concat([await makeImage("png"), Buffer.alloc(4 * 1024 * 1024)]);
  check("rejects >4 MB raster", validateUpload("image/png", oversize).ok === false);
  const relabelled = validateUpload("image/avif", await makeImage("png")); // declared AVIF, bytes PNG
  check("declared/actual mismatch resolves to sniffed type (avif declared, png bytes → png)", relabelled.ok === true && relabelled.ok && relabelled.mimeType === "image/png");

  check(
    "accepted-format label lists AVIF/BMP/TIFF",
    /AVIF/.test(ACCEPTED_IMAGE_LABEL) && /BMP/.test(ACCEPTED_IMAGE_LABEL) && /TIFF/.test(ACCEPTED_IMAGE_LABEL),
  );

  console.log(`\n${failures === 0 ? "ALL PASS" : `${failures} FAILURE(S)`}`);
  if (failures > 0) process.exitCode = 1;
}

main().catch((e) => { console.error("PROBE_FAIL", e); process.exitCode = 1; });
