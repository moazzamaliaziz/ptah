/**
 * Phase 7 — Subsystem 1 (Foundations) probe.
 *
 * Verifies, end to end, the two things a unit test can't reach through the
 * `server-only` boundary:
 *   (A) the pure upload validators (MIME allowlist, magic-byte sniff, spoof
 *       rejection, SVG sanitization, dimension parse) — imported directly; and
 *   (B) the media + settings DB round-trip against the real MySQL (create with
 *       blob, blob-free summary read, serving-shape read, checksum dedupe,
 *       cascade delete; SiteSetting upsert/read/delete).
 *
 * Run:
 *   DATABASE_URL="mysql://ptah:ptah-dev-password@127.0.0.1:3306/ptah_tours" npx tsx scripts/phase7-foundations.mts
 *
 * tsx does not resolve the `@/` alias, so media-validation (node:crypto only)
 * is imported by relative path and the DB client is built here (server-only
 * db.ts would break tsx), exactly like scripts/phase3-db-probe.mts.
 */
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import {
  validateUpload,
  sanitizeSvg,
  sniffImageMime,
} from "../src/lib/media-validation";

const url = process.env.DATABASE_URL ?? "mysql://ptah:ptah-dev-password@127.0.0.1:3306/ptah_tours";
const db = new PrismaClient({ adapter: new PrismaMariaDb(url) });

let failures = 0;
function check(label: string, cond: boolean): void {
  console.log(`${cond ? "PASS" : "FAIL"}  ${label}`);
  if (!cond) failures++;
}

/** A minimal 24-byte buffer with a valid PNG signature + 1×1 dimensions. */
function fakePng(): Buffer {
  const b = Buffer.alloc(24);
  b.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
  b.writeUInt32BE(1, 16); // width
  b.writeUInt32BE(1, 20); // height
  return b;
}

async function main(): Promise<void> {
  // ── (A) Pure validators ──────────────────────────────────────────────────
  const okPng = validateUpload("image/png", fakePng());
  check("accepts a real PNG (magic bytes match)", okPng.ok === true);
  check("parses PNG dimensions (1×1)", okPng.ok === true && okPng.width === 1 && okPng.height === 1);

  const badMime = validateUpload("application/pdf", fakePng());
  check("rejects a non-allowlisted MIME", badMime.ok === false);

  const empty = validateUpload("image/png", Buffer.alloc(0));
  check("rejects an empty file", empty.ok === false);

  // Declared PNG but the bytes are actually SVG → spoof, must reject.
  const svgBytes = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"></svg>', "utf8");
  const spoof = validateUpload("image/png", svgBytes);
  check("rejects declared-vs-actual MIME mismatch (png declared, svg bytes)", spoof.ok === false);

  check("sniffs svg from leading <svg", sniffImageMime(svgBytes) === "image/svg+xml");

  // SVG with active content → sanitized (script stripped), and still accepted.
  const activeSvg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script><rect onload="x()"/></svg>', "utf8");
  const cleaned = sanitizeSvg(activeSvg).toString("utf8");
  check("sanitizeSvg strips <script>", !/script/i.test(cleaned));
  check("sanitizeSvg strips on* handlers", !/onload/i.test(cleaned));
  const svgResult = validateUpload("image/svg+xml", activeSvg);
  check("accepts SVG upload and returns sanitized bytes", svgResult.ok === true && !/script/i.test(svgResult.bytes.toString("utf8")));

  // Oversize raster → reject (declare a 9 MB buffer with a PNG header).
  const huge = Buffer.concat([fakePng(), Buffer.alloc(9 * 1024 * 1024)]);
  const oversize = validateUpload("image/png", huge);
  check("rejects oversize raster (>8 MB)", oversize.ok === false);

  // ── (B) DB round-trip: media ─────────────────────────────────────────────
  const testChecksum = "probe" + Date.now().toString(16).padStart(59, "0"); // 64 hex-ish chars
  const created = await db.mediaAsset.create({
    data: {
      filename: "probe.png",
      mimeType: "image/png",
      byteSize: okPng.ok ? okPng.byteSize : 24,
      width: 1,
      height: 1,
      checksum: testChecksum.slice(0, 64),
      folder: "general",
      blob: { create: { bytes: new Uint8Array(fakePng()) } },
    },
    select: { id: true },
  });
  check("media asset + blob created", !!created.id);

  // Summary read must NOT include bytes.
  const summary = await db.mediaAsset.findUnique({
    where: { id: created.id },
    select: { id: true, filename: true, mimeType: true, byteSize: true, folder: true },
  });
  check("summary read returns metadata without bytes", !!summary && !("bytes" in (summary as object)));

  // Serving-shape read: bytes come back as a binary buffer.
  const serving = await db.mediaAsset.findUnique({
    where: { id: created.id },
    select: { mimeType: true, checksum: true, blob: { select: { bytes: true } } },
  });
  const servedBytes = serving?.blob?.bytes;
  check("serving read returns bytes as Uint8Array", servedBytes instanceof Uint8Array && servedBytes.byteLength === 24);

  // Dedupe: a second lookup by the same checksum finds the existing row.
  const dupe = await db.mediaAsset.findFirst({ where: { checksum: testChecksum.slice(0, 64) }, select: { id: true } });
  check("checksum dedupe lookup finds the existing asset", dupe?.id === created.id);

  // Cascade delete: removing the asset removes its blob.
  await db.mediaAsset.delete({ where: { id: created.id } });
  const blobGone = await db.mediaBlob.findUnique({ where: { mediaId: created.id } });
  check("blob cascade-deletes with its asset", blobGone === null);

  // ── (B) DB round-trip: settings ──────────────────────────────────────────
  const key = "branding.siteName";
  await db.siteSetting.upsert({
    where: { key },
    update: { value: JSON.stringify("Probe Co") },
    create: { key, value: JSON.stringify("Probe Co") },
  });
  const readBack = await db.siteSetting.findUnique({ where: { key } });
  check("site setting upsert + read round-trips JSON", !!readBack && JSON.parse(readBack.value) === "Probe Co");
  // Clean up so the real default (siteMeta.name) is served again.
  await db.siteSetting.delete({ where: { key } });
  const settingGone = await db.siteSetting.findUnique({ where: { key } });
  check("site setting deleted (falls back to default)", settingGone === null);

  console.log(`\n${failures === 0 ? "ALL PASS" : `${failures} FAILURE(S)`}`);
  if (failures > 0) process.exitCode = 1;
}

main()
  .catch((e) => {
    console.error("PROBE_FAIL", e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
