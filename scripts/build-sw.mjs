// Service-worker build step (spec §3). Runs after `next build`.
//
// Serwist (D1) ships a runtime library (`serwist`) plus a manifest generator
// (`@serwist/build`), but no bundler of its own — under Next 16's Turbopack the
// classic @serwist/next webpack plugin never runs, and @serwist/turbopack only
// serves the worker under the /serwist/ scope. So we build the worker ourselves:
//
//   1. @serwist/build → getManifest(): hash the static assets to precache
//      (icons/**) plus the /offline fallback page.
//   2. esbuild → bundle src/sw.ts into a single classic worker, injecting the
//      manifest as `self.__SW_MANIFEST`, emitted to public/sw.js (root scope).
//
// public/sw.js is a build artifact (git-ignored). Locally: `npm run build:sw`.

import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { build } from "esbuild";
import { getManifest } from "@serwist/build";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const publicDir = join(root, "public");
const swSrc = join(root, "src", "sw.ts");
const swDest = join(publicDir, "sw.js");

/** Stable revision for the /offline fallback: a hash of the pages that render
 *  it, so it re-precaches only when the offline UI actually changes. */
async function offlineRevision() {
  const parts = [];
  for (const rel of ["src/app/offline/page.tsx", "src/app/offline/layout.tsx"]) {
    try {
      parts.push(await readFile(join(root, rel), "utf8"));
    } catch {
      /* file may not exist yet during scaffolding */
    }
  }
  return createHash("sha256").update(parts.join("\0")).digest("hex").slice(0, 16);
}

async function main() {
  // 1) Precache manifest: committed icons + the offline fallback route.
  const { manifestEntries, count, size, warnings } = await getManifest({
    globDirectory: publicDir,
    globPatterns: ["icons/**/*.png"],
    additionalPrecacheEntries: [{ url: "/offline", revision: await offlineRevision() }],
    maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
  });
  for (const w of warnings) console.warn("[build-sw]", w);

  // Precache URLs must be root-absolute so they resolve against scope "/".
  const entries = manifestEntries.map((e) =>
    typeof e === "string"
      ? "/" + e.replace(/^\//, "")
      : { url: "/" + e.url.replace(/^\//, ""), revision: e.revision },
  );

  // 2) Bundle the worker, injecting the manifest via a banner (runs before the
  //    IIFE reads self.__SW_MANIFEST).
  await build({
    entryPoints: [swSrc],
    outfile: swDest,
    bundle: true,
    format: "iife",
    platform: "browser",
    target: ["chrome110", "firefox110", "safari16", "edge110"],
    minify: true,
    sourcemap: false,
    define: { "process.env.NODE_ENV": '"production"' },
    banner: { js: `self.__SW_MANIFEST=${JSON.stringify(entries)};` },
    legalComments: "none",
  });

  console.log(
    `[build-sw] wrote public/sw.js — precached ${count} asset(s) (${(size / 1024).toFixed(1)} KB) + /offline`,
  );
}

main().catch((err) => {
  console.error("[build-sw] failed:", err);
  process.exit(1);
});
