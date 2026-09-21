/**
 * Booking transactional core — the race-safe seat-claim primitive (Phase 3).
 *
 * This module is deliberately FREE of `server-only` so it can be imported by
 * plain-Node tsx gate scripts (the concurrency/oversell proof builds its own
 * PrismaClient exactly like prisma/seed.ts). The `server-only` boundary lives
 * in src/server/booking.ts, which wraps these functions with the app's shared
 * client, auth, validation, and audit.
 *
 * The invariant this file exists to guarantee: a departure can NEVER oversell,
 * even under concurrent bookings. Seats are claimed with a single conditional
 * UPDATE — `updateMany ... where remainingCapacity >= seats` — which the
 * database executes atomically (row lock). We NEVER read capacity into app
 * memory and write it back (that read-modify-write is the classic oversell
 * race). Everything runs inside `$transaction` so a later failure rolls the
 * seat claim back.
 */
import type { Prisma, PrismaClient } from "@prisma/client";

/** Minimal client surface these helpers need — satisfied by PrismaClient and
 *  by the transaction handle passed into a `$transaction` callback. */
type Db = PrismaClient | Prisma.TransactionClient;

export const MIN_SEATS = 1;
export const MAX_SEATS = 20;

export type ReserveFailureReason =
  | "DEPARTURE_NOT_FOUND"
  | "DEPARTURE_NOT_OPEN"
  | "INVALID_SEATS"
  | "SOLD_OUT";

export class ReserveError extends Error {
  constructor(public readonly reason: ReserveFailureReason) {
    super(reason);
    this.name = "ReserveError";
  }
}

export interface ReserveInput {
  departureId: string;
  seats: number;
  userId: string | null;
  guestEmail: string | null;
  /** zod-validated JSON at the caller boundary; opaque here. */
  contactInfo: Prisma.InputJsonValue;
}

export interface ReservedBooking {
  bookingId: string;
  totalCents: number;
  currency: string;
  tourTitle: string;
  tourSlug: string;
}

/**
 * Atomically claim `seats` on a departure and create a PENDING_PAYMENT booking.
 *
 * Runs the whole thing in a transaction:
 *   1. conditional decrement (`updateMany` guarded by remaining >= seats AND
 *      status = OPEN) — count 0 means the guard failed (sold out / closed);
 *   2. read the (now-decremented) departure + its tour to price the booking
 *      server-side (departure override, else tour base price);
 *   3. create the booking row with the authoritative total.
 *
 * Pricing is computed here, never trusted from the client. Throws ReserveError
 * on any guard failure (transaction rolls back → seats restored automatically).
 */
export async function reserveSeatsWith(
  client: Db,
  input: ReserveInput,
): Promise<ReservedBooking> {
  const { departureId, seats, userId, guestEmail, contactInfo } = input;

  if (!Number.isInteger(seats) || seats < MIN_SEATS || seats > MAX_SEATS) {
    throw new ReserveError("INVALID_SEATS");
  }

  const runner = async (tx: Db): Promise<ReservedBooking> => {
    // 1) Atomic seat claim. The WHERE clause is the entire safety mechanism:
    //    the DB will only decrement when enough seats remain AND it is OPEN.
    const claim = await tx.tourDeparture.updateMany({
      where: {
        id: departureId,
        status: "OPEN",
        remainingCapacity: { gte: seats },
      },
      data: { remainingCapacity: { decrement: seats } },
    });

    if (claim.count === 0) {
      // Distinguish the failure so the UI can message precisely, without a
      // read-modify-write: one narrow read AFTER the failed guard is race-safe
      // because we are not making a capacity decision from it.
      const dep = await tx.tourDeparture.findUnique({
        where: { id: departureId },
        select: { status: true, remainingCapacity: true },
      });
      if (!dep) throw new ReserveError("DEPARTURE_NOT_FOUND");
      if (dep.status !== "OPEN") throw new ReserveError("DEPARTURE_NOT_OPEN");
      throw new ReserveError("SOLD_OUT");
    }

    // 2) Price server-side from the just-claimed departure + tour.
    const dep = await tx.tourDeparture.findUniqueOrThrow({
      where: { id: departureId },
      select: {
        priceOverrideCents: true,
        tour: { select: { basePriceCents: true, currency: true, title: true, slug: true } },
      },
    });
    const unitCents = dep.priceOverrideCents ?? dep.tour.basePriceCents;
    const totalCents = unitCents * seats;

    // 3) Create the PENDING_PAYMENT booking with the authoritative total.
    const booking = await tx.booking.create({
      data: {
        userId,
        guestEmail,
        departureId,
        seats,
        totalCents,
        currency: dep.tour.currency,
        status: "PENDING_PAYMENT",
        contactInfo,
      },
      select: { id: true },
    });

    return {
      bookingId: booking.id,
      totalCents,
      currency: dep.tour.currency,
      tourTitle: dep.tour.title,
      tourSlug: dep.tour.slug,
    };
  };

  // If we were handed a transaction client already, reuse it; otherwise open
  // one. (`$transaction` exists only on PrismaClient, not the tx handle.)
  if ("$transaction" in client && typeof client.$transaction === "function") {
    return (client as PrismaClient).$transaction((tx) => runner(tx));
  }
  return runner(client);
}

/**
 * Release `seats` back to a departure (compensating action for an abandoned or
 * failed PENDING_PAYMENT booking). Capped at maxCapacity by the caller's data
 * integrity; here we simply increment. Idempotency is the CALLER's job — only
 * call this once per booking, guarded by a booking-status transition.
 */
export async function releaseSeatsWith(
  client: Db,
  departureId: string,
  seats: number,
): Promise<void> {
  await client.tourDeparture.update({
    where: { id: departureId },
    data: { remainingCapacity: { increment: seats } },
  });
}
