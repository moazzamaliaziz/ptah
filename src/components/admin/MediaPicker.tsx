"use client";

import { useEffect, useState, useTransition, type JSX } from "react";
import { pickerListMediaAction, pickerUploadMediaAction } from "./media-picker-actions";
import type { MediaSummary } from "@/lib/media-shared";

export interface MediaPickerProps {
  /** Form field name — the chosen value posts under this key. */
  name: string;
  /**
   * What the hidden field posts:
   *   "id"  (default) — the MediaAsset id (branding/widgets store an id).
   *   "url"           — a servable URL "/api/media/<id>" (tours/destinations
   *                     store a path string; also lets the editor keep a legacy
   *                     /assets path or paste an external https URL).
   */
  emit?: "id" | "url";
  /** id mode: currently-selected media id (edit forms). */
  defaultMediaId?: string | null;
  /** url mode: current URL value (may be a legacy /assets path or https URL). */
  initialUrl?: string | null;
  /** Pre-select this library folder in the picker + tag uploads with it. */
  folder?: string;
  /** Field label shown above the control. */
  label: string;
}

/**
 * Reusable "select or upload" image control (Phase 7 keystone). Renders a hidden
 * input holding the chosen value (so it participates in the parent form) plus a
 * preview thumbnail and a modal to pick from the library or upload a new image.
 * Reused by tours, destinations, branding, and widgets.
 *
 * Empty selection posts "" — the server treats that as "clear / use default".
 */
export default function MediaPicker({
  name,
  emit = "id",
  defaultMediaId,
  initialUrl,
  folder,
  label,
}: MediaPickerProps): JSX.Element {
  const isUrl = emit === "url";
  const [value, setValue] = useState<string>(
    (isUrl ? initialUrl : defaultMediaId) ?? "",
  );
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<MediaSummary[]>([]);
  const [loading, startLoading] = useTransition();
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, startUploading] = useTransition();

  // The servable src for the preview: url mode uses the value verbatim; id mode
  // resolves the id through the media route.
  const previewSrc = value ? (isUrl ? value : `/api/media/${value}`) : null;
  const emitFor = (assetId: string): string => (isUrl ? `/api/media/${assetId}` : assetId);

  // Load the library whenever the modal opens.
  useEffect(() => {
    if (!open) return;
    startLoading(async () => {
      const list = await pickerListMediaAction(folder);
      setAssets(list);
    });
  }, [open, folder]);

  /**
   * Upload inside the transition and act on the result at the call site — no
   * effect mirroring action state (avoids cascading-render setState-in-effect).
   */
  function handleUpload(file: File): void {
    setUploadError(null);
    const fd = new FormData();
    fd.set("file", file);
    fd.set("folder", folder ?? "general");
    startUploading(async () => {
      const result = await pickerUploadMediaAction({}, fd);
      if (!result.ok || !result.asset) {
        setUploadError(result.error ?? "Upload failed.");
        return;
      }
      const asset = result.asset;
      setValue(emitFor(asset.id));
      setAssets((prev) => (prev.some((a) => a.id === asset.id) ? prev : [asset, ...prev]));
    });
  }

  return (
    <div className="admin-field">
      <span>{label}</span>
      <input type="hidden" name={name} value={value} />

      <div className="admin-row" style={{ gap: "0.75rem" }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 8,
            border: "1px solid rgba(26,35,64,0.2)",
            background: "repeating-conic-gradient(rgba(26,35,64,0.06) 0% 25%, #fff 0% 50%) 50% / 12px 12px",
            display: "grid",
            placeItems: "center",
            overflow: "hidden",
            flex: "0 0 auto",
          }}
        >
          {previewSrc ? (
            // eslint-disable-next-line @next/next/no-img-element -- admin preview thumbnail.
            <img src={previewSrc} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
          ) : (
            <span className="admin-card__meta" style={{ fontSize: "0.7rem" }}>None</span>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", flex: 1 }}>
          <div className="admin-row" style={{ gap: "0.4rem" }}>
            <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setOpen(true)}>
              {value ? "Change" : "Select"}
            </button>
            {value ? (
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setValue("")}>
                Clear
              </button>
            ) : null}
          </div>
          {isUrl ? (
            // Editable path — keeps legacy /assets paths and allows external https URLs.
            <input
              className="admin-input"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="/assets/… or https://… or pick from library"
              aria-label={`${label} path`}
              style={{ fontSize: "0.8rem" }}
            />
          ) : null}
        </div>
      </div>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Select image — ${label}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,48,0.55)",
            display: "grid",
            placeItems: "center",
            padding: "1rem",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "1.25rem",
              width: "min(760px, 100%)",
              maxHeight: "85vh",
              overflow: "auto",
              color: "var(--color-ink, #262626)",
            }}
          >
            <div className="admin-row admin-row--between" style={{ marginBottom: "1rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Select image</h2>
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setOpen(false)}>Close</button>
            </div>

            {/* Upload — nested action; not a nested <form> (this modal renders inside the parent editor form). */}
            {uploadError ? (
              <div className="admin-alert admin-alert--error" role="alert">{uploadError}</div>
            ) : null}
            <div className="admin-card" style={{ marginBottom: "1rem" }}>
              <div className="admin-row" style={{ gap: "0.6rem", alignItems: "flex-end" }}>
                <label className="admin-field" style={{ flex: 1, marginBottom: 0 }}>
                  <span>Upload new</span>
                  <input
                    className="admin-input"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/x-icon"
                    disabled={uploading}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      handleUpload(f);
                      e.target.value = "";
                    }}
                  />
                </label>
                {uploading ? <span className="admin-card__meta">Uploading…</span> : null}
              </div>
            </div>

            {loading ? (
              <p className="admin-card__meta">Loading library…</p>
            ) : assets.length === 0 ? (
              <p className="admin-card__meta">No images yet — upload one above.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "0.6rem" }}>
                {assets.map((a) => {
                  const isSel = emitFor(a.id) === value;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => {
                        setValue(emitFor(a.id));
                        setOpen(false);
                      }}
                      title={a.filename}
                      style={{
                        padding: 4,
                        borderRadius: 8,
                        border: isSel ? "2px solid var(--color-gold, #d9822b)" : "1px solid rgba(26,35,64,0.15)",
                        background: "#fff",
                        cursor: "pointer",
                        aspectRatio: "1 / 1",
                        overflow: "hidden",
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- admin picker thumbnail. */}
                      <img src={`/api/media/${a.id}`} alt={a.altText ?? a.filename} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
