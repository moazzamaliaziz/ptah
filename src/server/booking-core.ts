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

/** Fixed passenger types (P4). Order matters: it's the canonical display order
 *  and the order line items are built in. `adult` is always required (>= 1). */
export const PASSENGER_TYPES = ["adult", "child", "infant"] as const;
export type PassengerType = (typeof PASSENGER_TYPES)[number];

/** Human labels per passenger type, used when a stored breakdown is rendered on
 *  the customer voucher, the admin invoice PDF and the orders detail page. Those
 *  surfaces are English-only today, matching the rest of those documents. */
export const PAX_TYPE_LABEL: Record<PassengerType, string> = {
  adult: "Adults",
  child: "Children",
  infant: "Infants",
};

/** How many of each passenger type a booking is for. `seats` (the total
 *  traveler count that drives capacity) is always adult + child + infant. */
export interface PassengerCounts {
  adult: number;
  child: number;
  infant: number;
}

/** One line of a frozen price breakdown — `count` travelers of `type` at
 *  `unitCents` each. Line total is `count * unitCents`. */
export interface PriceLine {
  type: PassengerType;
  count: number;
  unitCents: number;
}

/** The authoritative price breakdown captured at reservation time and stored on
 *  the booking. `items` only contains types with count > 0; the item totals sum
 *  EXACTLY to `totalCents` (so Stripe line items reconcile to the charge). */
export interface PriceBreakdown {
  items: PriceLine[];
  totalCents: number;
  currency: string;
}

/** Resolved per-type unit prices for one tour/departure. `adultCents` is already
 *  resolved (departure override ?? tour base). A null child/infant price means
 *  that passenger type is NOT offered on this tour. May be 0 (e.g. free infant). */
export interface TourPricing {
  adultCents: number;
  childCents: number | null;
  infantCents: number | null;
  currency: string;
}

export type ReserveFailureReason =
  | "DEPARTURE_NOT_FOUND"
  | "DEPARTURE_NOT_OPEN"
  | "INVALID_SEATS"
  | "SOLD_OUT"
  | "BOOKING_CLOSED"
  | "PRICE_UNAVAILABLE"
  | "COUPON_INVALID";

export class ReserveError extends Error {
  constructor(public readonly reason: ReserveFailureReason) {
    super(reason);
    this.name = "ReserveError";
  }
}

/** Total travelers (drives capacity/seat claim). Infants count as seats too —
 *  simplest safe rule; a tour that seats infants free still holds a place. */
export function totalSeats(counts: PassengerCounts): number {
  return counts.adult + counts.child + counts.infant;
}

/**
 * Validate passenger counts and return the total seat count. One rule shared by
 * every caller: each count a non-negative integer, at least one adult, and the
 * total within [MIN_SEATS, MAX_SEATS]. Throws ReserveError("INVALID_SEATS").
 */
export function assertValidCounts(counts: PassengerCounts): number {
  for (const count of [counts.adult, counts.child, counts.infant]) {
    if (!Number.isInteger(count) || count < 0) throw new ReserveError("INVALID_SEATS");
  }
  if (counts.adult < MIN_SEATS) throw new ReserveError("INVALID_SEATS");
  const seats = totalSeats(counts);
  if (seats < MIN_SEATS || seats > MAX_SEATS) throw new ReserveError("INVALID_SEATS");
  return seats;
}

/**
 * Pure pricing — turn passenger counts + resolved per-type prices into a frozen
 * breakdown whose line totals sum EXACTLY to `totalCents`. No DB access, no
 * side effects. Validates counts (via assertValidCounts) and rejects any
 * requested type whose price is null with ReserveError("PRICE_UNAVAILABLE").
 */
export function priceBooking(counts: PassengerCounts, pricing: TourPricing): PriceBreakdown {
  assertValidCounts(counts);

  const entries: Array<[PassengerType, number, number | null]> = [
    ["adult", counts.adult, pricing.adultCents],
    ["child", counts.child, pricing.childCents],
    ["infant", counts.infant, pricing.infantCents],
  ];

  const items: PriceLine[] = [];
  let totalCents = 0;
  for (const [type, count, unitCents] of entries) {
    if (count === 0) continue;
    // null ⇒ type not offered; 0 is a valid (free) price and must pass.
    if (unitCents == null) throw new ReserveError("PRICE_UNAVAILABLE");
    items.push({ type, count, unitCents });
    totalCents += unitCents * count;
  }
  return { items, totalCents, currency: pricing.currency };
}

/**
 * Re-hydrate a stored `pricing` JSON value into a typed PriceBreakdown, or null
 * when it is absent or malformed. Bookings created before P4 have `pricing`
 * null, and we never trust the DB blob's shape, so every field is checked here.
 * Pure and dependency-free — safe to import from server code, PDFs, read layers
 * and clients alike. Display surfaces fall back to the plain seat count on null.
 */
