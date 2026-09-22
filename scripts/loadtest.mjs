/**
 * Local load / stress / concurrency harness for Ptah Tours (Wave 2 testing).
 *
 * No external deps — uses Node's global fetch (undici). Simulates N concurrent
 * "virtual users" that loop over a weighted mix of routes (static, DB-reading
 * dynamic, API), across ramped stages. Reports RPS, success rate, error
 * breakdown, and latency percentiles per stage + overall, then a post-run
 * health check to confirm the server survived (did not crash).
 *
 * Usage:  node scripts/loadtest.mjs [baseline|stress|soak]
 */
// Raise the built-in undici global dispatcher's per-origin connection cap so
// concurrency is real rather than queued behind the default pool. Uses the
// internal require (undici is bundled in Node) with a graceful fallback.
import { createRequire } from "node:module";
try {
  const require = createRequire(import.meta.url);
  const { Agent, setGlobalDispatcher } = require("node:http") && require("undici");
  setGlobalDispatcher(new Agent({ connections: 512, pipelining: 1, connectTimeout: 10_000 }));
} catch {
  // undici not resolvable as a bare specifier here — fall back to Node's
  // default global fetch dispatcher (concurrency may be pool-capped, which is
  // itself a valid stress signal).
}

const BASE = process.env.LOAD_BASE ?? "http://127.0.0.1:3000";
const PROFILE = process.argv[2] ?? "baseline";

const PROFILES = {
  // vus = concurrent virtual users held for durationSec
  baseline: [
    { vus: 10, durationSec: 8 },
    { vus: 30, durationSec: 8 },
  ],
  stress: [
    { vus: 25, durationSec: 12 },
    { vus: 75, durationSec: 12 },
    { vus: 150, durationSec: 15 },
    { vus: 300, durationSec: 15 },
  ],
  soak: [{ vus: 40, durationSec: 90 }],
};

/** Discover a couple of real dynamic slugs so we exercise DB detail pages. */
async function discover() {
  const routes = [
    { path: "/", weight: 3, kind: "static" },
    { path: "/tours", weight: 3, kind: "db-list" },
    { path: "/events", weight: 2, kind: "db-list" },
    { path: "/trip-ideas", weight: 2, kind: "db-list" },
    { path: "/blog", weight: 1, kind: "static" },
    { path: "/the-nile", weight: 1, kind: "db-list" },
    { path: "/about", weight: 1, kind: "static" },
    { path: "/contact", weight: 1, kind: "static" },
    { path: "/faqs", weight: 1, kind: "static" },
    { path: "/api/internal/site-state", weight: 1, kind: "api" },
  ];
  try {
    const html = await (await fetch(`${BASE}/tours`)).text();
    const m = html.match(/href="\/tours\/([a-z0-9-]+)"/i);
    if (m) routes.push({ path: `/tours/${m[1]}`, weight: 3, kind: "db-detail" });
  } catch {}
  try {
    const html = await (await fetch(`${BASE}/blog`)).text();
    const m = html.match(/href="\/blog\/([a-z0-9-]+)"/i);
    if (m) routes.push({ path: `/blog/${m[1]}`, weight: 1, kind: "static-ssg" });
  } catch {}
  // Expand by weight into a flat pick list.
  const pool = [];
  for (const r of routes) for (let i = 0; i < r.weight; i++) pool.push(r);
  return { routes, pool };
}

