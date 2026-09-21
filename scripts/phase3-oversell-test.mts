/**
 * Phase 3 gate — NO-OVERSELL concurrency proof.
 *
 * Fires N concurrent seat claims against a departure with capacity C (N > C)
 * using the REAL production primitive (`reserveSeatsWith` from booking-core.ts,
 * which has no `server-only` import so it loads under tsx). Proves:
 *   • successful claims never exceed capacity,
 *   • remainingCapacity lands at exactly 0 (or capacity − seatsSold),
 *   • the sum of seats across created bookings == seats actually claimed.
 *
 * Cleans up all test rows afterward, leaving the DB seed-clean.
 *
 * Run: npx tsx scripts/phase3-oversell-test.mts
 */
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { reserveSeatsWith, ReserveError } from "../src/server/booking-core";

const url =
  process.env.DATABASE_URL ?? "mysql://ptah:ptah-dev-password@127.0.0.1:3306/ptah_tours";

// Parse the URL into a PoolConfig so we can size the pool >= concurrency: the
// point of THIS test is DB row-lock contention, not connection starvation. A
// tiny default pool would surface as P2028 "can't start transaction in time"
// (an availability artifact) and mask the real oversell invariant.
const u = new URL(url);
const CONCURRENCY = 40; // 40 concurrent single-seat claims against 10 seats
const CAPACITY = 10;
const db = new PrismaClient({
  adapter: new PrismaMariaDb({
    host: u.hostname,
    port: Number(u.port || 3306),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ""),
    connectionLimit: CONCURRENCY + 5,
    acquireTimeout: 20_000,
  }),
});
const TOUR_SLUG = "__oversell_test_tour__";

let failures = 0;
const check = (name: string, cond: boolean, detail = "") => {
  console.log(`${cond ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!cond) failures++;
};

async function main() {
  // ── Arrange: a throwaway tour + one departure with known capacity ──────────
  await cleanup(); // in case a prior run died mid-way
  const tour = await db.tour.create({
    data: {
      slug: TOUR_SLUG,
      title: "Oversell Test Tour",
      summary: "test",
      descriptionLong: "test",
      durationDays: 1,
      basePriceCents: 10000,
      currency: "USD",
      status: "DRAFT",
    },
  });
  const departure = await db.tourDeparture.create({
    data: {
      tourId: tour.id,
      startDate: new Date("2099-01-01"),
      endDate: new Date("2099-01-01"),
      maxCapacity: CAPACITY,
      remainingCapacity: CAPACITY,
      status: "OPEN",
    },
  });

  // ── Act: fire CONCURRENCY single-seat claims all at once ───────────────────
  const results = await Promise.allSettled(
    Array.from({ length: CONCURRENCY }, (_, i) =>
      reserveSeatsWith(db, {
        departureId: departure.id,
        seats: 1,
        userId: null,
        guestEmail: `race${i}@test.local`,
        contactInfo: { fullName: `Racer ${i}`, email: `race${i}@test.local`, phone: "+100000000" },
      }),
    ),
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").length;
  const soldOut = results.filter(
    (r) => r.status === "rejected" && r.reason instanceof ReserveError && r.reason.reason === "SOLD_OUT",
  ).length;
  const otherErrors = results.filter(
    (r) => r.status === "rejected" && !(r.reason instanceof ReserveError && r.reason.reason === "SOLD_OUT"),
  );

  // ── Assert ────────────────────────────────────────────────────────────────
  const dep = await db.tourDeparture.findUniqueOrThrow({ where: { id: departure.id } });
  const bookings = await db.booking.findMany({ where: { departureId: departure.id }, select: { seats: true } });
  const seatsBooked = bookings.reduce((sum, b) => sum + b.seats, 0);

  check("successful claims == capacity", succeeded === CAPACITY, `${succeeded}/${CAPACITY}`);
  check("rejected-as-sold-out == overflow", soldOut === CONCURRENCY - CAPACITY, `${soldOut} sold-out`);
  check("no unexpected errors", otherErrors.length === 0, `${otherErrors.length} other`);
  if (otherErrors.length > 0) console.log("   unexpected:", otherErrors.slice(0, 3).map((e) => (e as PromiseRejectedResult).reason));
  check("remainingCapacity == 0 (never negative)", dep.remainingCapacity === 0, `= ${dep.remainingCapacity}`);
  check("bookings created == capacity", bookings.length === CAPACITY, `${bookings.length} rows`);
  check("seats booked == capacity (no oversell)", seatsBooked === CAPACITY, `${seatsBooked} seats`);

  // ── Cleanup ────────────────────────────────────────────────────────────────
  await cleanup();
  const leftover = await db.tour.count({ where: { slug: TOUR_SLUG } });
  check("cleanup complete (DB seed-clean)", leftover === 0);

  console.log(failures === 0 ? "\n✅ NO-OVERSELL PROVEN" : `\n❌ ${failures} CHECK(S) FAILED`);
  process.exitCode = failures === 0 ? 0 : 1;
}

async function cleanup() {
  const tour = await db.tour.findUnique({ where: { slug: TOUR_SLUG }, select: { id: true } });
  if (!tour) return;
  const deps = await db.tourDeparture.findMany({ where: { tourId: tour.id }, select: { id: true } });
  const depIds = deps.map((d) => d.id);
  if (depIds.length > 0) {
    const bookings = await db.booking.findMany({ where: { departureId: { in: depIds } }, select: { id: true } });
    const bookingIds = bookings.map((b) => b.id);
    if (bookingIds.length > 0) await db.payment.deleteMany({ where: { bookingId: { in: bookingIds } } });
    await db.booking.deleteMany({ where: { departureId: { in: depIds } } });
    await db.tourDeparture.deleteMany({ where: { tourId: tour.id } });
  }
  await db.tour.delete({ where: { id: tour.id } });
}

main()
  .catch((e) => {
    console.error("TEST HARNESS FAILED:", e);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
