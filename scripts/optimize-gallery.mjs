// Gallery photo optimizer (Travelers showcase / /gallery page).
//
// Reads a hand-curated source list (scripts/gallery-sources.json) of real
// customer trip photos, auto-orients each from its EXIF tag, resizes the
// longest edge down to <=1600px, and writes an on-brand WebP into
// public/assets/gallery/<out>.webp. It then writes scripts/gallery-dims.json
// mapping each `out` slug to its final { width, height } so src/content/
// gallery.ts can carry exact intrinsic dimensions (no layout shift under
// next/image, correct masonry aspect ratios).
//
// gallery-sources.json shape:  [{ "src": "<absolute source path>", "out": "guests-01" }, ...]
//
// Run with:  node scripts/optimize-gallery.mjs
// The WebP files are committed (served same-origin under /assets/gallery/**,
// re-optimized responsively by next/image). gallery-sources.json + the emitted
// gallery-dims.json are build inputs/outputs, not shipped code.

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import sharp from "sharp";

const LONG_EDGE = 1600; // px cap on the longest side (full-view lightbox size)
const QUALITY = 78; // WebP quality — visually clean, reasonable byte size

async function main() {
  const here = dirname(fileURLToPath(import.meta.url));
  const sourcesFile = join(here, "gallery-sources.json");
  const outDir = join(here, "..", "public", "assets", "gallery");
  await mkdir(outDir, { recursive: true });

  const sources = JSON.parse(await readFile(sourcesFile, "utf8"));
  const dims = {};

  console.log(`Optimizing ${sources.length} gallery photos → public/assets/gallery/`);
  for (const { src, out } of sources) {
    const outFile = join(outDir, `${out}.webp`);
    const info = await sharp(src)
      .rotate() // apply EXIF orientation, then drop the tag (upright pixels)
      .resize(LONG_EDGE, LONG_EDGE, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: QUALITY })
      .toFile(outFile);
    dims[out] = { width: info.width, height: info.height };
    console.log(`  ✓ ${out}.webp (${info.width}x${info.height})`);
  }

  await writeFile(join(here, "gallery-dims.json"), JSON.stringify(dims, null, 2) + "\n", "utf8");
  console.log(`Done. Wrote ${Object.keys(dims).length} files + gallery-dims.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
