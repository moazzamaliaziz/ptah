-- Add a sliding "last activity" timestamp to sessions for the idle-timeout
-- enforcement (src/server/auth/session.ts). Nullable so existing rows need no
-- backfill; getSessionUser() falls back to createdAt when it is null.
-- AlterTable
ALTER TABLE `sessions` ADD COLUMN `lastSeenAt` DATETIME(3) NULL;
