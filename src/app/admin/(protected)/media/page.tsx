import type { JSX } from "react";
import { requireCapability, can } from "@/server/auth/rbac";
import { listMedia, MEDIA_FOLDERS } from "@/server/media";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";
import MediaUploadForm from "./MediaUploadForm";
import { updateAltTextAction, deleteMediaAction } from "./actions";
import SubmitButton from "@/components/admin/SubmitButton";

export const dynamic = "force-dynamic";

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

/**
 * WordPress-style media library. `media.view` to see, `media.manage` to upload,
 * rename, or delete. Thumbnails load from the cached /api/media/<id> route.
 */
export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ folder?: string }>;
}): Promise<JSX.Element> {
  const user = await requireCapability("media.view");
  const manage = can(user, "media.manage");

  const { folder } = await searchParams;
  const activeFolder =
    folder && (MEDIA_FOLDERS as readonly string[]).includes(folder) ? folder : undefined;
  const assets = await listMedia(activeFolder);

  const dict = getAdminDict(await getAdminLocale());
  const t = dict.media;

  return (
    <>
      <div className="admin-head">
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </div>

      {!manage ? (
        <div className="admin-alert admin-alert--ok" role="status">
          {t.viewOnlyNote}
        </div>
      ) : null}

      {manage ? <MediaUploadForm labels={t.upload} /> : null}

      <div className="admin-row" style={{ marginBottom: "1rem", gap: "0.4rem" }}>
        <a className={`admin-badge ${!activeFolder ? "admin-badge--gold" : "admin-badge--off"}`} href="/admin/media" style={{ textDecoration: "none" }}>
          {t.folderAll}
        </a>
        {MEDIA_FOLDERS.map((f) => (
          <a
            key={f}
            className={`admin-badge ${activeFolder === f ? "admin-badge--gold" : "admin-badge--off"}`}
            href={`/admin/media?folder=${f}`}
            style={{ textDecoration: "none" }}
          >
            {f}
          </a>
        ))}
      </div>

      {assets.length === 0 ? (
        <div className="admin-card">
          <p className="admin-card__meta" style={{ margin: 0 }}>
            {activeFolder ? t.noImagesInFolder(activeFolder) : t.noImages}
          </p>
        </div>
      ) : (
        <div className="admin-grid">
          {assets.map((a) => (
            <div className="admin-card" key={a.id}>
              <div
                style={{
                  background: "repeating-conic-gradient(rgba(26,35,64,0.06) 0% 25%, #fff 0% 50%) 50% / 16px 16px",
                  borderRadius: 8,
                  aspectRatio: "4 / 3",
                  display: "grid",
                  placeItems: "center",
                  overflow: "hidden",
                  marginBottom: "0.6rem",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail: intrinsic size unknown, next/image adds no value in tooling. */}
                <img
                  src={`/api/media/${a.id}`}
                  alt={a.altText ?? a.filename}
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                />
              </div>
              <div style={{ fontSize: "0.82rem", fontWeight: 600, wordBreak: "break-all" }}>{a.filename}</div>
              <div className="admin-card__meta">
                {a.mimeType} · {formatBytes(a.byteSize)}
                {a.width && a.height ? ` · ${a.width}×${a.height}` : ""} · {a.folder}
              </div>

              {manage ? (
                <>
                  <form action={updateAltTextAction} style={{ marginTop: "0.6rem" }}>
                    <input type="hidden" name="id" value={a.id} />
                    <label className="admin-field" style={{ marginBottom: "0.4rem" }}>
                      <span>{t.altText}</span>
                      <input className="admin-input" type="text" name="altText" defaultValue={a.altText ?? ""} maxLength={512} />
                    </label>
                    <SubmitButton className="admin-btn admin-btn--ghost" pendingLabel={dict.common.saving}>{t.saveAlt}</SubmitButton>
                  </form>
                  <form action={deleteMediaAction} style={{ marginTop: "0.5rem" }}>
                    <input type="hidden" name="id" value={a.id} />
                    <SubmitButton className="admin-btn admin-btn--danger" pendingLabel={dict.common.deleting}>{dict.common.delete}</SubmitButton>
                  </form>
                </>
              ) : (
                <div className="admin-card__meta" style={{ marginTop: "0.5rem" }}>{a.altText ?? t.noAltText}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
