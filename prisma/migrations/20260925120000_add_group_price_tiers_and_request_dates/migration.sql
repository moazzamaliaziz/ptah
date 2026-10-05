-- P8: price-per-person-by-group-size tiers + customer-chosen departure dates.
--
-- Additive except for one new UNIQUE index on `tour_departures(tourId,
-- startDate)`, which is what makes the customer-chosen-date path race-safe (the
-- reserve path upserts the departure for the picked date). Duplicate
-- (tour, start date) rows were always a data error; the cleanup below drops only
-- the ones that carry NO bookings, keeping the oldest row of each group. A
-- duplicate pair where BOTH rows have bookings cannot be resolved
-- automatically — the index creation will fail loudly in that case, which is
-- the correct outcome (a human has to merge those departures).

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

-- 3) Drop booking-free duplicate departures, keeping the oldest of each
--    (tourId, startDate) group, then make that pair unique.
DELETE `d` FROM `tour_departures` AS `d`
  JOIN (
    SELECT `tourId`, `startDate`, MIN(`createdAt`) AS `keepFrom`
    FROM `tour_departures`
    GROUP BY `tourId`, `startDate`
    HAVING COUNT(*) > 1
  ) AS `dupe`
    ON `dupe`.`tourId` = `d`.`tourId` AND `dupe`.`startDate` = `d`.`startDate`
  LEFT JOIN `bookings` AS `b` ON `b`.`departureId` = `d`.`id`
  WHERE `d`.`createdAt` > `dupe`.`keepFrom` AND `b`.`id` IS NULL;

-- The old non-unique index is subsumed by the new UNIQUE one.
DROP INDEX `tour_departures_tourId_startDate_idx` ON `tour_departures`;

CREATE UNIQUE INDEX `tour_departures_tourId_startDate_key`
  ON `tour_departures`(`tourId`, `startDate`);
