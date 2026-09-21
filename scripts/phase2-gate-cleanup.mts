/**
 * Phase 2 gate cleanup — undo the test artifacts created by the runtime gates,
 * restoring the seed-clean DB state:
 *   - delete synthetic gate users (gate-*@ptahtours.local) + cascade sessions
 *   - delete all sessions minted on the real SUPER_ADMIN during gates
 *   - reset STRIPE integration to seed state (disabled, no stored config)
 *
 * Run: npx tsx scripts/phase2-gate-cleanup.mts
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const connectionString =
  process.env.DATABASE_URL ?? "mysql://ptah:ptah-dev-password@127.0.0.1:3306/ptah_tours";
const db = new PrismaClient({ adapter: new PrismaMariaDb(connectionString) });

async function main(): Promise<void> {
  const gate = await db.user.deleteMany({
    where: { email: { in: [
      "gate-editor@ptahtours.local",
      "gate-support@ptahtours.local",
      "gate-user@ptahtours.local",
      "gate-admin@ptahtours.local",
    ] } },
  });
  console.log(`deleted gate users: ${gate.count}`);

  const admin = await db.user.findUnique({ where: { email: "admin@ptahtours.local" }, select: { id: true } });
  if (admin) {
    const s = await db.session.deleteMany({ where: { userId: admin.id } });
    console.log(`deleted SUPER_ADMIN sessions: ${s.count}`);
  }

  // Restore STRIPE to seed shape: present, disabled, no credentials.
  await db.integration.update({
    where: { key: "STRIPE" },
    data: { enabled: false, configEncrypted: null },
  });
  console.log("reset STRIPE integration to disabled / no config");

  await db.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await db.$disconnect();
  process.exit(1);
});
