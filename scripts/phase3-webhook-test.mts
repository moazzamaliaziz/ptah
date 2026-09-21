/**
 * Phase 3 gate — Stripe WEBHOOK REPLAY + IDEMPOTENCY + SIGNATURE proof.
 *
 * Runs against a LIVE server (`next start`) started with:
 *   STRIPE_SECRET_KEY=sk_test_dummy  STRIPE_WEBHOOK_SECRET=whsec_ptah_gate
 * (constructEvent is local HMAC — no real Stripe account needed.)
 *
 * Proves, end-to-end through the real route handler:
 *   1. SIGNATURE — a tampered body → 400 (constructEvent rejects it).
 *   2. CONFIRM — a correctly-signed checkout.session.completed(paid) flips the
 *      PENDING_PAYMENT booking → CONFIRMED, payment → SUCCEEDED, capacity
 *      unchanged (seats were already claimed at reserve time).
 *   3. REPLAY — the SAME event id delivered again → {duplicate:true}, booking
 *      still CONFIRMED, exactly ONE webhook_events row (unique-id guard).
 *   4. EXPIRE/RELEASE — checkout.session.expired on a second pending booking →
 *      FAILED + seats released exactly once; a replay of it does not double-release.
 *
 * Cleans up all test rows. Run (server must be up):
 *   WEBHOOK_SECRET=whsec_ptah_gate npx tsx scripts/phase3-webhook-test.mts
 */
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const BASE = process.env.BASE_URL ?? "http://127.0.0.1:3000";
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET ?? "whsec_ptah_gate";
const ENDPOINT = `${BASE}/api/webhooks/stripe`;
const url = process.env.DATABASE_URL ?? "mysql://ptah:ptah-dev-password@127.0.0.1:3306/ptah_tours";

const stripe = new Stripe("sk_test_dummy", { apiVersion: "2025-09-30.clover" });
const db = new PrismaClient({ adapter: new PrismaMariaDb(url) });

