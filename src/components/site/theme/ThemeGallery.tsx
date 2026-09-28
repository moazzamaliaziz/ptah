"use client";

/**
 * Theme-page photo gallery: CSS-columns masonry + accessible lightbox.
 *
 * A trimmed sibling of the /gallery grid (no category filter). Each photo keeps
 * its true aspect ratio via next/image intrinsic width/height. The lightbox
 * supports prev/next (buttons + Arrow keys), Esc to close, click-to-zoom,
 * background scroll lock, focus moved into the dialog and restored on close, and
 * suppresses motion under prefers-reduced-motion.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import type { JSX } from "react";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import ThemeSectionHead from "./ThemeSectionHead";
import type { ThemeImage } from "@/content/theme-media";
import type { SectionHead } from "@/content/theme-content";

export interface ThemeGalleryLabels {
  galleryAria: string;
  /** counter is a "{current} of {total}" template. */
  lightbox: { close: string; prev: string; next: string; zoomIn: string; zoomOut: string; counter: string };
}

export function ThemeGallery({
  head,
  images,
  labels,
}: {
  head: SectionHead;
  images: ThemeImage[];
  labels: ThemeGalleryLabels;
}): JSX.Element {
  const reduced = usePrefersReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const active = openIndex === null ? null : (images[openIndex] ?? null);

  const open = useCallback((index: number) => {
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    setZoomed(false);
    setOpenIndex(index);
  }, []);

  const close = useCallback(() => {
    setOpenIndex(null);
    setZoomed(false);
    restoreFocusRef.current?.focus?.();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setZoomed(false);
      setOpenIndex((cur) => {
        if (cur === null) return cur;
        const next = (cur + delta + images.length) % images.length;
        return next;
      });
    },
    [images.length],
  );

  // Keyboard controls + background scroll lock while the lightbox is open.
  useEffect(() => {
    if (openIndex === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, step]);

  // RENDER_MARKER
  return (
    <section>
      <ThemeSectionHead head={head} />
      <ul
        aria-label={labels.galleryAria}
        className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4"
      >
        {images.map((img, i) => (
          <li key={img.src} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => open(i)}
              className="card-zoom group block w-full overflow-hidden rounded-xl bg-papyrus focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nile"
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
                className="h-auto w-full"
              />
            </button>
          </li>
        ))}
      </ul>
      {active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.alt}
          className="fixed inset-0 z-[100] flex flex-col bg-nile/95"
          onClick={close}
        >
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <span className="text-meta text-white/80">
              {labels.lightbox.counter
                .replace("{current}", String((openIndex ?? 0) + 1))
                .replace("{total}", String(images.length))}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setZoomed((z) => !z); }}
                aria-label={zoomed ? labels.lightbox.zoomOut : labels.lightbox.zoomIn}
                className="rounded-full p-2 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <Icon name={zoomed ? "zoom-out" : "zoom-in"} size={22} />
              </button>
              <button
                ref={closeRef}
                type="button"
                onClick={(e) => { e.stopPropagation(); close(); }}
                aria-label={labels.lightbox.close}
                className="rounded-full p-2 hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
              >
                <Icon name="close" size={22} />
              </button>
            </div>
          </div>
          <div className="relative flex flex-1 items-center justify-center overflow-auto px-4 pb-4">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); step(-1); }}
              aria-label={labels.lightbox.prev}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <Icon name="chevron" size={26} className="rotate-180" />
            </button>
            <Image
              src={active.src}
              alt={active.alt}
              width={active.width}
              height={active.height}
              onClick={(e) => { e.stopPropagation(); setZoomed((z) => !z); }}
              className={`max-h-full w-auto max-w-full object-contain ${reduced ? "" : "transition-transform"} ${zoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"}`}
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); step(1); }}
              aria-label={labels.lightbox.next}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <Icon name="chevron" size={26} />
            </button>
          </div>
          {active.caption ? (
            <p className="px-4 pb-4 text-center text-meta text-white/70">{active.caption}</p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
