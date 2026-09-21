/**
 * Phase 7 — Subsystem 2 (Catalog CRUD) probe.
 *
 * Verifies against the real MySQL what the admin catalog service relies on and
 * a unit test (behind `server-only`) can't reach:
 *   • the 4 new D3 Json/scalar fields (faqs, travelNotes, ctaLabel, ctaHref)
 *     persist and round-trip through Prisma (i.e. the migration applied);
 *   • unique-slug rejection (P2002) — the friendly pre-check's backstop;
 *   • itinerary @@unique([tourId, dayNumber]) rejection;
 *   • the booking Restrict guard: a tour with a booked departure CANNOT be
 *     hard-deleted (why deleteTour pre-checks and archives instead);
 *   • cascade: a booking-free tour delete removes its itinerary, departures and
 *     destination links.
 *
 * Run:
 *   DATABASE_URL="mysql://ptah:ptah-dev-password@127.0.0.1:3306/ptah_tours" npx tsx scripts/phase7-catalog.mts
 *
 * Own PrismaClient (server-only db.ts breaks tsx), exactly like the other probes.
 * Everything it creates is namespaced with a timestamp and cleaned up at the end.
 */
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const url = process.env.DATABASE_URL ?? "mysql://ptah:ptah-dev-password@127.0.0.1:3306/ptah_tours";
const db = new PrismaClient({ adapter: new PrismaMariaDb(url) });

let failures = 0;
function check(label: string, cond: boolean): void {
  console.log(`${cond ? "PASS" : "FAIL"}  ${label}`);
  if (!cond) failures++;
}

const tag = Date.now().toString(36);
const createdTourIds: string[] = [];
const createdDestIds: string[] = [];

