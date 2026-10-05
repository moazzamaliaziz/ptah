-- P8: price-per-person-by-group-size tiers + customer-chosen departure dates.
--
-- Purely additive. Nothing in this migration deletes or rewrites a row: the
-- only pre-existing object it touches is a redundant index, and that only after
-- its replacement exists.
--
-- If the UNIQUE index at the end fails, the database has duplicate
-- (tourId, startDate) departures. That was always a data error — nothing in the
-- app creates them — and it is NOT resolved here, because a build-time
-- migration is the wrong place to delete production rows. Find them with:
--
--   SELECT tourId, startDate, COUNT(*) c, GROUP_CONCAT(id) ids
--   FROM tour_departures GROUP BY tourId, startDate HAVING c > 1;
--
-- then merge each group by hand (move any bookings onto the row you keep, then
-- delete the others) and re-run the deploy.

-- 1) Group-size pricing tiers. `maxPax` NULL = "and above" (the open-ended top
--    band). Non-overlap is enforced at the admin boundary, not here.
CREATE TABLE `tour_price_tiers` (
  `id` CHAR(36) NOT NULL,
  `tourId` CHAR(36) NOT NULL,
  `minPax` INTEGER NOT NULL,
  `maxPax` INTEGER NULL,
  `pricePerPersonCents` INTEGER NOT NULL,
  `sortOrder` INTEGER NOT NULL DEFAULT 0,

  UNIQUE INDEX `tour_price_tiers_tourId_minPax_key`(`tourId`, `minPax`),
  INDEX `tour_price_tiers_tourId_sortOrder_idx`(`tourId`, `sortOrder`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `tour_price_tiers`
  ADD CONSTRAINT `tour_price_tiers_tourId_fkey`
  FOREIGN KEY (`tourId`) REFERENCES `tours`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- 2) Per-tour settings for the customer-chosen-date calendar. Defaults keep
--    every existing tour working: dates on request, 2 days' notice, a one-year
--    window, 20 seats per auto-created departure, no blackouts.
ALTER TABLE `tours`
  ADD COLUMN `onRequestDates` BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN `requestLeadDays` INTEGER NOT NULL DEFAULT 2,
  ADD COLUMN `requestWindowDays` INTEGER NOT NULL DEFAULT 365,
  ADD COLUMN `requestCapacity` INTEGER NOT NULL DEFAULT 20,
  ADD COLUMN `blackoutDates` JSON NULL;

-- 3) One departure per tour per start date. This is what makes the
--    customer-chosen-date path race-safe: concurrent first-bookings of the same
--    date both reach `upsert`, one creates and the other reads, so a date can
--    never end up with two independent capacity pools.
--
--    ORDER MATTERS. `tour_departures.tourId` carries a foreign key to
--    `tours.id`, and MySQL/TiDB require that FK to be backed by an index whose
--    leftmost column is `tourId`. Today that is the non-unique
--    (tourId, startDate) index. Dropping it before its replacement exists
--    fails with errno 1553 ("needed in a foreign key constraint"), so the new
--    UNIQUE index — which satisfies the FK just as well — is created FIRST and
--    the now-redundant non-unique index is dropped only afterwards.
CREATE UNIQUE INDEX `tour_departures_tourId_startDate_key`
  ON `tour_departures`(`tourId`, `startDate`);

DROP INDEX `tour_departures_tourId_startDate_idx` ON `tour_departures`;
