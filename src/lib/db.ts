/**
 * Prisma client singleton.
 *
 * Next.js dev mode (Turbopack HMR) re-evaluates modules on every reload, which
 * would open a new MySQL connection pool per reload and exhaust the server.
 * The standard fix is caching the client on `globalThis`, which survives HMR.
 *
 * Prisma 7 note: the client is Rust-free and connects through a driver
 * adapter — here `@prisma/adapter-mariadb`, which speaks the MySQL protocol
 * (despite the name, it supports MySQL 8). The connection string comes from
 * validated env (src/lib/env.ts), NOT from the prisma schema (v7 removed
 * datasource urls from schema files).
 */
import "server-only";
import net from "node:net";
import dns from "node:dns";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { env } from "@/lib/env";

/**
 * Serverless connect-latency fix ("Happy Eyeballs").
 *
 * The mariadb driver opens its sockets through Node's net/tls layer. When the
 * DB hostname resolves to BOTH an IPv6 (AAAA) and IPv4 (A) address — as managed
 * cloud MySQL hosts (TiDB, Aiven) do — and the runtime attempts IPv6 first, an
 * environment with no usable IPv6 route (Vercel's serverless functions) stalls
 * on that attempt until `connectTimeout` (~10s) before falling back to IPv4.
 * Every uncached DB read then paid a ~10s penalty, which is exactly the stall
 * documented for local dev in .env (localhost → ::1).
 *
 * Enabling autoSelectFamily makes Node race IPv4 and IPv6 in parallel and use
 * whichever connects first, eliminating the stall. It's a process-global
 * default read by every socket connect made afterwards, so it must run before
 * the pool opens its first connection — module import order guarantees this
 * file is evaluated before any query. Guarded because the API only exists on
 * Node >= 18.18 (Vercel runs newer, local dev may vary).
 */
if (typeof net.setDefaultAutoSelectFamily === "function") {
  net.setDefaultAutoSelectFamily(true);
  // Fail a stalled family attempt over to the other family fast (default 250ms).
  net.setDefaultAutoSelectFamilyAttemptTimeout?.(500);
}

/**
 * Prefer IPv4 when resolving the DB host — belt-and-suspenders only.
 *
 * The prod DB host (TiDB Cloud gateway) is IPv4-only, so this is effectively a
 * no-op there; it just keeps any dual-stack environment from stalling on a dead
 * IPv6 route. IMPORTANT: this is NOT what fixed the 45028 pool timeouts. An
 * in-function diagnostic proved TCP reached the DB in ~6ms (no IPv6/DNS issue)
 * yet every pool checkout still timed out — because the TLS handshake never
 * started. The real fix is the `ssl` config in createAdapter() below. Kept only
 * because it is harmless. Node >= 18.
 */
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Build the MariaDB/MySQL driver adapter with an explicit connection pool.
 *
 * On serverless (Vercel) each function instance serves only a little
 * concurrency, but many instances run at once — so a large per-instance pool
 * multiplies into far more open connections than a managed cloud DB's cap
 * allows (TiDB Serverless / Aiven free tiers cap concurrent connections low),
 * and surplus connections just sit idle. We keep the per-instance pool small
 * (env-tunable via DB_POOL_LIMIT, default 5) so total connections stay under
 * the provider ceiling. `connectTimeout` is a safety upper bound; with
 * autoSelectFamily enabled above, real connects resolve in well under a second.
 */
function createAdapter(): PrismaMariaDb {
  const poolLimit = Number(process.env.DB_POOL_LIMIT ?? 5);
  try {
    const url = new URL(env.DATABASE_URL);
    return new PrismaMariaDb({
      host: url.hostname,
      port: url.port ? Number(url.port) : 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, "") || undefined,
      connectionLimit: Number.isFinite(poolLimit) && poolLimit > 0 ? poolLimit : 5,
      // Fail a checkout attempt after 10s rather than hang forever.
      connectTimeout: 10_000,
      // TiDB Cloud Serverless enforces TLS (require_secure_transport=ON) and its
      // gateway routes each connection to the right cluster by the TLS SNI
      // servername. The mariadb driver opens the plain socket first and only
      // upgrades to TLS when `ssl` is set — and, unlike mysql2, it never fills in
      // `servername` itself (it hands tls.connect just { socket }). With no ssl
      // the handshake never starts: TCP connects in ~6ms but every pool checkout
      // then hangs to connectTimeout and fails with Prisma 45028 (active=0
      // idle=0) — the ~10s-per-request stall seen in prod. Supplying ssl +
      // servername fixes it. Node's bundled CA store trusts the public gateway
      // cert, so rejectUnauthorized stays true without a custom `ca`.
      ssl: {
        minVersion: "TLSv1.2",
        rejectUnauthorized: true,
        servername: url.hostname,
      },
    } as ConstructorParameters<typeof PrismaMariaDb>[0]);
  } catch {
    // If the URL can't be parsed for any reason, fall back to the string form
    // (default pool) so the app still connects rather than failing to boot.
    return new PrismaMariaDb(env.DATABASE_URL);
  }
}

function createPrismaClient(): PrismaClient {
  const adapter = createAdapter();
  return new PrismaClient({
    adapter,
    log:
      env.NODE_ENV === "development"
        ? [
            { emit: "event", level: "query" },
            { emit: "stdout", level: "warn" },
            { emit: "stdout", level: "error" },
          ]
        : [{ emit: "stdout", level: "error" }],
  });
}

export const db: PrismaClient = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

/** Alias re-export so call sites can read `prisma.xxx` if preferred. */
export { db as prisma };
export default db;