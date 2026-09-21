/**
 * Shared 1/3-parallax patch for the card rails (design.md §3.2.4, §4.8.6).
 *
 * The reference (Flickity) writes:
 *   cellMedia.style.transform = `translate3d(${(slide.target + x) * (1/3)}px, 0, 0)`
 * i.e. the inner media drifts at one third of the track speed. The rebuild
 * consolidates rails onto Swiper (sanctioned §8.4 consolidation: one vendor
 * carousel lib) and reproduces the same feel from Swiper's per-slide
 * `progress` value, which is normalised by slide size — so
 * `progress * (1/3) * slideWidth` is the direct equivalent of the reference
 * formula.
 *
 * Coverage: the parallax layer renders at 170% width, centred (left: -35%) —
 * see `.rail-parallax` in landing.css — so drift saturates at 30% of a cell
 * width before the layer would gap.
 *
 * Reduced motion: callers must not invoke this when
 * usePrefersReducedMotion() is true (design.md §4.6 rule 1).
 */
import type { Swiper } from "swiper/types";

type SlideWithProgress = HTMLElement & { progress?: number };

const DRIFT_FACTOR = 1 / 3;
const DRIFT_LIMIT = 0.3;

function clamp(value: number, limit: number): number {
  if (value > limit) return limit;
  if (value < -limit) return -limit;
  return value;
}

/** Applies the 1/3 rail parallax to every `.rail-parallax` layer of the rail. */
export function applyRailParallax(swiper: Swiper): void {
  const slides = swiper.slides;
  if (!slides.length) return;

  for (let i = 0; i < slides.length; i += 1) {
    const slide = slides[i] as SlideWithProgress;
    const layer = slide.querySelector<HTMLElement>(".rail-parallax");
    if (!layer) continue;

    const slideWidth = slide.offsetWidth || swiper.width;
    const progress = typeof slide.progress === "number" ? slide.progress : 0;
    const drift = clamp(progress * slideWidth * DRIFT_FACTOR, slideWidth * DRIFT_LIMIT);
    layer.style.transform = `translate3d(${drift.toFixed(2)}px, 0, 0)`;
  }
}

/**
 * Featured Stories watch-progress drift (design.md §3.7.2): slide media drifts
 * vertically on a fraction of the track progress. Applied as a custom property
 * so CSS owns the transform composition (drift + cover scale).
 */
export function applyStoryParallax(swiper: Swiper): void {
  const slides = swiper.slides;
  if (!slides.length) return;

  for (let i = 0; i < slides.length; i += 1) {
    const slide = slides[i] as SlideWithProgress;
    const media = slide.querySelector<HTMLElement>(".story__mci");
    if (!media) continue;

    const raw = typeof slide.progress === "number" ? slide.progress : 0;
    const progress = clamp(raw, 1);
    const drift = progress * media.clientHeight * 0.03;
    media.style.setProperty("--story-drift", `${drift.toFixed(2)}px`);
  }
}