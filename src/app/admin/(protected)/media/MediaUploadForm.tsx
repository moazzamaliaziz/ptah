"use client";

import { useActionState, useRef, type JSX } from "react";
import { uploadMediaAction, type MediaUploadState } from "./actions";
import { MEDIA_FOLDERS } from "@/lib/media-shared";

/**
 * Library upload form. Posts a File to the `media.manage`-gated Server Action;
 * surfaces validation errors (bad MIME, oversize, spoofed content) inline. On
 * success the page revalidates and the new thumbnail appears in the grid.
 */
export default function MediaUploadForm(): JSX.Element {
  const [state, formAction, pending] = useActionState<MediaUploadState, FormData>(
    uploadMediaAction,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (fd) => {
        await formAction(fd);
        formRef.current?.reset();
      }}
      className="admin-card"
      style={{ marginBottom: "1.5rem" }}
    >
      <h2>Upload image</h2>
      {state.error ? (
        <div className="admin-alert admin-alert--error" role="alert">
          {state.error}
        </div>
      ) : null}
      {state.ok ? (
        <div className="admin-alert admin-alert--ok" role="status">
          {state.deduped
            ? "That image already existed — reused the existing asset."
            : "Uploaded."}
        </div>
      ) : null}

      <label className="admin-field">
        <span>Image file</span>
        <input
          className="admin-input"
          type="file"
          name="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/x-icon,image/avif,image/bmp,image/tiff"
          required
        />
      </label>

      <div className="admin-row" style={{ gap: "1rem", alignItems: "flex-end" }}>
        <label className="admin-field" style={{ flex: "1 1 160px", marginBottom: 0 }}>
          <span>Folder</span>
          <select className="admin-input" name="folder" defaultValue="general">
            {MEDIA_FOLDERS.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>
        <label className="admin-field" style={{ flex: "3 1 240px", marginBottom: 0 }}>
          <span>Alt text (optional)</span>
          <input className="admin-input" type="text" name="altText" maxLength={512} placeholder="Describe the image for screen readers" />
        </label>
      </div>

      <div className="admin-row" style={{ marginTop: "0.9rem" }}>
        <button className="admin-btn" type="submit" disabled={pending}>
          {pending ? "Uploading…" : "Upload"}
        </button>
        <span className="admin-card__meta">
          JPEG, PNG, WebP, GIF, SVG, ICO, AVIF, BMP, TIFF — max 4 MB (512 KB for SVG). TIFF is auto-converted to WebP; iPhone HEIC isn’t supported (save as JPEG).
        </span>
      </div>
    </form>
  );
}