export function parsePriceBreakdown(value: unknown): PriceBreakdown | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const obj = value as Record<string, unknown>;
  if (!Array.isArray(obj.items)) return null;
  if (typeof obj.totalCents !== "number" || typeof obj.currency !== "string") return null;
  const items: PriceLine[] = [];
  for (const raw of obj.items) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
    const line = raw as Record<string, unknown>;
    if (typeof line.type !== "string" || !(PASSENGER_TYPES as readonly string[]).includes(line.type)) return null;
    if (typeof line.count !== "number" || typeof line.unitCents !== "number") return null;
    items.push({ type: line.type as PassengerType, count: line.count, unitCents: line.unitCents });
  }
  return { items, totalCents: obj.totalCents, currency: obj.currency };
}

// ─────────────────────────────── Coupons (P5) ───────────────────────────────

/** Discount kind. Mirrors the Prisma `CouponType` enum but is declared here as a
 *  plain union so this pure module keeps needing no runtime Prisma import. */
export type CouponKind = "PERCENT" | "FIXED";

/** The coupon fields the pure evaluator reads. A structural subset of the Coupon
 *  model, so the same evaluator serves the live-preview action and the reserve
 *  transaction (both then agree to the cent on whether a code applies). */
export interface CouponData {
  code: string;
  type: CouponKind;
  value: number;
  currency: string | null;
  minSpendCents: number | null;
  maxRedemptions: number | null;
  startsAt: Date | null;
  endsAt: Date | null;
  active: boolean;
}

/** Why a coupon did not apply — surfaced to the customer on the live preview. */
export type CouponRejectionReason =
  | "INACTIVE"
  | "NOT_STARTED"
  | "EXPIRED"
  | "CURRENCY_MISMATCH"
  | "MIN_SPEND"
  | "LIMIT_REACHED";

export type CouponEvaluation =
  | { ok: true; discountCents: number; netCents: number }
  | { ok: false; reason: CouponRejectionReason };

/**
 * Pure coupon check: given a coupon, the GROSS amount + its currency, how many
 * times the code is already redeemed, and the current time, decide whether it
 * applies and for how much. No DB, no side effects — shared by the live-preview
 * action (booking.ts) and the reserve transaction (reserveSeatsWith) so the two
 * always agree. The discount is floored to whole cents and clamped to
 * [0, gross], so the net charge can never go negative.
 */
export function evaluateCoupon(args: {
  coupon: CouponData;
  grossCents: number;
  currency: string;
  redemptions: number;
  now?: Date;
}): CouponEvaluation {
  const { coupon, grossCents, currency, redemptions } = args;
  const now = args.now ?? new Date();

  if (!coupon.active) return { ok: false, reason: "INACTIVE" };
  if (coupon.startsAt && now < coupon.startsAt) return { ok: false, reason: "NOT_STARTED" };
  if (coupon.endsAt && now > coupon.endsAt) return { ok: false, reason: "EXPIRED" };

  // A FIXED coupon is money in a specific currency; a PERCENT coupon may also be
  // pinned to one currency. Either way, a set currency must match the booking's.
  if (coupon.currency && coupon.currency !== currency) {
    return { ok: false, reason: "CURRENCY_MISMATCH" };
  }
  // A FIXED coupon with no currency is a data error — refuse rather than guess.
  if (coupon.type === "FIXED" && !coupon.currency) {
    return { ok: false, reason: "CURRENCY_MISMATCH" };
  }
  // A min-spend threshold is money; without a currency it cannot be compared to
  // the booking total without guessing across currencies. Treat a currency-less
  // min-spend as a data error (new coupons can't reach this — the admin schema
  // requires a currency whenever a min-spend is set). After this guard, whenever
  // minSpendCents is set the coupon's currency equals the booking's (the mismatch
  // check above already rejected a differing one), so the compare below is exact.
  if (coupon.minSpendCents != null && !coupon.currency) {
    return { ok: false, reason: "CURRENCY_MISMATCH" };
  }

  if (coupon.minSpendCents != null && grossCents < coupon.minSpendCents) {
    return { ok: false, reason: "MIN_SPEND" };
  }
  if (coupon.maxRedemptions != null && redemptions >= coupon.maxRedemptions) {
    return { ok: false, reason: "LIMIT_REACHED" };
  }

  const raw =
    coupon.type === "PERCENT"
      ? Math.floor((grossCents * coupon.value) / 100) // value is 1–100
      : coupon.value; // FIXED: already whole cents
  const discountCents = Math.max(0, Math.min(raw, grossCents));
  return { ok: true, discountCents, netCents: grossCents - discountCents };
}

export interface ReserveInput {
  departureId: string;
  /** Per-passenger-type counts. `seats` is derived as the sum. */
  counts: PassengerCounts;
  userId: string | null;
  guestEmail: string | null;
  /** ISO-3166 alpha-2, uppercased, or null. Stored for P7 reporting. */
  originCountry: string | null;
  /** Optional UPPERCASE coupon code to apply. Re-validated inside the reserve
   *  transaction; an invalid/expired/exhausted code throws COUPON_INVALID and
   *  rolls the whole reservation back (never silently charges the full price). */
  couponCode: string | null;
  /** zod-validated JSON at the caller boundary; opaque here. */
  contactInfo: Prisma.InputJsonValue;
}

