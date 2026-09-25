"use client";

/**
 * Supplies the localized MediaPicker chrome strings (buttons, dialog, hints) to
 * the shared <MediaPicker> island without threading a prop through all five
 * editor forms that embed it. The protected admin layout — a server component
 * that already knows the locale — mounts <MediaPickerLabelsProvider> once with
 * the resolved dictionary; MediaPicker reads it via useMediaPickerLabels().
 *
 * The context defaults to English (mediaPickerEn) so the picker still renders
 * sensibly if ever used outside the provider. MediaPickerDict is all strings,
 * so it crosses the server→client prop boundary as plain data.
 */
import { createContext, useContext, type JSX, type ReactNode } from "react";
import { mediaPickerEn, type MediaPickerDict } from "@/i18n/admin/dictionaries/media";

const MediaPickerLabelsContext = createContext<MediaPickerDict>(mediaPickerEn);

export function MediaPickerLabelsProvider({
  labels,
  children,
}: {
  labels: MediaPickerDict;
  children: ReactNode;
}): JSX.Element {
  return (
    <MediaPickerLabelsContext.Provider value={labels}>
      {children}
    </MediaPickerLabelsContext.Provider>
  );
}

/** MediaPicker chrome strings for the active admin locale (English fallback). */
export function useMediaPickerLabels(): MediaPickerDict {
  return useContext(MediaPickerLabelsContext);
}
