"use server";

import { revalidatePath } from "next/cache";
import { requireCapability } from "@/server/auth/rbac";
import {
  createMedia,
  updateMediaAltText,
  deleteMedia,
  MEDIA_FOLDERS,
} from "@/server/media";
import { writeAudit } from "@/server/audit";

/** useActionState shape for the upload form. `asset` lets a picker consume the result. */
export type MediaUploadState = {
  ok?: boolean;
  error?: string;
  assetId?: string;
  deduped?: boolean;
};

/**
 * Upload one image into the library. Re-checks `media.manage` server-side (a
 * forged POST from a lower role is rejected here). Validation, magic-byte sniff,
 * size cap and SVG sanitization all live in the service/validator — this action
 * only marshals the File → Buffer and records the audit entry (field names, not
 * bytes).
 */
export async function uploadMediaAction(
  _prev: MediaUploadState,
  formData: FormData,
): Promise<MediaUploadState> {
  const user = await requireCapability("media.manage");

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image file to upload." };
  }

  const folderRaw = String(formData.get("folder") ?? "general");
  const folder = (MEDIA_FOLDERS as readonly string[]).includes(folderRaw) ? folderRaw : "general";
  const altText = String(formData.get("altText") ?? "");

  const bytes = Buffer.from(await file.arrayBuffer());
  const result = await createMedia({
    filename: file.name || "upload",
    declaredMime: file.type || "application/octet-stream",
    bytes,
    folder,
    altText,
  });
  if (!result.ok) return { error: result.error };

  await writeAudit({
    actorId: user.id,
    action: result.deduped ? "media.dedupe" : "media.upload",
    entity: "media_asset",
    entityId: result.asset.id,
    // Field names + non-sensitive metadata only — never the bytes.
    meta: { mimeType: result.asset.mimeType, byteSize: result.asset.byteSize, folder: result.asset.folder },
  });

  revalidatePath("/admin/media");
  return { ok: true, assetId: result.asset.id, deduped: result.deduped };
}

/** Edit an asset's alt text (accessibility metadata). */
export async function updateAltTextAction(formData: FormData): Promise<void> {
  const user = await requireCapability("media.manage");
  const id = String(formData.get("id") ?? "");
  const altText = String(formData.get("altText") ?? "");
  if (!id) return;

  await updateMediaAltText(id, altText);
  await writeAudit({ actorId: user.id, action: "media.altText", entity: "media_asset", entityId: id });
  revalidatePath("/admin/media");
}

/** Hard-delete an asset (blob cascades). */
export async function deleteMediaAction(formData: FormData): Promise<void> {
  const user = await requireCapability("media.manage");
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await deleteMedia(id);
  await writeAudit({ actorId: user.id, action: "media.delete", entity: "media_asset", entityId: id });
  revalidatePath("/admin/media");
}
