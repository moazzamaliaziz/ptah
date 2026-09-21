/**
 * Phase 4 gate helper — report SiteToggle rows and restore LOGIN_ENABLED /
 * SIGNUP_ENABLED to true (their seeded defaults), so a toggle-off test can never
 * leave the local DB in a surprising state. Idempotent.
 */
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const url = process.env.DATABASE_URL ?? "mysql://ptah:ptah-dev-password@127.0.0.1:3306/ptah_tours";
const db = new PrismaClient({ adapter: new PrismaMariaDb(url) });

async function main() {
  const before = await db.siteToggle.findMany({ select: { key: true, value: true } });
  console.log("BEFORE", JSON.stringify(before));

  for (const key of ["LOGIN_ENABLED", "SIGNUP_ENABLED"]) {
    await db.siteToggle.upsert({ where: { key }, update: { value: true }, create: { key, value: true, description: null } });
  }

  const after = await db.siteToggle.findMany({ select: { key: true, value: true } });
  console.log("AFTER", JSON.stringify(after));
}

main()
  .catch((e) => {
    console.error("RESTORE_FAIL", e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
