/**
 * Contact-form service (server-only). Persist-FIRST: the submission is written
 * to `contact_messages` (the source of truth) so an enquiry is never lost, then
 * an admin notification email is sent best-effort on top (a no-op when no email
 * provider is configured — see mailer.ts). The public action calls
 * submitContactMessage; the admin inbox uses the list/read/status/delete fns.
 */
import "server-only";
import { cache } from "react";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { sha256Hex } from "@/lib/crypto";
import { sendEmail } from "@/server/email/mailer";
import { getSetting } from "@/server/settings";
import { contactMessageEmail } from "@/server/email/templates";
import type { ContactInput } from "@/content/contact-schema";

export interface SubmitContext {
  ip: string;
  userAgent: string | null;
}

/**
 * Persist a contact submission and fire the admin notification. Returns the new
 * id. Throws only on a DB failure (the action maps that to a friendly error);
 * an email failure is swallowed (already persisted, admin can read the inbox).
 */
export async function submitContactMessage(input: ContactInput, ctx: SubmitContext): Promise<string> {
  const created = await db.contactMessage.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      subject: input.subject,
      message: input.message,
      ipHash: ctx.ip && ctx.ip !== "unknown" ? sha256Hex(ctx.ip) : null,
      userAgent: ctx.userAgent?.slice(0, 512) ?? null,
    },
    select: { id: true },
  });

  // Best-effort admin notification. Never blocks or fails the submission.
  try {
    const adminEmail = (await getSetting("contact.email")) || "hello@ptahtours.com";
    const mail = contactMessageEmail({
      name: input.name,
      email: input.email,
      phone: input.phone,
      subject: input.subject,
      message: input.message,
    });
    const result = await sendEmail({ to: adminEmail, replyTo: input.email, ...mail });
    if (!result.ok) {
      logger.info("contact: admin email not sent", { reason: result.reason, id: created.id });
    }
  } catch (error) {
    logger.error("contact: admin email threw", { id: created.id, error });
  }

  return created.id;
}

// ── Admin inbox reads/writes ──────────────────────────────────────────────────

export interface ContactRow {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  status: string;
  createdAt: Date;
}

export interface ContactDetail extends ContactRow {
  phone: string | null;
  message: string;
  userAgent: string | null;
  updatedAt: Date;
}

/** Newest first; NEW messages surface at the top regardless via the status sort. */
export async function listContactMessages(): Promise<ContactRow[]> {
  return db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, subject: true, status: true, createdAt: true },
  });
}

/**
 * Count of unread (NEW) messages — for the admin nav badge.
 *
 * Memoized per request because the protected layout (nav badge) and the
 * dashboard (alert banner) both want it, which was the same COUNT twice in one
 * render.
 */
export const countNewContactMessages: () => Promise<number> = cache(
  async (): Promise<number> => db.contactMessage.count({ where: { status: "NEW" } }),
);

export async function getContactMessage(id: string): Promise<ContactDetail | null> {
  return db.contactMessage.findUnique({
    where: { id },
    select: {
      id: true, name: true, email: true, phone: true, subject: true, message: true,
      status: true, userAgent: true, createdAt: true, updatedAt: true,
    },
  });
}

const CONTACT_STATUSES = new Set(["NEW", "READ", "ARCHIVED"]);

export async function setContactStatus(id: string, status: string): Promise<boolean> {
  if (!CONTACT_STATUSES.has(status)) return false;
  const found = await db.contactMessage.findUnique({ where: { id }, select: { id: true } });
  if (!found) return false;
  await db.contactMessage.update({
    where: { id },
    data: { status: status as "NEW" | "READ" | "ARCHIVED" },
  });
  return true;
}

/** Mark a NEW message READ when opened (idempotent; leaves READ/ARCHIVED alone). */
export async function markContactRead(id: string): Promise<void> {
  await db.contactMessage.updateMany({
    where: { id, status: "NEW" },
    data: { status: "READ" },
  });
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  const found = await db.contactMessage.findUnique({ where: { id }, select: { id: true } });
  if (!found) return false;
  await db.contactMessage.delete({ where: { id } });
  return true;
}
