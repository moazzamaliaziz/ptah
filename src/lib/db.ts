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
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { env } from "@/lib/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Build the MariaDB/MySQL driver adapter with an explicit connection pool.
 *
 * The default pool is 10 connections; under concurrent load that serializes
 * DB-reading pages (each request queues for one of 10 slots), which was the
 * dominant latency source in load testing. We parse the validated DATABASE_URL
 * into a pool config so we can raise `connectionLimit` (env-tunable via
 * DB_POOL_LIMIT, default 30). Keep this comfortably under MySQL's
 * `max_connections` (default 151), leaving headroom for the CLI + other procs.
 */
function createAdapter(): PrismaMariaDb {
  const poolLimit = Number(process.env.DB_POOL_LIMIT ?? 30);
  try {
    const url = new URL(env.DATABASE_URL);
    return new PrismaMariaDb({
      host: url.hostname,
      port: url.port ? Number(url.port) : 3306,
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, "") || undefined,
      connectionLimit: Number.isFinite(poolLimit) && poolLimit > 0 ? poolLimit : 30,
      // Fail a checkout attempt after 10s rather than hang forever.
      connectTimeout: 10_000,
    });
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