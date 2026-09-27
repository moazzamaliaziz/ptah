"use client";

/**
 * /gallery masonry grid + category filter + accessible lightbox.
 *
 * Masonry is pure CSS columns (each photo keeps its true aspect ratio via
 * next/image intrinsic width/height — no forced crop). Filtering is client
 * state over the static galleryPhotos set. The lightbox is a self-contained
 * modal: prev/next (buttons + ArrowLeft/ArrowRight), Esc to close, click-to-
 * zoom, background scroll lock, focus moved into the dialog and restored on
 * close, and all motion suppressed under prefers-reduced-motion.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import type { JSX } from "react";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { galleryCategoryOrder, type GalleryCategory, type GalleryPhoto } from "@/content/gallery";

export interface GalleryGridLabels {
  galleryAria: string;
  filterGroupAria: string;
  filters: {
    all: string;
    guests: string;
    temples: string;
    sinaiDesert: string;
    nileNubia: string;
  };
  /** counter is a "{current} of {total}" template. */
  lightbox: { close: string; prev: string; next: string; zoomIn: string; zoomOut: string; counter: string };
}

type Filter = "all" | GalleryCategory;

export function GalleryGrid({ photos, labels }: { photos: GalleryPhoto[]; labels: GalleryGridLabels }): JSX.Element {
  const reduced = usePrefersReducedMotion();
  const [filter, setFilter] = useState<Filter>("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const catLabel: Record<GalleryCategory, string> = {
    guests: labels.filters.guests,
    temples: labels.filters.temples,
    "sinai-desert": labels.filters.sinaiDesert,
    "nile-nubia": labels.filters.nileNubia,
  };

  const filters: Filter[] = ["all", ...galleryCategoryOrder];
  const visible = filter === "all" ? photos : photos.filter((p) => p.category === filter);
  const active = openIndex === null ? null : (visible[openIndex] ?? null);

  const open = useCallback((index: number, trigger: HTMLElement) => {
    restoreFocusRef.current = trigger;
    setOpenIndex(index);
    setZoomed(false);
  }, []);

  const close = useCallback(() => {
    setOpenIndex(null);
    setZoomed(false);
    restoreFocusRef.current?.focus();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setOpenIndex((cur) => (cur === null ? cur : (cur + delta + visible.length) % visible.length));
      setZoomed(false);
    },
    [visible.length],
  );

  // Keyboard nav + background scroll lock while the lightbox is open.
  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex, close, step]);

  return (
    <div>
      <div role="group" aria-label={labels.filterGroupAria} className="mb-8 flex flex-wrap gap-2">
        {filters.map((f) => {
          const isActive = filter === f;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={isActive}
              onClick={() => {
                setFilter(f);
                setOpenIndex(null);
              }}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? "border-nile bg-nile text-white"
                  : "border-grey-300/70 bg-white text-ink hover:border-nile/50"
              }`}
            >
              {f === "all" ? labels.filters.all : catLabel[f]}
            </button>
          );
        })}
      </div>

      <ul className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>li]:mb-4" aria-label={labels.galleryAria}>
        {visible.map((photo, i) => (
          <li key={photo.src} className="break-inside-avoid">
            <button
              type="button"
              onClick={(e) => open(i, e.currentTarget)}
              className="group block w-full overflow-hidden rounded-xl border border-grey-300/50 bg-white"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                sizes="(min-width: 1024px) 360px, (min-width: 640px) 45vw, 90vw"
                className={`h-auto w-full ${reduced ? "" : "transition-transform duration-500 group-hover:scale-[1.03]"}`}
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={close}
        >
          <p className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 text-sm text-white/70">
            {labels.lightbox.counter
              .replace("{current}", String((openIndex ?? 0) + 1))
              .replace("{total}", String(visible.length))}
          </p>

          <button
            ref={closeRef}
            type="button"
            aria-label={labels.lightbox.close}
            onClick={close}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <Icon name="close" size={22} />
          </button>

          {visible.length > 1 ? (
            <>
              <button
                type="button"
                aria-label={labels.lightbox.prev}
                onClick={(e) => { e.stopPropagation(); step(-1); }}
                className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-4"
              >
                <Icon name="chevron" size={22} style={{ transform: "rotate(180deg)" }} />
              </button>
              <button
                type="button"
                aria-label={labels.lightbox.next}
                onClick={(e) => { e.stopPropagation(); step(1); }}
                className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-4"
              >
                <Icon name="chevron" size={22} />
              </button>
            </>
          ) : null}

          <button
            type="button"
            aria-label={zoomed ? labels.lightbox.zoomOut : labels.lightbox.zoomIn}
            aria-pressed={zoomed}
            onClick={(e) => { e.stopPropagation(); setZoomed((z) => !z); }}
            className="absolute bottom-4 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <Icon name={zoomed ? "zoom-out" : "zoom-in"} size={22} />
          </button>

          <div
            className="flex max-h-full max-w-full items-center justify-center overflow-auto"
            onClick={(e) => { e.stopPropagation(); setZoomed((z) => !z); }}
          >
            <Image
              src={active.src}
              alt={active.alt}
              width={active.width}
              height={active.height}
              sizes="100vw"
              priority
              className={`${reduced ? "" : "transition-transform duration-300"} h-auto w-auto ${
                zoomed ? "max-h-none max-w-none cursor-zoom-out" : "max-h-[86vh] max-w-[92vw] cursor-zoom-in"
              }`}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default GalleryGrid;
