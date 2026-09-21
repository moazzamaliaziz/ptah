/**
 * Account-backed wishlist (Phase 4). The public/guest store is the localStorage
 * adapter in src/lib/wishlist.ts, keyed by tour SLUG. This server module is the
 * account-synced counterpart: on login the guest slugs are merged into the
 * user's `Wishlist` rows so a wishlist follows the account across devices.
 *
 * Slug is the boundary identifier (the client never handles the tour UUID); the
 * DB stores the tour's id FK. Every write resolves slug → published-tour id and
 * silently ignores slugs that don't map to a real tour (a tampered or stale
 * localStorage list can never create junk rows or FK errors).
 */
import "server-only";
import { db } from "@/lib/db";

export interface WishlistTour {
  slug: string;
  title: string;
  summary: string;
  heroImage: string | null;
  durationDays: number;
  fromPriceCents: number;
  currency: string;
}

/** Slugs currently on the account wishlist (for hydrating client state). */
export async function listWishlistSlugs(userId: string): Promise<string[]> {
  const rows = await db.wishlist.findMany({
    where: { userId },
    select: { tour: { select: { slug: true } } },
  });
  return rows.map((r) => r.tour.slug);
}

/** Wishlisted PUBLISHED tours as view-models for the account page. */
export async function listWishlistTours(userId: string): Promise<WishlistTour[]> {
  const rows = await db.wishlist.findMany({
    where: { userId, tour: { status: "PUBLISHED" } },
    orderBy: { createdAt: "desc" },
    select: {
      tour: {
        select: {
          slug: true,
          title: true,
          summary: true,
          heroImage: true,
          durationDays: true,
          basePriceCents: true,
          currency: true,
          departures: {
            where: { status: "OPEN" },
            select: { priceOverrideCents: true },
          },
        },
      },
    },
  });

  return rows.map(({ tour }) => {
    const overrides = tour.departures
      .map((d) => d.priceOverrideCents)
      .filter((c): c is number => c !== null);
    const fromPriceCents = Math.min(tour.basePriceCents, ...overrides);
    return {
      slug: tour.slug,
      title: tour.title,
      summary: tour.summary,
      heroImage: tour.heroImage,
      durationDays: tour.durationDays,
      fromPriceCents: Number.isFinite(fromPriceCents) ? fromPriceCents : tour.basePriceCents,
      currency: tour.currency,
    };
  });
}

/** Resolve a tour slug to its id, or null if no such tour. */
async function tourIdForSlug(slug: string): Promise<string | null> {
  const tour = await db.tour.findUnique({ where: { slug }, select: { id: true } });
  return tour?.id ?? null;
}

/**
 * Add or remove one tour (by slug) from the account wishlist. Returns the new
 * membership state (true = on the wishlist). A slug that maps to no tour is a
 * no-op returning false.
 */
export async function setWishlist(userId: string, slug: string, on: boolean): Promise<boolean> {
  const tourId = await tourIdForSlug(slug);
  if (!tourId) return false;

  if (on) {
    // Idempotent add — unique (userId, tourId) makes a repeat a no-op.
    await db.wishlist.upsert({
      where: { userId_tourId: { userId, tourId } },
      update: {},
      create: { userId, tourId },
    });
    return true;
  }
  await db.wishlist.deleteMany({ where: { userId, tourId } });
  return false;
}

/**
 * Merge a guest's localStorage slugs into the account wishlist (union). Called
 * once on login. Only slugs that map to a real tour are inserted; duplicates are
 * skipped. Returns how many NEW rows were added.
 */
export async function mergeGuestWishlist(userId: string, slugs: string[]): Promise<number> {
  const unique = [...new Set(slugs.map((s) => s.trim()).filter(Boolean))];
  if (unique.length === 0) return 0;

  const tours = await db.tour.findMany({
    where: { slug: { in: unique } },
    select: { id: true },
  });
  if (tours.length === 0) return 0;

  const result = await db.wishlist.createMany({
    data: tours.map((t) => ({ userId, tourId: t.id })),
    skipDuplicates: true,
  });
  return result.count;
}
