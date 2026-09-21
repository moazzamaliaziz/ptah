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

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaMariaDb(env.DATABASE_URL);
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