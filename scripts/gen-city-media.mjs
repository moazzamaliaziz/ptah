// One-off codegen: merge scripts/city-images.out.json (src/width/height/slug/index per
// converted WebP) with each city's Wikimedia metadata into the typed, committed data
// module src/content/city-media.ts.
//
// Two metadata layouts are supported, detected per city:
//   - .meta/<slug>/manifest.json     {file, title, subject, creator, license, page}
//   - .meta/<slug>/ATTRIBUTION.json  {filename, title, description, artist, license, source_page}
// Both normalize to {title, creator, license, page, alt, caption}. Converted rows match
// metadata by the NN index prefix (layout-agnostic). Credit fields are kept verbatim; alt/
// caption use each file's own subject/title (source-grounded, never invented).
//
// Run after convert-city-images.mjs: `node scripts/gen-city-media.mjs`.
import { readFile, writeFile, access } from "node:fs/promises";
import { join, resolve } from "node:path";

const META_ROOT = "C:/Users/Moazzam Ali/Downloads/cities/.meta";
const CITIES = ["alexandria", "aswan", "cairo", "hurghada", "luxor", "sharm-el-sheikh"];

const exists = async (p) => {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
};

const indexOf = (name) => Number(String(name).slice(0, 2));

// Curated alt/caption overrides for images whose Commons filename yields a poor
// auto-label (raw slug-style names, Spanish binomials, plate/date codes). Keyed by
// `<city>/<index>`. Each string describes what the photo actually shows (grounded,
// not invented) so gallery captions + alt text read cleanly and carry SEO/a11y value.
// Lives in the generator (committed, re-runnable) — the emitted module is never hand-edited.
const ALT_OVERRIDES = {
  "alexandria/1": "Alexandria on the Mediterranean coast",
  "hurghada/1": "Hurghada and the Red Sea coast from the air",
  "hurghada/2": "Giftun Island, near Hurghada",
  "hurghada/3": "Giftun Island off Hurghada",
  "hurghada/4": "Giftun Island off Hurghada",
  "hurghada/5": "Giftun Island off Hurghada",
  "hurghada/6": "Giftun Island off Hurghada",
  "hurghada/7": "Giftun Island off Hurghada",
  "hurghada/8": "Giftun Island off Hurghada",
  "hurghada/9": "Giftun Island off Hurghada",
  "hurghada/10": "Giftun Island beach near Hurghada",
  "sharm-el-sheikh/1": "Diving in Sharm el-Sheikh",
  "sharm-el-sheikh/2": "Full moon over Sharm el-Sheikh palms",
  "sharm-el-sheikh/7": "Coral reef in Ras Muhammad National Park",
  "sharm-el-sheikh/8": "Coral reef in Ras Muhammad National Park",
  "sharm-el-sheikh/9": "Coral reef in Ras Muhammad National Park",
  "sharm-el-sheikh/10": "Coral reef in Ras Muhammad National Park",
};

// tidy a Commons file title into a short human label (drop ext, underscores, "- panoramio",
// trailing "(1)" / index numbers).
const cleanLabel = (s) =>
  String(s || "")
    .replace(/\.jpe?g$/i, "")
    .replace(/_+/g, " ")
    .replace(/\s*-\s*panoramio.*$/i, "")
    .replace(/\s+\(\d+\)\s*$/, "")
    .replace(/\s+\d+$/, "")
    .replace(/\s{2,}/g, " ")
    .trim();

// Load + normalize one city's metadata to Map<index, {title,creator,license,page,alt,caption}>.
async function loadMeta(city) {
  const dir = join(META_ROOT, city);
  const manifestPath = join(dir, "manifest.json");
  const attrPath = join(dir, "ATTRIBUTION.json");
  const out = new Map();

  if (await exists(manifestPath)) {
    // Format A — curated manifest with clean `subject` alt text.
    for (const m of JSON.parse(await readFile(manifestPath, "utf8"))) {
      const idx = indexOf(m.file);
      const alt = ALT_OVERRIDES[`${city}/${idx}`] || m.subject || cleanLabel(m.title);
      out.set(idx, {
        title: m.title,
        creator: m.creator,
        license: m.license,
        page: m.page,
        alt,
        caption: alt,
      });
    }
    return out;
  }

  if (await exists(attrPath)) {
    // Format B — Wikimedia ATTRIBUTION export (renamed fields, prose `description`).
    for (const m of JSON.parse(await readFile(attrPath, "utf8"))) {
      const idx = indexOf(m.filename);
      const label = ALT_OVERRIDES[`${city}/${idx}`] || cleanLabel(m.title);
      out.set(idx, {
        title: m.title,
        creator: m.artist,
        license: m.license,
        page: m.source_page,
        alt: label,
        caption: label,
      });
    }
    return out;
  }

  throw new Error(`No manifest.json or ATTRIBUTION.json for ${city}`);
}

