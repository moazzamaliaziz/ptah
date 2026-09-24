-- P5: checkout discount coupons.
-- Fully additive: the new `coupons` table is standalone, and the two new
-- `bookings` columns are NULL (`couponCode`) or DEFAULT 0 (`discountCents`), so
-- existing rows and in-flight bookings keep working with no backfill. The
-- redemption cap is enforced by COUNTing live bookings that carry the code
-- (bookings.couponCode), never a mutable counter — hence the composite index.
-- `bookings.discountCents` is subtracted from the GROSS price to reach
-- `totalCents`; `bookings.pricing` still holds the unchanged GROSS breakdown.

-- CreateTable
CREATE TABLE `coupons` (
    `id` CHAR(36) NOT NULL,
    `code` VARCHAR(40) NOT NULL,
    `type` ENUM('PERCENT', 'FIXED') NOT NULL,
    `value` INTEGER NOT NULL,
    `currency` CHAR(3) NULL,
    `minSpendCents` INTEGER NULL,
    `maxRedemptions` INTEGER NULL,
    `startsAt` DATETIME(3) NULL,
    `endsAt` DATETIME(3) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `coupons_code_key`(`code`),
    INDEX `coupons_active_idx`(`active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable: freeze the applied discount onto each booking.
ALTER TABLE `bookings`
  ADD COLUMN `couponCode` VARCHAR(40) NULL,
  ADD COLUMN `discountCents` INTEGER NOT NULL DEFAULT 0;

-- Powers the live redemption count that enforces maxRedemptions.
CREATE INDEX `bookings_couponCode_status_idx` ON `bookings`(`couponCode`, `status`);
