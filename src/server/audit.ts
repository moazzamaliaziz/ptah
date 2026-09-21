/**
 * Append-only admin audit trail (Phase 2, schema `AuditLog`).
 *
 * Every admin mutation calls `writeAudit` with the acting staff user, a dotted
 * action (`toggle.update`, `integration.toggle`, `content.update`, …), the
 * entity + id, and optional structured meta. Never store secret VALUES in meta
 * — record that a field changed, not what it changed to.
 *
 * A failed audit write must not roll back or hide the mutation it records, so
 * failures are logged and swallowed (best-effort trail); the actorId is
 * SetNull on staff deletion so history survives.
 */
import "server-only";
import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

export interface AuditEntry {
  actorId: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  meta?: Prisma.InputJsonValue;
}

export async function writeAudit(entry: AuditEntry): Promise<void> {
  try {
    await db.auditLog.create({
      data: {
        actorId: entry.actorId,
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId ?? null,
        ...(entry.meta !== undefined ? { meta: entry.meta } : {}),
      },
    });
  } catch (error) {
    logger.error("audit write failed", { action: entry.action, entity: entry.entity, error });
  }
}