const converted = JSON.parse(
  await readFile(resolve(process.cwd(), "scripts/city-images.out.json"), "utf8"),
);

const meta = {};
for (const city of CITIES) meta[city] = await loadMeta(city);

const grouped = {};
for (const city of CITIES) grouped[city] = [];

for (const row of converted) {
  const m = meta[row.city].get(row.index);
  if (!m) throw new Error(`No metadata entry for ${row.city} #${row.index}`);
  grouped[row.city].push({
    slug: row.slug,
    src: row.src,
    width: row.width,
    height: row.height,
    alt: m.alt,
    caption: m.caption,
    credit: { title: m.title, creator: m.creator, license: m.license, page: m.page },
  });
}

const header = `/**
 * Curated city photography for the six destination pages (alexandria / aswan /
 * cairo / hurghada / luxor / sharm-el-sheikh) plus their on-page attribution.
 *
 * GENERATED by scripts/gen-city-media.mjs from the Wikimedia Commons image sets
 * (scripts/convert-city-images.mjs emits the WebP + dimensions; each city ships
 * .meta/<slug>/manifest.json OR .meta/<slug>/ATTRIBUTION.json with the required
 * creator/license/source-page metadata). Do not hand-edit — re-run the generator.
 *
 * Every image is CC-licensed or public-domain; on-page credit (creator + license
 * + Commons link) is REQUIRED and rendered by <ImageCredits>. alt/caption are
 * source-grounded (manifest subject / cleaned Commons title), never invented.
 * These English strings are shared across all locales for now (English-first);
 * lift into the i18n dictionaries when the pages are translated.
 *
 * The shape mirrors src/content/theme-media.ts so the shared theme toolkit
 * (FeatureRows / PlaceCards / ThemeGallery / ImageCredits) consumes both.
 */

export type CitySlug =
  | "alexandria"
  | "aswan"
  | "cairo"
  | "hurghada"
  | "luxor"
  | "sharm-el-sheikh";

export interface ImageCredit {
  /** Title of the source work on Wikimedia Commons. */
  title: string;
  /** Attributed author/creator string, verbatim from the metadata. */
  creator: string;
  /** License short name, e.g. "CC BY 4.0", "Public domain", "CC0". */
  license: string;
  /** Canonical Commons file page (attribution target). */
  page: string;
}

export interface CityImage {
  /** Stable id within a city, e.g. "philae-temple". */
  slug: string;
  /** Path under /public — optimized WebP. */
  src: string;
  /** Intrinsic pixel dimensions of the WebP (for next/image + masonry). */
  width: number;
  height: number;
  /** Descriptive English alt text. */
  alt: string;
  /** Short English caption for gallery/credit rows. */
  caption: string;
  credit: ImageCredit;
}

`;

const body =
  `export const cityMedia: Record<CitySlug, CityImage[]> = ${JSON.stringify(grouped, null, 2)};\n\n` +
  `/** Look up one image in a city by slug (feature rows / spot placements). */\n` +
  `export function cityImage(city: CitySlug, slug: string): CityImage {\n` +
  `  const found = cityMedia[city].find((i) => i.slug === slug);\n` +
  `  if (!found) throw new Error(\`Unknown city image: \${city}/\${slug}\`);\n` +
  `  return found;\n` +
  `}\n`;

await writeFile(resolve(process.cwd(), "src/content/city-media.ts"), header + body);
const total = Object.values(grouped).reduce((n, a) => n + a.length, 0);
console.log(`Wrote src/content/city-media.ts (${total} images).`);
