-- AlterTable
ALTER TABLE `tours` ADD COLUMN `ctaHref` VARCHAR(512) NULL,
    ADD COLUMN `ctaLabel` VARCHAR(120) NULL,
    ADD COLUMN `faqs` JSON NULL,
    ADD COLUMN `travelNotes` JSON NULL;
