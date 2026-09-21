/**
 * Client-safe media domain constants + types (Phase 7 — Subsystem 1).
 *
 * These are shared by both the `server-only` media service (src/server/media.ts)
 * and client components (MediaUploadForm, MediaPicker). They live here — NOT in
 * media.ts — because media.ts imports `server-only` + the DB client; importing a
 * *value* from it into a client component (e.g. MEDIA_FOLDERS in a "use client"
 * form) drags mariadb into the browser bundle and fails the build. Types alone
 * are erased, but the constant must resolve at runtime on the client too.
 *
 * Pure: no server-only / DB / Next imports.
 */

/** Coarse library groupings for the filter UI + upload tagging. */
export const MEDIA_FOLDERS = ["general", "tours", "destinations", "branding", "favicon"] as const;
export type MediaFolder = (typeof MEDIA_FOLDERS)[number];

/** Metadata-only view of a library asset (never carries blob bytes). */
export interface MediaSummary {
  id: string;
  filename: string;
  mimeType: string;
  byteSize: number;
  width: number | null;
  height: number | null;
  altText: string | null;
  folder: string;
  createdAt: Date;
}

/** True when `value` is one of the known library folders. */
export function isMediaFolder(value: string): value is MediaFolder {
  return (MEDIA_FOLDERS as readonly string[]).includes(value);
}
