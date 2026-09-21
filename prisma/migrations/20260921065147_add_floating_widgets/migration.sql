-- CreateTable
CREATE TABLE `floating_widgets` (
    `id` CHAR(36) NOT NULL,
    `type` ENUM('PHONE', 'WHATSAPP', 'TRIPADVISOR', 'EMAIL', 'MESSENGER', 'CUSTOM') NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `label` VARCHAR(120) NOT NULL,
    `href` VARCHAR(512) NOT NULL,
    `iconKey` VARCHAR(40) NOT NULL,
    `bgColor` VARCHAR(32) NULL,
    `showDesktop` BOOLEAN NOT NULL DEFAULT true,
    `showMobile` BOOLEAN NOT NULL DEFAULT true,
    `position` VARCHAR(20) NOT NULL DEFAULT 'bottom-right',
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `floating_widgets_enabled_sortOrder_idx`(`enabled`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
