"use server";

/**
 * Shared Server Actions backing the reusable <MediaPicker> (Phase 7 — Subsystem
 * 1). Kept separate from the /admin/media route actions so the picker can be
 * embedded by any admin editor (tours, destinations, branding, widgets) without
 * cross-route import coupling.
 *
 * Both actions re-check their capability server-side (UI hiding is not a
 * boundary): listing needs `media.view`, uploading needs `media.manage`.
 */
import { requireCapability } from "@/server/auth/rbac";
import { listMedia, createMedia, type MediaSummary, MEDIA_FOLDERS } from "@/server/media";
import { writeAudit } from "@/server/audit";

/** Return library summaries for the picker grid (metadata only, no bytes). */
export async function pickerListMediaAction(folder?: string): Promise<MediaSummary[]> {
  await requireCapability("media.view");
  return listMedia(folder);
}

export type PickerUploadState = {
  ok?: boolean;
  error?: string;
  asset?: MediaSummary;
};

/** Upload from inside the picker modal; returns the created/deduped asset. */
export async function pickerUploadMediaAction(
  _prev: PickerUploadState,
  formData: FormData,
): Promise<PickerUploadState> {
  const user = await requireCapability("media.manage");

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose an image file to upload." };
  }
  const folderRaw = String(formData.get("folder") ?? "general");
  const folder = (MEDIA_FOLDERS as readonly string[]).includes(folderRaw) ? folderRaw : "general";

  const bytes = Buffer.from(await file.arrayBuffer());
  const result = await createMedia({
    filename: file.name || "upload",
    declaredMime: file.type || "application/octet-stream",
    bytes,
    folder,
  });
  if (!result.ok) return { error: result.error };

  await writeAudit({
    actorId: user.id,
    action: result.deduped ? "media.dedupe" : "media.upload",
    entity: "media_asset",
    entityId: result.asset.id,
    meta: { mimeType: result.asset.mimeType, byteSize: result.asset.byteSize, folder: result.asset.folder, via: "picker" },
  });

  return { ok: true, asset: result.asset };
}