async function main(): Promise<void> {
  // ── Create a tour with all 4 new D3 fields populated ───────────────────────
  const faqs = [{ q: "Is airport pickup included?", a: "Yes, on arrival day." }];
  const travelNotes = ["Bring sunscreen.", "Visa on arrival for most nationalities."];
  const tour = await db.tour.create({
    data: {
      slug: `probe-tour-${tag}`,
      title: "Probe Tour",
      summary: "A probe tour.",
      descriptionLong: "Long description.",
      durationDays: 5,
      basePriceCents: 129900,
      currency: "USD",
      difficulty: "MODERATE",
      inclusions: ["Guide", "Hotel"],
      exclusions: ["Flights"],
      gallery: ["/assets/probe/a.jpg"],
      faqs,
      travelNotes,
      ctaLabel: "Download itinerary",
      ctaHref: "/contact",
      status: "DRAFT",
    },
    select: { id: true },
  });
  createdTourIds.push(tour.id);
  check("tour created with D3 fields", !!tour.id);

  // Read back — the new Json/scalars must round-trip exactly.
  const read = await db.tour.findUnique({
    where: { id: tour.id },
    select: { faqs: true, travelNotes: true, ctaLabel: true, ctaHref: true },
  });
  const readFaqs = read?.faqs as { q: string; a: string }[] | null;
  const readNotes = read?.travelNotes as string[] | null;
  check("faqs Json round-trips", Array.isArray(readFaqs) && readFaqs[0]?.q === faqs[0].q && readFaqs[0]?.a === faqs[0].a);
  check("travelNotes Json round-trips", Array.isArray(readNotes) && readNotes.length === 2 && readNotes[1] === travelNotes[1]);
  check("ctaLabel/ctaHref round-trip", read?.ctaLabel === "Download itinerary" && read?.ctaHref === "/contact");

  // Null CTA is allowed (both blank).
  const tour2 = await db.tour.create({
    data: {
      slug: `probe-tour2-${tag}`,
      title: "Probe Tour 2",
      summary: "s",
      descriptionLong: "d",
      durationDays: 1,
      basePriceCents: 5000,
      currency: "USD",
      difficulty: "EASY",
      status: "DRAFT",
    },
    select: { id: true, ctaLabel: true, ctaHref: true, faqs: true },
  });
  createdTourIds.push(tour2.id);
  check("tour with null CTA + null faqs creates", tour2.ctaLabel === null && tour2.ctaHref === null && tour2.faqs === null);

  // ── Unique-slug rejection (P2002 backstop) ─────────────────────────────────
  let slugRejected = false;
  try {
    await db.tour.create({
      data: {
        slug: `probe-tour-${tag}`, // duplicate
        title: "Dup", summary: "s", descriptionLong: "d",
        durationDays: 1, basePriceCents: 1000, currency: "USD", difficulty: "EASY", status: "DRAFT",
      },
    });
  } catch {
    slugRejected = true;
  }
  check("duplicate slug is rejected by the DB", slugRejected);

  // ── Itinerary @@unique([tourId, dayNumber]) ────────────────────────────────
  await db.itineraryDay.create({ data: { tourId: tour.id, dayNumber: 1, title: "Day 1", description: "Arrive", sortOrder: 1 } });
  let dayDupRejected = false;
  try {
    await db.itineraryDay.create({ data: { tourId: tour.id, dayNumber: 1, title: "Dup day", description: "x", sortOrder: 1 } });
  } catch {
    dayDupRejected = true;
  }
  check("duplicate itinerary day number is rejected", dayDupRejected);

  // ── Destination link (M:N) ─────────────────────────────────────────────────
  const dest = await db.destination.create({
    data: { slug: `probe-dest-${tag}`, name: "Probe City" },
    select: { id: true },
  });
  createdDestIds.push(dest.id);
  await db.tourDestination.create({ data: { tourId: tour.id, destinationId: dest.id, sortOrder: 0 } });
  const linkCount = await db.tourDestination.count({ where: { tourId: tour.id } });
  check("tour ↔ destination link created", linkCount === 1);

  // ── Departure + booking Restrict guard ─────────────────────────────────────
  const departure = await db.tourDeparture.create({
    data: {
      tourId: tour.id,
      startDate: new Date("2027-01-01T00:00:00.000Z"),
      endDate: new Date("2027-01-06T00:00:00.000Z"),
      maxCapacity: 10,
      remainingCapacity: 8, // 2 booked
      status: "OPEN",
    },
    select: { id: true, maxCapacity: true, remainingCapacity: true },
  });
  check("departure created with booked-seat math", departure.maxCapacity - departure.remainingCapacity === 2);

  const booking = await db.booking.create({
    data: {
      departureId: departure.id,
      guestEmail: "probe@example.com",
      status: "CONFIRMED",
      seats: 2,
      totalCents: 259800,
      currency: "USD",
      contactInfo: { fullName: "Probe Tester", email: "probe@example.com" },
    },
    select: { id: true },
  });

  // Restrict guard: a tour with a booked departure can't be hard-deleted.
  let deleteBlocked = false;
  try {
    await db.tour.delete({ where: { id: tour.id } });
  } catch {
    deleteBlocked = true;
  }
  check("tour with a booked departure is delete-blocked (Restrict → archive instead)", deleteBlocked);

  // Remove the booking, then the tour delete must cascade itinerary/departures/links.
  await db.booking.delete({ where: { id: booking.id } });
  await db.tour.delete({ where: { id: tour.id } });
  createdTourIds.shift(); // tour.id now gone
  const [daysLeft, depsLeft, linksLeft] = await Promise.all([
    db.itineraryDay.count({ where: { tourId: tour.id } }),
    db.tourDeparture.count({ where: { tourId: tour.id } }),
    db.tourDestination.count({ where: { tourId: tour.id } }),
  ]);
  check("booking-free tour delete cascades itinerary/departures/links", daysLeft === 0 && depsLeft === 0 && linksLeft === 0);

  // Destination survives the tour deletion (only the link cascaded).
  const destStillThere = await db.destination.findUnique({ where: { id: dest.id }, select: { id: true } });
  check("destination survives a linked tour's deletion", destStillThere?.id === dest.id);

  console.log(`\n${failures === 0 ? "ALL PASS" : `${failures} FAILURE(S)`}`);
  if (failures > 0) process.exitCode = 1;
}

main()
  .catch((e) => {
    console.error("PROBE_FAIL", e);
    process.exitCode = 1;
  })
  .finally(async () => {
    // Best-effort cleanup of anything left behind on a mid-probe failure.
    for (const id of createdTourIds) {
      await db.booking.deleteMany({ where: { departure: { tourId: id } } }).catch(() => {});
      await db.tour.delete({ where: { id } }).catch(() => {});
    }
    for (const id of createdDestIds) {
      await db.destination.delete({ where: { id } }).catch(() => {});
    }
    await db.$disconnect();
  });
