/**
 * Phase 2 gate helper — set a SiteToggle row directly (data layer the admin
 * Server Action writes through). Used to drive the maintenance-mode gate.
 *
 * Run: npx tsx scripts/phase2-set-toggle.mts <KEY> <true|false>
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const key = process.argv[2] ?? "MAINTENANCE_MODE";
const value = (process.argv[3] ?? "false").toLowerCase() === "true";

const connectionString =
  process.env.DATABASE_URL ?? "mysql://ptah:ptah-dev-password@127.0.0.1:3306/ptah_tours";
const db = new PrismaClient({ adapter: new PrismaMariaDb(connectionString) });

async function main(): Promise<void> {
  await db.siteToggle.upsert({
    where: { key },
    update: { value },
    create: { key, value, description: null },
  });
  console.log(`${key}=${value}`);
  await db.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await db.$disconnect();
  process.exit(1);
});
