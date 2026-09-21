/**
 * MultiCropImage — the responsive-art-direction component (design.md §1.4).
 *
 * Reference mechanism: 2-3 sibling <img> siblings absolutely filling one
 * aspect-ratio box; CSS display-switches pick the visible variant per
 * breakpoint. Kept verbatim (stacked variants, padding-top fallback +
 * @supports upgrade), with the one sanctioned improvement that the aspect
 * math comes from props, not server-side crop URLs.
 *
 * Variant breakpoints (§1.4.2): base <744 · mid >=46.5em (744px) ·
 * wide at >=70.5em (1128, 50/50 cards) or >=90em (1440, full-bleed CTA/stories).
 *
 * Alt text is placed on EVERY variant. Only one variant is `display`-visible
 * per breakpoint, so the hidden variants are removed from the accessibility
 * tree entirely — there is no double-announcement, and the visible variant
 * always owns the description. (Previously only the base <img> carried alt,
 * so at >=744 the visible mid/wide image became decorative and the alt was
 * lost.)
 *
 * `sizes` may differ per variant: several slots (e.g. the story media) are
 * full-width at mobile but a fraction of the shell once the two-column layout
 * engages, so `midSizes`/`wideSizes` override the base hint where needed.
 *
 * next/image notes (Next 16): the `priority` prop is DEPRECATED in favor of
 * `preload`; `qualities` defaults to [75]. Because this component stacks 2-3
 * art-direction variants and only one is display-visible per breakpoint, it
 * must NOT map `priority` to `preload: true`: a preload link forces the browser
 * to fetch every hidden crop regardless of CSS (the exact multi-image
 * anti-pattern the Next 16 docs warn against). Instead the public `priority`
 * flag maps to `fetchPriority="high"` + eager loading on each variant — the
 * SSR'd markup lets the browser discover the visible crop immediately and
 * prioritize it, with no wasted preload of the hidden ones. Non-priority slots
 * stay lazy.
 */
import Image, { type ImageProps, type StaticImageData } from "next/image";
import type { CSSProperties, JSX } from "react";

type ImgSrc = string | StaticImageData;

export interface CropRatio {
  w: number;
  h: number;
}

export interface MultiCropImageProps {
  /** Base (mobile) source. */
  src: ImgSrc;
  alt: string;
  /** Aspect of the base (mobile) crop box — used for padding-top fallback. */
  ratio: CropRatio;
  /** >=744px variant. */
  mid?: { src: ImgSrc; ratio: CropRatio };
  /** Third variant; `wideAt` selects its switch breakpoint (default 1128). */
  wide?: { src: ImgSrc; ratio: CropRatio };
  wideAt?: 1128 | 1440;
  /**
   * Sizes hint for the base variant. Defaults to 100vw (the reference's
   * behavior for all photographic slots, §1.4.1 #7).
   */
  sizes?: string;
  /** Sizes hint for the mid variant (falls back to `sizes`). */
  midSizes?: string;
  /** Sizes hint for the wide variant (falls back to `sizes`). */
  wideSizes?: string;
  /** LCP slot: eager-loads with fetchPriority="high" (no preload link — the
   *  hidden art-direction variants must not all be forced onto the wire). */
  priority?: boolean;
  /** Extra classes on the outer aspect box. */
  className?: string;
  /** Extra classes on every variant's <img> (e.g. `card-zoom`). */
  imgClassName?: string;
  /** Style of the outer box (e.g., custom margins). */
  style?: CSSProperties;
}

function variantClasses(base: string, extra?: string): string {
  return extra ? `${base} ${extra}` : base;
}

export function MultiCropImage({
  src,
  alt,
  ratio,
  mid,
  wide,
  wideAt = 1128,
  sizes = "100vw",
  midSizes,
  wideSizes,
  priority = false,
  className,
  imgClassName,
  style,
}: MultiCropImageProps): JSX.Element {
  if (wide && !mid) {
    throw new Error(
      "MultiCropImage: a `wide` variant requires a `mid` variant (the spec only ever stacks base/mid/wide).",
    );
  }

  const pad = (r: CropRatio): string => `${(r.h / r.w) * 100}%`;

  const vars: Record<string, string> = {
    "--mci-pad": pad(ratio),
    "--mci-ratio": `${ratio.w} / ${ratio.h}`,
  };
  if (mid) {
    vars["--mci-pad-mid"] = pad(mid.ratio);
    vars["--mci-ratio-mid"] = `${mid.ratio.w} / ${mid.ratio.h}`;
  }
  if (wide) {
    vars["--mci-pad-wide"] = pad(wide.ratio);
    vars["--mci-ratio-wide"] = `${wide.ratio.w} / ${wide.ratio.h}`;
  }

  const loading: ImageProps["loading"] | undefined = priority ? "eager" : "lazy";

  return (
    <span
      className={variantClasses("mci", className)}
      style={{ ...vars, ...style } as CSSProperties & Record<string, string>}
      data-mid={mid ? "" : undefined}
      data-wide-at={wide ? String(wideAt) : undefined}
    >
      <span className="mci__variant mci__variant--base">
        <Image
          src={src}
          alt={alt}
          className={variantClasses("mci__img", imgClassName)}
          decoding="async"
          {...(priority
            ? { fetchPriority: "high" as const, loading: "eager" as const }
            : { loading })}
          fill
          sizes={sizes}
        />
      </span>
      {mid ? (
        <span className="mci__variant mci__variant--mid">
          <Image
            src={mid.src}
            alt={alt}
            className={variantClasses("mci__img", imgClassName)}
            decoding="async"
            {...(priority
              ? { fetchPriority: "high" as const, loading: "eager" as const }
              : { loading })}
            fill
            sizes={midSizes ?? sizes}
          />
        </span>
      ) : null}
      {wide ? (
        <span className="mci__variant mci__variant--wide">
          <Image
            src={wide.src}
            alt={alt}
            className={variantClasses("mci__img", imgClassName)}
            decoding="async"
            {...(priority
              ? { fetchPriority: "high" as const, loading: "eager" as const }
              : { loading })}
            fill
            sizes={wideSizes ?? sizes}
          />
        </span>
      ) : null}
    </span>
  );
}

export default MultiCropImage;