// Prisma CLI configuration (Prisma 7 — the CLI no longer auto-loads .env,
// so we load it explicitly here; datasource URLs live here, not in the
// schema file, per https://pris.ly/d/config-datasource).
// Used by `prisma migrate`, `prisma db seed`, `prisma generate`, etc.
// The running app gets its connection via the driver adapter in src/lib/db.ts
// and validates env through src/lib/env.ts (zod).
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    path: "prisma/migrations",
    // Seeder: `npm run db:seed` (same command registered here for `prisma db seed`).
    seed: "tsx prisma/seed.ts",
  },
});