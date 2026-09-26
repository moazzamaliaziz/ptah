// PWA icon generator (spec §4, D2 "generate a monogram at build time").
//
// Renders a font-free, on-brand Ptah Tours mark (a gold desert pyramid + sun on
// the brand navy) to the exact PNG sizes a 2026 installable PWA needs:
//
//   public/icons/icon-192.png       192x192  purpose "any"
//   public/icons/icon-512.png       512x512  purpose "any"
//   public/icons/maskable-512.png   512x512  purpose "maskable" (safe-zone padded)
//   public/icons/apple-touch-180.png 180x180 apple-touch-icon (opaque, unrounded)
//
// The art is pure SVG shapes (no <text>), so rendering never depends on a system
// font being installed on the build machine. Run with `npm run gen:pwa-icons`;
// the PNGs are committed so the service-worker precache has stable URLs + hashes.
// This is deterministic — re-running it reproduces byte-identical files.

import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const NAVY = "#1a2340"; // brand primary ("nile")
const GOLD = "#c9a227"; // brand accent

/** The Ptah mark on a 512 canvas: desert sun (upper-right) + a shaded pyramid on
 *  a grounded horizon line. Returns the inner SVG markup (no <svg> wrapper). */
function mark() {
  return `
    <circle cx="386" cy="126" r="44" fill="${GOLD}" />
    <polygon points="246,150 86,396 406,396" fill="${GOLD}" />
    <polygon points="246,150 406,396 246,396" fill="${NAVY}" fill-opacity="0.18" />
    <rect x="64" y="392" width="384" height="14" rx="7" fill="${GOLD}" />
  `;
}

/**
 * Compose a full 512 SVG.
 * @param {{ rounded?: boolean, scale?: number, transparent?: boolean }} opts
 *   rounded     round the navy plate (Android "any" icons render as-is)
 *   scale       shrink the mark around the centre (maskable safe zone)
 *   transparent omit the navy plate (unused today; kept for flexibility)
 */
function svg({ rounded = false, scale = 1, transparent = false } = {}) {
  const plate = transparent
    ? ""
    : rounded
      ? `<rect x="0" y="0" width="512" height="512" rx="96" fill="${NAVY}" />`
      : `<rect x="0" y="0" width="512" height="512" fill="${NAVY}" />`;
  const inner =
    scale === 1
      ? mark()
      : `<g transform="translate(256 256) scale(${scale}) translate(-256 -256)">${mark()}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">${plate}${inner}</svg>`;
}

/** Admin variant of the Ptah mark: the SAME pyramid + sun, recoloured NAVY on a
 *  GOLD plate (the customer app is the inverse — a gold mark on a navy plate),
 *  plus a padlock badge in the lower-right. The inverted palette and the lock
 *  let staff tell the installed "Ptah … Admin" app apart from the public
 *  "Ptah Tours" app at a glance. Returns inner SVG markup (no <svg> wrapper). */
function adminMark() {
  return `
    <circle cx="352" cy="150" r="42" fill="${NAVY}" />
    <polygon points="226,150 66,392 386,392" fill="${NAVY}" />
    <polygon points="226,150 386,392 226,392" fill="${GOLD}" fill-opacity="0.22" />
    <rect x="52" y="388" width="356" height="14" rx="7" fill="${NAVY}" />
    <circle cx="404" cy="404" r="82" fill="${NAVY}" stroke="${GOLD}" stroke-width="8" />
    <path d="M382 398 v-15 a22 22 0 0 1 44 0 v15" fill="none" stroke="${GOLD}" stroke-width="11" stroke-linecap="round" />
    <rect x="372" y="398" width="64" height="52" rx="10" fill="${GOLD}" />
    <circle cx="404" cy="420" r="7" fill="${NAVY}" />
    <rect x="400.5" y="422" width="7" height="15" rx="3.5" fill="${NAVY}" />
  `;
}

/**
 * Compose a full 512 admin SVG: gold plate + navy mark + lock badge.
 * @param {{ rounded?: boolean, scale?: number }} opts
 *   rounded  round the gold plate (Android "any" icons render as-is)
 *   scale    shrink the mark (+badge) around the centre for the maskable safe zone
 */
function adminSvg({ rounded = false, scale = 1 } = {}) {
  const plate = rounded
    ? `<rect x="0" y="0" width="512" height="512" rx="96" fill="${GOLD}" />`
    : `<rect x="0" y="0" width="512" height="512" fill="${GOLD}" />`;
  const inner =
    scale === 1
      ? adminMark()
      : `<g transform="translate(256 256) scale(${scale}) translate(-256 -256)">${adminMark()}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">${plate}${inner}</svg>`;
}

/** Rasterise an SVG string to a square PNG of `size` px. */
async function png(svgString, size, outFile) {
  await sharp(Buffer.from(svgString))
    .resize(size, size, { fit: "cover" })
    .png({ compressionLevel: 9 })
    .toFile(outFile);
  console.log(`  ✓ ${outFile.replace(/.*[/\\]public[/\\]/, "public/")} (${size}x${size})`);
}

async function main() {
  const here = dirname(fileURLToPath(import.meta.url));
  const outDir = join(here, "..", "public", "icons");
  await mkdir(outDir, { recursive: true });

  console.log("Generating PWA icons…");
  // "any" icons: rounded navy plate, full-size mark.
  await png(svg({ rounded: true }), 192, join(outDir, "icon-192.png"));
  await png(svg({ rounded: true }), 512, join(outDir, "icon-512.png"));
  // Maskable: full-bleed navy, mark shrunk into the safe zone (centre 40% circle).
  await png(svg({ rounded: false, scale: 0.72 }), 512, join(outDir, "maskable-512.png"));
  // Apple touch: opaque, unrounded (iOS applies its own mask), light padding.
  await png(svg({ rounded: false, scale: 0.84 }), 180, join(outDir, "apple-touch-180.png"));

  // Admin app icons — a distinct installed identity (see adminMark): gold plate,
  // navy mark, padlock badge. The maskable variant is pulled in a little tighter
  // (0.68) so the corner lock badge stays inside the maskable safe zone.
  await png(adminSvg({ rounded: true }), 192, join(outDir, "admin-icon-192.png"));
  await png(adminSvg({ rounded: true }), 512, join(outDir, "admin-icon-512.png"));
  await png(adminSvg({ rounded: false, scale: 0.68 }), 512, join(outDir, "admin-maskable-512.png"));
  await png(adminSvg({ rounded: false, scale: 0.84 }), 180, join(outDir, "admin-apple-touch-180.png"));
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
