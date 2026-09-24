-- P4: per-passenger-type pricing + close-tour toggle + booking origin country.
-- Fully additive: every column is NULL or has a DEFAULT, so existing rows and
-- in-flight bookings keep working with no backfill. `basePriceCents` remains the
-- ADULT price; `childPriceCents`/`infantPriceCents` NULL means that passenger
-- type is not offered. `bookings.pricing` NULL marks legacy (pre-P4) bookings.

ALTER TABLE `tours`
  ADD COLUMN `childPriceCents` INTEGER NULL,
  ADD COLUMN `infantPriceCents` INTEGER NULL,
  ADD COLUMN `bookingClosed` BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE `bookings`
  ADD COLUMN `pricing` JSON NULL,
  ADD COLUMN `originCountry` CHAR(2) NULL;

CREATE INDEX `bookings_originCountry_idx` ON `bookings`(`originCountry`);
