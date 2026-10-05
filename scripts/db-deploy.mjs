/**
 * Apply pending Prisma migrations during the production build.
 *
 * Why this wrapper exists (instead of calling `prisma migrate deploy` directly
 * in package.json):
 *
 * TiDB Cloud Serverless enforces TLS. The Prisma *migration engine* connects
 * using the raw DATABASE_URL and only negotiates TLS when the URL carries an
 * SSL hint (`?sslaccept=strict`). The *runtime* adapter (@prisma/adapter-mariadb
 * in src/lib/db.ts) is different — it parses host/port/user/password out of the
 * URL and sets TLS in code, ignoring query params. So the shared DATABASE_URL
 * env var on Vercel may not include the SSL param the migration engine needs.
 *
 * This script appends `?sslaccept=strict` (only if no ssl hint is present) and
 * runs `prisma migrate deploy` with that URL set for the child process ONLY, so
 * the migration engine can connect while the shared env var stays untouched.
 *
 * A migration failure intentionally fails the build (better to block a deploy
 * than run new code against an old schema — the exact class of bug this fixes).
 * We retry a few times first so a transient TiDB cold-start/connection blip does
 * not fail an otherwise-fine deploy; a genuine SQL error fails every attempt and
 * still blocks the build.
 */
import { spawnSync } from "node:child_process";

const raw = process.env.DATABASE_URL;
if (!raw) {
  console.warn("[db-deploy] DATABASE_URL not set — skipping `prisma migrate deploy`.");
  process.exit(0);
}

// Add an SSL hint for the migration engine unless one is already present.
let deployUrl = raw;
if (!/[?&](sslaccept|sslmode|ssl)=/.test(deployUrl)) {
  deployUrl += (deployUrl.includes("?") ? "&" : "?") + "sslaccept=strict";
}

const MAX_ATTEMPTS = 3;
const RETRY_DELAY_MS = 4000;

function sleep(ms) {
  const until = Date.now() + ms;
  while (Date.now() < until) {
    // busy-wait: keeps this tiny build script dependency-free and synchronous.
  }
}

/** Run `prisma migrate deploy` once; returns its exit code. */
function runDeploy(attempt) {
  console.log(`[db-deploy] prisma migrate deploy (attempt ${attempt}/${MAX_ATTEMPTS})`);
  // Invoke through `npx` so the local prisma CLI resolves regardless of whether
  // node_modules/.bin is on PATH (it is when npm runs `build`, but not when this
  // script is run directly). prisma is a local devDependency, so npx never
  // fetches anything. shell:true lets Windows pick up npx.cmd.
  const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
    stdio: "inherit",
    shell: true,
    env: { ...process.env, DATABASE_URL: deployUrl },
  });
  return result.status ?? 1;
}

let lastCode = 1;
for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
  if (attempt > 1) {
    console.warn(`[db-deploy] attempt ${attempt - 1} failed (exit ${lastCode}).`);
    sleep(RETRY_DELAY_MS);
  }
  lastCode = runDeploy(attempt);
  if (lastCode === 0) {
    console.log("[db-deploy] migrations applied (or already up to date).");
    process.exit(0);
  }
}

console.error("[db-deploy] `prisma migrate deploy` failed after all attempts — failing the build.");
process.exit(lastCode || 1);
