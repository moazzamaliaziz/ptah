-- CreateTable
CREATE TABLE `events` (
    `id` CHAR(36) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `summary` VARCHAR(512) NOT NULL,
    `description` TEXT NOT NULL,
    `location` VARCHAR(200) NULL,
    `startDate` DATE NOT NULL,
    `endDate` DATE NULL,
    `recurring` BOOLEAN NOT NULL DEFAULT false,
    `heroImage` VARCHAR(512) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `metaTitle` VARCHAR(255) NULL,
    `metaDesc` VARCHAR(320) NULL,
    `ogImage` VARCHAR(512) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `events_slug_key`(`slug`),
    INDEX `events_status_startDate_idx`(`status`, `startDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trip_ideas` (
    `id` CHAR(36) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `summary` VARCHAR(512) NOT NULL,
    `descriptionLong` TEXT NOT NULL,
    `heroImage` VARCHAR(512) NULL,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `metaTitle` VARCHAR(255) NULL,
    `metaDesc` VARCHAR(320) NULL,
    `ogImage` VARCHAR(512) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `trip_ideas_slug_key`(`slug`),
    INDEX `trip_ideas_status_sortOrder_idx`(`status`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `trip_idea_tours` (
    `tripIdeaId` CHAR(36) NOT NULL,
    `tourId` CHAR(36) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,

    INDEX `trip_idea_tours_tourId_idx`(`tourId`),
    PRIMARY KEY (`tripIdeaId`, `tourId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `trip_idea_tours` ADD CONSTRAINT `trip_idea_tours_tripIdeaId_fkey` FOREIGN KEY (`tripIdeaId`) REFERENCES `trip_ideas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `trip_idea_tours` ADD CONSTRAINT `trip_idea_tours_tourId_fkey` FOREIGN KEY (`tourId`) REFERENCES `tours`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
