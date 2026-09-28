// One-off: convert curated theme JPGs -> optimized WebP under public/assets/themes/<theme>/.
// Source is the extracted Wikimedia sets in Downloads/_work; output feeds src/content/theme-media.ts.
// Emits scripts/theme-images.out.json (theme, index, slug, src, width, height) for typed media data.
// Run once: `node scripts/convert-theme-images.mjs`. Safe to re-run (overwrites outputs).
import { readdir, mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import sharp from "sharp";

const SRC_ROOT = "C:/Users/Moazzam Ali/Downloads/images/_work";
const OUT_ROOT = resolve(process.cwd(), "public/assets/themes");
const MAX_EDGE = 2000;
const QUALITY = 80;

// theme slug (matches the route + public folder) -> source folder name
const THEMES = {
  heritage: "egypt-heritage-images",
  "the-nile": "the-nile-images",
  deserts: "deserts-sinai-images",
  "red-sea": "red-sea-images",
  "when-to-visit": "when-to-visit-images",
};

const isPhoto = (f) => /^\d{2}-.+\.jpe?g$/i.test(f); // NN-name.jpg only (skips contact-sheet.jpg)
const outName = (f) => f.replace(/\.jpe?g$/i, ".webp");
const slugOf = (f) => f.replace(/^\d{2}-/, "").replace(/\.jpe?g$/i, "");

const results = [];

for (const [theme, folder] of Object.entries(THEMES)) {
  const srcDir = join(SRC_ROOT, folder);
  const outDir = join(OUT_ROOT, theme);
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
      theme,
      index,
      slug: slugOf(file),
      src: `/assets/themes/${theme}/${out}`,
      width: info.width,
      height: info.height,
    });
    console.log(`${theme}/${out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}kB`);
  }
}

results.sort((a, b) => a.theme.localeCompare(b.theme) || a.index - b.index);
await writeFile(
  resolve(process.cwd(), "scripts/theme-images.out.json"),
  JSON.stringify(results, null, 2) + "\n",
);
console.log(`\nDone: ${results.length} images across ${Object.keys(THEMES).length} themes.`);