function pct(sorted, p) {
  if (sorted.length === 0) return 0;
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

async function runStage(stage, pool) {
  const endAt = Date.now() + stage.durationSec * 1000;
  const latencies = [];
  const status = {};
  let ok = 0;
  let errors = 0;
  const perRoute = {};

  async function vu() {
    while (Date.now() < endAt) {
      const r = pool[Math.floor(Math.random() * pool.length)];
      const t0 = performance.now();
      try {
        const res = await fetch(`${BASE}${r.path}`, { headers: { "user-agent": "ptah-loadtest" } });
        // Drain the body so the connection is freed for reuse.
        await res.arrayBuffer();
        const dt = performance.now() - t0;
        latencies.push(dt);
        status[res.status] = (status[res.status] ?? 0) + 1;
        perRoute[r.path] ??= { n: 0, bad: 0, sum: 0 };
        perRoute[r.path].n++;
        perRoute[r.path].sum += dt;
        if (res.status >= 200 && res.status < 400) ok++;
        else {
          errors++;
          perRoute[r.path].bad++;
        }
      } catch (e) {
        errors++;
        status[`ERR:${e.code ?? e.name ?? "conn"}`] = (status[`ERR:${e.code ?? e.name ?? "conn"}`] ?? 0) + 1;
      }
    }
  }

  const workers = Array.from({ length: stage.vus }, () => vu());
  await Promise.all(workers);

  latencies.sort((a, b) => a - b);
  const total = ok + errors;
  return {
    vus: stage.vus,
    durationSec: stage.durationSec,
    total,
    ok,
    errors,
    rps: +(total / stage.durationSec).toFixed(1),
    successRate: total ? +((ok / total) * 100).toFixed(2) : 0,
    p50: Math.round(pct(latencies, 50)),
    p90: Math.round(pct(latencies, 90)),
    p99: Math.round(pct(latencies, 99)),
    max: Math.round(latencies[latencies.length - 1] ?? 0),
    status,
    perRoute,
  };
}

async function main() {
  const stages = PROFILES[PROFILE];
  if (!stages) {
    console.error(`Unknown profile "${PROFILE}". Use: baseline | stress | soak`);
    process.exit(2);
  }
  const { routes, pool } = await discover();
  console.log(`\n=== Ptah Tours load test — profile: ${PROFILE} ===`);
  console.log(`Target: ${BASE}`);
  console.log(`Routes: ${routes.map((r) => r.path).join(", ")}\n`);

  const results = [];
  for (const stage of stages) {
    process.stdout.write(`▶ Stage: ${stage.vus} concurrent users for ${stage.durationSec}s ... `);
    const r = await runStage(stage, pool);
    results.push(r);
    console.log(
      `done — ${r.total} reqs, ${r.rps} rps, ${r.successRate}% ok, p50=${r.p50}ms p90=${r.p90}ms p99=${r.p99}ms max=${r.max}ms`,
    );
    console.log(`   status: ${JSON.stringify(r.status)}`);
  }

  // Overall + worst routes
  const grand = results.reduce(
    (a, r) => ({ total: a.total + r.total, ok: a.ok + r.ok, errors: a.errors + r.errors }),
    { total: 0, ok: 0, errors: 0 },
  );
  console.log(`\n=== Summary ===`);
  console.log(`Total requests: ${grand.total} | ok: ${grand.ok} | errors: ${grand.errors} | success: ${grand.total ? ((grand.ok / grand.total) * 100).toFixed(2) : 0}%`);

  // Per-route slowest (avg) from the last (heaviest) stage
  const last = results[results.length - 1];
  const rows = Object.entries(last.perRoute)
    .map(([p, s]) => ({ path: p, n: s.n, bad: s.bad, avg: Math.round(s.sum / s.n) }))
    .sort((a, b) => b.avg - a.avg);
  console.log(`\nPer-route (heaviest stage, ${last.vus} VUs), slowest first:`);
  for (const r of rows) console.log(`  ${String(r.avg).padStart(5)}ms avg  ${String(r.n).padStart(5)} reqs  ${r.bad} errors  ${r.path}`);

  // Post-run health check — did the server survive?
  await new Promise((r) => setTimeout(r, 1500));
  let health = "DOWN";
  try {
    const res = await fetch(`${BASE}/`);
    health = res.ok ? `UP (${res.status})` : `DEGRADED (${res.status})`;
  } catch (e) {
    health = `DOWN (${e.code ?? e.name})`;
  }
  console.log(`\nPost-run health check (GET /): ${health}`);
  console.log(grand.errors === 0 && health.startsWith("UP") ? "RESULT: PASS — no errors, server healthy.\n" : "RESULT: see errors above.\n");
}

main();
