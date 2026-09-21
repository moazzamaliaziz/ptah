/**
 * Seed 4 demo floating widgets so the cluster is visible on the running site
 * (Phase 7 S4 — "test 3+ simultaneously"): Phone + WhatsApp + Tripadvisor in
 * the bottom-right stack, plus an Email widget in the bottom-left stack.
 *
 * Idempotent: deletes any prior rows tagged `[seed]` in the label, then inserts
 * a fresh set. Safe to re-run. NOT part of the app — a dev convenience.
 *
 * Run:
 *   DATABASE_URL="mysql://ptah:ptah-dev-password@127.0.0.1:3306/ptah_tours" npx tsx scripts/seed-widgets.mts
 */
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const url = process.env.DATABASE_URL ?? "mysql://ptah:ptah-dev-password@127.0.0.1:3306/ptah_tours";
const db = new PrismaClient({ adapter: new PrismaMariaDb(url) });

const WIDGETS = [
  { type: "PHONE" as const, label: "Call us [seed]", href: "tel:+201000000000", iconKey: "phone", bgColor: "#1a2340", position: "bottom-right", sortOrder: 0 },
  { type: "WHATSAPP" as const, label: "WhatsApp [seed]", href: "https://wa.me/201000000000", iconKey: "whatsapp", bgColor: "#25d366", position: "bottom-right", sortOrder: 1 },
  { type: "TRIPADVISOR" as const, label: "Tripadvisor [seed]", href: "https://www.tripadvisor.com/", iconKey: "star", bgColor: "#34e0a1", position: "bottom-right", sortOrder: 2 },
  { type: "EMAIL" as const, label: "Email us [seed]", href: "mailto:hello@ptahtours.com", iconKey: "mail", bgColor: "#9a5c1b", position: "bottom-left", sortOrder: 0 },
];

async function main(): Promise<void> {
  await db.floatingWidget.deleteMany({ where: { label: { contains: "[seed]" } } });
  for (const w of WIDGETS) {
    await db.floatingWidget.create({ data: { ...w, enabled: true, showDesktop: true, showMobile: true } });
  }
  const count = await db.floatingWidget.count({ where: { enabled: true } });
  console.log(`Seeded ${WIDGETS.length} demo widgets. Enabled widgets now: ${count}`);
}

main()
  .catch((e) => {
    console.error("SEED_FAIL", e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
