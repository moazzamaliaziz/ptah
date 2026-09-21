import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
const url = process.env.DATABASE_URL ?? "mysql://ptah:ptah-dev-password@127.0.0.1:3306/ptah_tours";
const db = new PrismaClient({ adapter: new PrismaMariaDb(url) });
async function main() {
  const [tours, deps, bookings, payments, evts, published] = await Promise.all([
    db.tour.count(),
    db.tourDeparture.count(),
    db.booking.count(),
    db.payment.count(),
    db.webhookEvent.count(),
    db.tour.count({ where: { status: "PUBLISHED" } }),
  ]);
  console.log(JSON.stringify({ tours, published, deps, bookings, payments, webhookEvents: evts }));
}
main().catch((e) => { console.error("PROBE_FAIL", e); process.exitCode = 1; }).finally(() => db.$disconnect());
