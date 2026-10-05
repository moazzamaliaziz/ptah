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

/* ───────────────────────── One-time P8 migration repair ─────────────────────
 *
 * The first release of 20260925120000_add_group_price_tiers_and_request_dates
 * dropped an index that a foreign key depended on, so it died partway with
 * MySQL errno 1553. MySQL does not roll back DDL, so the database kept the
 * objects created before that point, and Prisma recorded the migration as
 * FAILED. A failed record makes `migrate deploy` refuse to apply anything ever
 * again (P3009) — including the corrected migration — so the deploy cannot
 * recover on its own without this.
 *
 * What this does, only when it recognizes that exact stuck state: removes the
 * four objects the failed attempt left behind, marks the record rolled back so
 * Prisma will retry it, and re-runs the deploy. Prisma then applies the
 * corrected migration and writes its own fresh record (which is why the record
 * is marked rolled-back rather than finished — Prisma owns the checksum).
 *
 * SAFETY. Every one of these must hold or it does nothing and lets the build
 * fail with the original error:
 *   • the migration record exists and is neither finished nor rolled back;
 *   • `tour_price_tiers` exists AND IS EMPTY;
 *   • all five new `tours` columns exist;
 *   • the new UNIQUE index does NOT exist (i.e. the failure really was at that
 *     step and the migration never completed).
 * The objects it drops can only have been created by the failed attempt, and no
 * build that knows about them has ever succeeded, so nothing can have written
 * to them. Once the migration applies cleanly the record is `finished`, the
 * first guard fails forever, and this becomes dead weight — it is safe to
 * delete this block after one green deploy.
 */
const P8_MIGRATION = "20260925120000_add_group_price_tiers_and_request_dates";
const P8_COLUMNS = [
  "onRequestDates",
  "requestLeadDays",
  "requestWindowDays",
  "requestCapacity",
  "blackoutDates",
];

/** Open a single connection with the same TLS posture as the runtime adapter. */
async function connect(url) {
  const { default: mariadb } = await import("mariadb");
  const parsed = new URL(url);
  const local = ["localhost", "127.0.0.1", "::1"].includes(parsed.hostname);
  return mariadb.createConnection({
    host: parsed.hostname,
    port: parsed.port ? Number(parsed.port) : 3306,
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, "") || undefined,
    connectTimeout: 10_000,
    // TiDB Cloud enforces TLS and routes by SNI; see the long note in
    // src/lib/db.ts. Skipped for local dev, which serves plaintext.
    ...(local ? {} : { ssl: { minVersion: "TLSv1.2", rejectUnauthorized: true, servername: parsed.hostname } }),
  });
}

/** Repair the stuck state if — and only if — it is exactly as described above.
 *  Returns true when it changed something and the deploy is worth retrying. */
async function repairFailedP8Migration(url) {
  let conn;
  try {
    conn = await connect(url);

    const [record] = await conn.query(
      "SELECT finished_at, rolled_back_at FROM _prisma_migrations WHERE migration_name = ?",
      [P8_MIGRATION],
    );
    if (!record) return false; // never attempted — not our case
    if (record.finished_at !== null || record.rolled_back_at !== null) return false;

    const tables = await conn.query("SHOW TABLES LIKE 'tour_price_tiers'");
    if (tables.length === 0) {
      console.error(`[db-deploy] ${P8_MIGRATION} is failed but tour_price_tiers is absent — not the known state; leaving it alone.`);
      return false;
    }

    const [{ n: tierRows }] = await conn.query("SELECT COUNT(*) AS n FROM tour_price_tiers");
    if (Number(tierRows) !== 0) {
      console.error(`[db-deploy] tour_price_tiers holds ${tierRows} row(s) — refusing to drop a table with data. Resolve this migration by hand.`);
      return false;
    }

    const columns = await conn.query(
      `SELECT COLUMN_NAME AS name FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tours' AND COLUMN_NAME IN (?, ?, ?, ?, ?)`,
      P8_COLUMNS,
    );
    if (columns.length !== P8_COLUMNS.length) {
      console.error(`[db-deploy] expected all ${P8_COLUMNS.length} new tours columns, found ${columns.length} — not the known state; leaving it alone.`);
      return false;
    }

    const indexes = await conn.query("SHOW INDEX FROM tour_departures");
    if (indexes.some((i) => i.Key_name === "tour_departures_tourId_startDate_key")) {
      console.error("[db-deploy] the unique departure-date index already exists — not the known state; leaving it alone.");
      return false;
    }

    console.log(`[db-deploy] recognized the failed ${P8_MIGRATION} state — undoing its partial application.`);
    await conn.query("DROP TABLE IF EXISTS `tour_price_tiers`");
    await conn.query(
      `ALTER TABLE \`tours\` ${P8_COLUMNS.map((c) => `DROP COLUMN \`${c}\``).join(", ")}`,
    );
    const result = await conn.query(
      `UPDATE _prisma_migrations SET rolled_back_at = NOW(3)
       WHERE migration_name = ? AND finished_at IS NULL AND rolled_back_at IS NULL`,
      [P8_MIGRATION],
    );
    if (Number(result.affectedRows) !== 1) {
      console.error(`[db-deploy] expected to mark exactly 1 migration record rolled back, touched ${result.affectedRows}.`);
      return false;
    }
    console.log("[db-deploy] partial application undone and the record marked rolled back — retrying the deploy.");
    return true;
  } catch (error) {
    console.error("[db-deploy] repair attempt failed:", error?.message ?? error);
    return false;
  } finally {
    await conn?.end().catch(() => {});
  }
}

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

let lastCode = runDeploy(1);
if (lastCode === 0) {
  console.log("[db-deploy] migrations applied (or already up to date).");
  process.exit(0);
}

// A failure here may be the one-off P8 stuck state, which no amount of retrying
// clears on its own. Try the targeted repair once, then fall through to the
// ordinary retry loop for genuinely transient failures.
if (await repairFailedP8Migration(deployUrl)) {
  lastCode = runDeploy(1);
  if (lastCode === 0) {
    console.log("[db-deploy] migrations applied after repairing the failed migration record.");
    process.exit(0);
  }
}

for (let attempt = 2; attempt <= MAX_ATTEMPTS; attempt++) {
  console.warn(`[db-deploy] attempt ${attempt - 1} failed (exit ${lastCode}).`);
  sleep(RETRY_DELAY_MS);
  lastCode = runDeploy(attempt);
  if (lastCode === 0) {
    console.log("[db-deploy] migrations applied (or already up to date).");
    process.exit(0);
  }
}

console.error("[db-deploy] `prisma migrate deploy` failed after all attempts — failing the build.");
process.exit(lastCode || 1);
