-- CreateTable
CREATE TABLE `translations` (
    `id` CHAR(36) NOT NULL,
    `model` VARCHAR(48) NOT NULL,
    `recordId` VARCHAR(191) NOT NULL,
    `locale` VARCHAR(5) NOT NULL,
    `field` VARCHAR(48) NOT NULL,
    `value` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `translations_model_recordId_locale_idx`(`model`, `recordId`, `locale`),
    UNIQUE INDEX `translations_model_recordId_locale_field_key`(`model`, `recordId`, `locale`, `field`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
