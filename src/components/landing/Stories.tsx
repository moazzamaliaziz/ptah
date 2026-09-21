"use client";

/**
 * Section 3.7 — "Featured Stories" (design.md §3.7).
 *
 * Swiper fade engine with the reference defaults (speed 300, crossFade false
 * — sequential fades — manual navigation only, no autoplay) plus the
 * watch-progress parallax drift on slide media (§3.7.2). Navigation is driven
 * by custom buttons calling slidePrev/slideNext (same observable behaviour as
 * the reference's external Navigation module wiring, without the ref-tearing
 * dance) and custom pagination bullets.
 *
 * The plum band is drawn by the wrapper ::before (mobile: height calc(100% -
 * 12vw) at top 12vw; full height >=744), the text card floats over the media
 * column from 744 up and only becomes visible when the slide carries
 * `.swiper-slide-visible` (§3.7.4). Reduced motion: fades are instant (speed
 * 0) and the parallax writer is skipped.
 */
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import type { JSX } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import MultiCropImage from "@/components/site/MultiCropImage";
import Icon from "@/components/ui/Icon";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { Story } from "@/content/landing";
import { applyStoryParallax } from "./rail-parallax";
import "swiper/css";
import "swiper/css/effect-fade";

export function Stories({ items }: { items: Story[] }): JSX.Element {
  const reduced = usePrefersReducedMotion();
  const swiperRef = useRef<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const lastIndex = items.length - 1;

  const handleTranslate = useCallback(
    (swiper: SwiperClass) => {
      if (!reduced) applyStoryParallax(swiper);
    },
    [reduced],
  );

  return (
    <div
      className="stories"
      data-type="storyShowcase"
      style={{ marginTop: "var(--section-margin)" }}
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured stories"
    >
      <Swiper
        className="stories__swiper"
        modules={[EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: false }}
        speed={reduced ? 0 : 300}
        slidesPerView={1}
        watchSlidesProgress
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          handleTranslate(swiper);
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        onSetTranslate={handleTranslate}
        onResize={handleTranslate}
        a11y={{ enabled: true, containerMessage: "Featured stories carousel" }}
      >
        {items.map((story) => (
          <SwiperSlide className="stories__slide" key={story.href}>
            <article className="story section-shell">
              <div className="story__media">
                <MultiCropImage
                  src={story.image.src}
                  alt={story.image.alt}
                  ratio={{ w: 1092, h: 768 }}
                  mid={{ src: story.image.mid ?? story.image.src, ratio: { w: 1227, h: 861 } }}
                  wide={{
                    src: story.image.wide ?? story.image.mid ?? story.image.src,
                    ratio: { w: 1636, h: 1148 },
                  }}
                  wideAt={1440}
                  sizes="100vw"
                  midSizes="(min-width: 1128px) 55vw, 50vw"
                  wideSizes="58vw"
                  className="story__mci"
                />
              </div>
              <div className="story__text">
                <p className="story__eyebrow text-eyebrow">Featured Stories</p>
                <h2 className="story__h2 text-section-h2">{story.title}</h2>
                <p className="story__summary text-story-body">{story.summary}</p>
                <div className="story__ctas">
                  <Link
                    className="pill pill--solid story__cta"
                    href={story.href}
                    data-ptah-type="link"
                    data-ptah-value="readMore"
                  >
                    Read More<span className="sr-only"> about {story.title}</span>
                  </Link>
                  <Link
                    className="pill pill--ghost story__cta"
                    href="/blog"
                    data-ptah-type="link"
                    data-ptah-value="allStories"
                  >
                    See all Stories
                  </Link>
                </div>
              </div>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="stories__controls section-shell">
        <button
          type="button"
          className="stories__arrow stories__arrow--prev"
          aria-label="previous story"
          disabled={activeIndex === 0}
          onClick={() => swiperRef.current?.slidePrev()}
        >
          <Icon name="chevron" size={18} />
        </button>

        <ol className="stories__pagination" aria-label="Choose story">
          {items.map((story, index) => (
            <li key={`story-dot-${story.href}`}>
              <button
                type="button"
                className="stories__bullet"
                data-active={index === activeIndex || undefined}
                aria-label={`Show story ${index + 1} of ${items.length}: ${story.title}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => swiperRef.current?.slideTo(index)}
              />
            </li>
          ))}
        </ol>

        <button
          type="button"
          className="stories__arrow stories__arrow--next"
          aria-label="next story"
          disabled={activeIndex === lastIndex}
          onClick={() => swiperRef.current?.slideNext()}
        >
          <Icon name="chevron" size={18} className="stories__arrow-glyph" />
        </button>
      </div>
    </div>
  );
}

export default Stories;