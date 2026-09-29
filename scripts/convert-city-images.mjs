// One-off: convert curated city JPGs -> optimized WebP under public/assets/cities/<slug>/.
// Source is the extracted Wikimedia sets in Downloads/cities/_work/<slug>; output feeds
// src/content/city-media.ts. Emits scripts/city-images.out.json (city, index, slug, src,
// width, height) for typed media data.
//
// The six cities ship in TWO naming layouts, both handled here:
//   - group A (aswan/cairo/luxor):            NN-kebab-name.jpg  (hyphen)
//   - group B (alexandria/hurghada/sharm...): NN_Name_Underscores.jpg
// slug + index are derived uniformly so the gen step can match either layout.
//
// Run once: `node scripts/convert-city-images.mjs`. Safe to re-run (overwrites outputs).
import { readdir, mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import sharp from "sharp";

const SRC_ROOT = "C:/Users/Moazzam Ali/Downloads/cities/_work";
const OUT_ROOT = resolve(process.cwd(), "public/assets/cities");
const MAX_EDGE = 2000;
const QUALITY = 80;

// city slug (matches src/lib/cities.ts + the route + public folder). Each has its own
// source folder of the same name under _work/.
const CITIES = ["alexandria", "aswan", "cairo", "hurghada", "luxor", "sharm-el-sheikh"];

// NN- or NN_ prefixed jpg/jpeg only (both layouts).
const isPhoto = (f) => /^\d{2}[-_].+\.jpe?g$/i.test(f);
const outName = (f) => f.replace(/\.jpe?g$/i, ".webp");
// stable slug from either layout: drop NN prefix + ext, lowercase, kebab-case.
const slugOf = (f) =>
  f
    .replace(/^\d{2}[-_]/, "")
    .replace(/\.jpe?g$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const results = [];

for (const city of CITIES) {
  const srcDir = join(SRC_ROOT, city);
  const outDir = join(OUT_ROOT, city);
  await mkdir(outDir, { recursive: true });

  const files = (await readdir(srcDir)).filter(isPhoto).sort();
  for (const file of files) {
    const index = Number(file.slice(0, 2));
    const out = outName(file);
    const pipeline = sharp(join(srcDir, file))
      .rotate()
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .webp({ quality: QUALITY });
    const info = await pipeline.toFile(join(outDir, out));
    results.push({
      city,
      index,
      slug: slugOf(file),
      src: `/assets/cities/${city}/${out}`,
      width: info.width,
      height: info.height,
    });
    console.log(`${city}/${out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}kB`);
  }
}

results.sort((a, b) => a.city.localeCompare(b.city) || a.index - b.index);
await writeFile(
  resolve(process.cwd(), "scripts/city-images.out.json"),
  JSON.stringify(results, null, 2) + "\n",
);
console.log(`\nDone: ${results.length} images across ${CITIES.length} cities.`);