export interface ReservedBooking {
  bookingId: string;
  seats: number;
  /** NET charge (gross − discountCents). Every payment path reads this. */
  totalCents: number;
  currency: string;
  /** GROSS per-passenger-type breakdown, stored unchanged (never net). */
  pricing: PriceBreakdown;
  /** Applied coupon code, or null. */
  couponCode: string | null;
  /** Discount subtracted from gross to reach totalCents; 0 when no coupon. */
  discountCents: number;
  tourTitle: string;
  tourSlug: string;
}

/**
 * Atomically claim seats on a departure and create a PENDING_PAYMENT booking.
 *
 * Runs the whole thing in a transaction:
 *   1. conditional decrement (`updateMany` guarded by remaining >= seats AND
 *      status = OPEN) — count 0 means the guard failed (sold out / closed);
 *   2. read the (now-decremented) departure + its tour to price the booking
 *      server-side (per-passenger-type: adult = departure override else base,
 *      child/infant from the tour), and to enforce the close-tour toggle;
 *   3. create the booking row with the authoritative total + frozen breakdown.
 *
 * `seats` = adult + child + infant. Pricing is computed here, never trusted
 * from the client. Throws ReserveError on any guard failure (transaction rolls
 * back → seats restored automatically).
 */
export async function reserveSeatsWith(
  client: Db,
  input: ReserveInput,
): Promise<ReservedBooking> {
  const { departureId, counts, userId, guestEmail, originCountry, couponCode, contactInfo } = input;

  // Fail fast on bad counts before we touch the DB. (priceBooking re-checks the
  // same rule after we know per-type prices — one shared validator.)
  const seats = assertValidCounts(counts);

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

    // 2) Price server-side from the just-claimed departure + tour. Reading after
    //    the claim is fine: the close-tour and price checks below aren't capacity
    //    decisions, and any throw rolls the transaction back (restoring seats).
    const dep = await tx.tourDeparture.findUniqueOrThrow({
      where: { id: departureId },
      select: {
        priceOverrideCents: true,
        tour: {
          select: {
            basePriceCents: true,
            childPriceCents: true,
            infantPriceCents: true,
            currency: true,
            title: true,
            slug: true,
            bookingClosed: true,
          },
        },
      },
    });

    // Defense in depth: a tour with bookings temporarily closed must not accept
    // new reservations even if a stale funnel posts here. Rollback frees seats.
    if (dep.tour.bookingClosed) throw new ReserveError("BOOKING_CLOSED");

    const pricing: TourPricing = {
      adultCents: dep.priceOverrideCents ?? dep.tour.basePriceCents,
      childCents: dep.tour.childPriceCents,
      infantCents: dep.tour.infantPriceCents,
      currency: dep.tour.currency,
    };
    const breakdown = priceBooking(counts, pricing);

    // P5: apply a coupon in the SAME transaction, so `booking.totalCents` is the
    // authoritative NET charge every payment path (Stripe/PayPal/bank) reads.
    // The redemption cap is enforced by counting live bookings on the code (no
    // drift-prone counter column). Unlike the seat claim this COUNT is not a
    // hard inventory guard — two truly simultaneous redemptions of the last slot
    // could both pass, an acceptable risk for a discount code. Any invalidity
    // throws COUPON_INVALID and rolls the reservation back (seats restored).
    let discountCents = 0;
    let appliedCode: string | null = null;
    if (couponCode) {
      const coupon = await tx.coupon.findUnique({ where: { code: couponCode } });
      if (!coupon) throw new ReserveError("COUPON_INVALID");
      const redemptions = await tx.booking.count({
        where: { couponCode: coupon.code, status: { notIn: ["FAILED", "CANCELLED"] } },
      });
      const outcome = evaluateCoupon({
        coupon,
        grossCents: breakdown.totalCents,
        currency: dep.tour.currency,
        redemptions,
      });
      if (!outcome.ok) throw new ReserveError("COUPON_INVALID");
      discountCents = outcome.discountCents;
      appliedCode = coupon.code;
    }
    const netCents = breakdown.totalCents - discountCents;

    // 3) Create the PENDING_PAYMENT booking with the authoritative NET total.
    //    `pricing` keeps the GROSS breakdown; the discount lives in its own
    //    columns so receipts can show a "gross − discount = net" line.
    const booking = await tx.booking.create({
      data: {
        userId,
        guestEmail,
        departureId,
        seats,
        totalCents: netCents,
        currency: dep.tour.currency,
        status: "PENDING_PAYMENT",
        contactInfo,
        pricing: breakdown as unknown as Prisma.InputJsonValue,
        originCountry,
        couponCode: appliedCode,
        discountCents,
      },
      select: { id: true },
    });

    return {
      bookingId: booking.id,
      seats,
      totalCents: netCents,
      currency: dep.tour.currency,
      pricing: breakdown,
      couponCode: appliedCode,
      discountCents,
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
