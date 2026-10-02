/**
 * Localized image alt/caption overlay (inventory §H, P2).
 *
 * The media source modules (`src/content/gallery.ts`, `theme-media.ts`,
 * `city-media.ts`) carry English `alt` (and, for theme/city media, `caption`).
 * They render English in every locale. This overlay layers a translated
 * {alt, caption?} on top, keyed by each image's public `src` PATH — not its
 * slug, because theme/city slugs are not globally unique and gallery photos
 * have no slug; `src` is the only globally unique key.
 *
 * Mirrors the getDictionary idiom: a per-locale map of dynamic imports with an
 * English fallback, so each locale's overlay is code-split and only loaded on
 * the server (these loaders run in server components; the full 158-entry map is
 * never shipped to the client). English resolves to an empty overlay — every
 * lookup then falls through to the image's own English fields. A missing or
 * mistyped key likewise falls through, so a partial overlay can never break
 * rendering; it only means that one image shows English until translated.
 */
import type { Locale } from "@/i18n/config";

export type ImageAltCaption = { alt: string; caption?: string };
export type ImageAltOverlay = Record<string, ImageAltCaption>;

const loaders: Record<Locale, () => Promise<ImageAltOverlay>> = {
  en: () => Promise.resolve({}),
  ar: () => import("./image-alt.ar").then((m) => m.altOverlayAr),
  fr: () => import("./image-alt.fr").then((m) => m.altOverlayFr),
  de: () => import("./image-alt.de").then((m) => m.altOverlayDe),
  es: () => import("./image-alt.es").then((m) => m.altOverlayEs),
  it: () => import("./image-alt.it").then((m) => m.altOverlayIt),
  ru: () => import("./image-alt.ru").then((m) => m.altOverlayRu),
};

/** Load the full alt/caption overlay for a locale (English → empty map). */
export async function getImageAltOverlay(locale: Locale): Promise<ImageAltOverlay> {
  return (loaders[locale] ?? loaders.en)();
}

/**
 * Return a copy of `img` with its `alt` (and `caption`, when the overlay
 * supplies one) swapped to the localized text looked up by `img.src`. Every
 * other field is preserved. An image whose `src` is absent from the overlay is
 * returned unchanged, so English is the safe fallback.
 */
export function localizeImage<T extends { src: string; alt: string; caption?: string }>(
  img: T,
  overlay: ImageAltOverlay,
): T {
  const o = overlay[img.src];
  if (!o) return img;
  // Cast past the generic spread: we only ever narrow `alt`/`caption`, both of
  // which `T` already declares, so the shape is unchanged.
  return (o.caption === undefined
    ? { ...img, alt: o.alt }
    : { ...img, alt: o.alt, caption: o.caption }) as T;
}

/** `localizeImage` mapped over an array (e.g. a gallery or theme-media list). */
export function localizeImages<T extends { src: string; alt: string; caption?: string }>(
  images: T[],
  overlay: ImageAltOverlay,
): T[] {
  return images.map((img) => localizeImage(img, overlay));
}