const TOUR_SLUG = "__webhook_test_tour__";
let failures = 0;
const check = (name: string, cond: boolean, detail = "") => {
  console.log(`${cond ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!cond) failures++;
};

function signedPost(payload: object) {
  const body = JSON.stringify(payload);
  const header = stripe.webhooks.generateTestHeaderString({ payload: body, secret: WEBHOOK_SECRET });
  return fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json", "stripe-signature": header },
    body,
  });
}

function completedEvent(eventId: string, bookingId: string, total: number) {
  return {
    id: eventId,
    object: "event",
    type: "checkout.session.completed",
    data: {
      object: {
        id: `cs_test_${eventId}`,
        object: "checkout.session",
        payment_status: "paid",
        client_reference_id: bookingId,
        payment_intent: `pi_test_${bookingId.slice(0, 8)}`,
        amount_total: total,
        metadata: { bookingId },
      },
    },
  };
}

function expiredEvent(eventId: string, bookingId: string) {
  return {
    id: eventId,
    object: "event",
    type: "checkout.session.expired",
    data: {
      object: {
        id: `cs_test_${eventId}`,
        object: "checkout.session",
        client_reference_id: bookingId,
        metadata: { bookingId },
      },
    },
  };
}

function refundedEvent(eventId: string, intentId: string) {
  return {
    id: eventId,
    object: "event",
    type: "charge.refunded",
    data: {
      object: {
        id: `ch_test_${eventId}`,
        object: "charge",
        payment_intent: intentId,
        refunded: true,
        amount_refunded: 24000,
      },
    },
  };
}

async function makePendingBooking(seats: number): Promise<{ bookingId: string; departureId: string; capBefore: number; total: number }> {
  const tour = await db.tour.upsert({
    where: { slug: TOUR_SLUG },
    update: {},
    create: {
      slug: TOUR_SLUG, title: "Webhook Test Tour", summary: "t", descriptionLong: "t",
      durationDays: 1, basePriceCents: 12000, currency: "USD", status: "PUBLISHED",
    },
  });
  const dep = await db.tourDeparture.create({
    data: { tourId: tour.id, startDate: new Date("2099-06-01"), endDate: new Date("2099-06-01"), maxCapacity: 20, remainingCapacity: 20 - seats, status: "OPEN" },
  });
  const total = 12000 * seats;
  const booking = await db.booking.create({
    data: { departureId: dep.id, seats, totalCents: total, currency: "USD", status: "PENDING_PAYMENT", guestEmail: "wh@test.local", contactInfo: { fullName: "WH Test", email: "wh@test.local", phone: "+100" } },
  });
  return { bookingId: booking.id, departureId: dep.id, capBefore: dep.remainingCapacity, total };
}

async function main() {
  await cleanup();

  // ── 1) Bad signature → 400 ─────────────────────────────────────────────────
  const badRes = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json", "stripe-signature": "t=1,v1=deadbeef" },
    body: JSON.stringify({ id: "evt_bad", type: "checkout.session.completed", data: { object: {} } }),
  });
  check("tampered/invalid signature rejected (400)", badRes.status === 400, `status ${badRes.status}`);

  // ── 2) CONFIRM ─────────────────────────────────────────────────────────────
  const b1 = await makePendingBooking(2);
  const evtId = `evt_test_confirm_${Date.now()}`;
  const res1 = await signedPost(completedEvent(evtId, b1.bookingId, b1.total));
  const json1 = (await res1.json()) as { received?: boolean; duplicate?: boolean };
  check("first delivery accepted (200, received)", res1.status === 200 && json1.received === true, `status ${res1.status} ${JSON.stringify(json1)}`);

  const booking1 = await db.booking.findUniqueOrThrow({ where: { id: b1.bookingId } });
  check("booking flipped PENDING → CONFIRMED", booking1.status === "CONFIRMED", booking1.status);
  const dep1 = await db.tourDeparture.findUniqueOrThrow({ where: { id: b1.departureId } });
  check("capacity unchanged by confirm (already claimed)", dep1.remainingCapacity === b1.capBefore, `${dep1.remainingCapacity} vs ${b1.capBefore}`);
  const pay1 = await db.payment.findFirst({ where: { bookingId: b1.bookingId } });
  check("payment recorded SUCCEEDED with intent", pay1?.status === "SUCCEEDED" && !!pay1?.intentId, `${pay1?.status}/${pay1?.intentId}`);

  // ── 3) REPLAY (same event id) ──────────────────────────────────────────────
  const res2 = await signedPost(completedEvent(evtId, b1.bookingId, b1.total));
  const json2 = (await res2.json()) as { received?: boolean; duplicate?: boolean };
  check("replay of same event → duplicate:true (200)", res2.status === 200 && json2.duplicate === true, JSON.stringify(json2));
  const evtRows = await db.webhookEvent.count({ where: { eventId: evtId } });
  check("exactly ONE webhook_events row for event id", evtRows === 1, `${evtRows} rows`);
  const booking1After = await db.booking.findUniqueOrThrow({ where: { id: b1.bookingId } });
  check("booking still CONFIRMED after replay (no double-processing)", booking1After.status === "CONFIRMED", booking1After.status);
  const payCount = await db.payment.count({ where: { bookingId: b1.bookingId } });
  check("no duplicate payment row from replay", payCount === 1, `${payCount} payments`);

  // ── 4) EXPIRE → release seats exactly once ─────────────────────────────────
  const b2 = await makePendingBooking(3); // capBefore = 17 (20 - 3)
  const expId = `evt_test_expire_${Date.now()}`;
  const resExp = await signedPost(expiredEvent(expId, b2.bookingId));
  check("expire delivery accepted (200)", resExp.status === 200, `status ${resExp.status}`);
  const booking2 = await db.booking.findUniqueOrThrow({ where: { id: b2.bookingId } });
  check("expired booking → FAILED", booking2.status === "FAILED", booking2.status);
  const dep2 = await db.tourDeparture.findUniqueOrThrow({ where: { id: b2.departureId } });
  check("seats released on expire (17 → 20)", dep2.remainingCapacity === b2.capBefore + 3, `${dep2.remainingCapacity}`);

  // replay the expire — must NOT double-release
  await signedPost(expiredEvent(expId, b2.bookingId));
  const dep2Replay = await db.tourDeparture.findUniqueOrThrow({ where: { id: b2.departureId } });
  check("expire replay does not double-release", dep2Replay.remainingCapacity === b2.capBefore + 3, `${dep2Replay.remainingCapacity}`);

  // ── 5) REFUND → release seats on a CONFIRMED booking ───────────────────────
  // b1 is CONFIRMED with payment.intentId = pi_test_<first8 of bookingId> (set
  // by confirmBookingPaid). charge.refunded resolves the booking via that intent.
  const b1Intent = `pi_test_${b1.bookingId.slice(0, 8)}`;
  const refundId = `evt_test_refund_${Date.now()}`;
  const resRef = await signedPost(refundedEvent(refundId, b1Intent));
  check("refund delivery accepted (200)", resRef.status === 200, `status ${resRef.status}`);
  const booking1Ref = await db.booking.findUniqueOrThrow({ where: { id: b1.bookingId } });
  check("confirmed booking → REFUNDED", booking1Ref.status === "REFUNDED", booking1Ref.status);
  const dep1Ref = await db.tourDeparture.findUniqueOrThrow({ where: { id: b1.departureId } });
  check("seats released on refund", dep1Ref.remainingCapacity === b1.capBefore + 2, `${dep1Ref.remainingCapacity} vs ${b1.capBefore + 2}`);
  const pay1Ref = await db.payment.findFirst({ where: { bookingId: b1.bookingId } });
  check("payment → REFUNDED", pay1Ref?.status === "REFUNDED", pay1Ref?.status);
  // replay refund — must NOT double-release
  await signedPost(refundedEvent(refundId, b1Intent));
  const dep1RefReplay = await db.tourDeparture.findUniqueOrThrow({ where: { id: b1.departureId } });
  check("refund replay does not double-release", dep1RefReplay.remainingCapacity === b1.capBefore + 2, `${dep1RefReplay.remainingCapacity}`);

  await cleanup();
  const leftover = await db.tour.count({ where: { slug: TOUR_SLUG } });
  check("cleanup complete (DB seed-clean)", leftover === 0);

  console.log(failures === 0 ? "\n✅ WEBHOOK REPLAY + IDEMPOTENCY + SIGNATURE PROVEN" : `\n❌ ${failures} CHECK(S) FAILED`);
  process.exitCode = failures === 0 ? 0 : 1;
}

async function cleanup() {
  const tour = await db.tour.findUnique({ where: { slug: TOUR_SLUG }, select: { id: true } });
  if (tour) {
    const deps = await db.tourDeparture.findMany({ where: { tourId: tour.id }, select: { id: true } });
    const depIds = deps.map((d) => d.id);
    if (depIds.length) {
      const bookings = await db.booking.findMany({ where: { departureId: { in: depIds } }, select: { id: true } });
      const bookingIds = bookings.map((b) => b.id);
      if (bookingIds.length) await db.payment.deleteMany({ where: { bookingId: { in: bookingIds } } });
      await db.booking.deleteMany({ where: { departureId: { in: depIds } } });
      await db.tourDeparture.deleteMany({ where: { tourId: tour.id } });
    }
    await db.tour.delete({ where: { id: tour.id } });
  }
  // Remove any webhook_events rows created by this gate (evt_test_*).
  await db.webhookEvent.deleteMany({ where: { eventId: { startsWith: "evt_test_" } } });
}

main().catch((e) => { console.error("HARNESS FAILED:", e); process.exitCode = 1; }).finally(() => db.$disconnect());
