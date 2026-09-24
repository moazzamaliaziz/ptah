"use client";

/**
 * Section 3.6 — "Tour Types" (design.md §3.6; the reference "Find
 * Accommodation" contentList slot, renamed for Ptah — we do not sell rooms).
 *
 * The Flickity watch pattern becomes a real breakpoint switch (§8.4
 * consolidation): below 950 the rail is a Swiper with the edge-bleed math
 * (§1.3.5) and 16rem -> 19rem cells @500; at >=950 the carousel is NOT
 * mounted at all — a static 4-up grid (repeat(4,1fr), gap 3rem 1.5rem) takes
 * over via useMediaQuery.
 *
 * Card anatomy is verbatim §3.6.4: media 711/840 -> 674/760, bottom-half
 * scrim, label pinned left/right .75rem/bottom 1rem -> 1.25/1.5rem, whole-card
 * link, --card-image-scale hover zoom.
 */
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { useCallback, useRef, useState } from "react";
import type { JSX } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import MultiCropImage from "@/components/site/MultiCropImage";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { MQ_LAPTOP, useMediaQuery } from "@/hooks/use-media-query";
import type { TourType } from "@/content/landing";
import { applyRailParallax } from "./rail-parallax";
import "swiper/css";

type TourTypeTuple = readonly [TourType, TourType, TourType, TourType];

function TourTypeCard({ item }: { item: TourType }): JSX.Element {
  return (
    <Link
      className="tt-card hover-card"
      href={item.href}
      data-ptah-type="link"
      data-ptah-value={item.href.replace(/^\//, "")}
    >
      <span className="tt-card__media">
        <span className="rail-parallax">
          <MultiCropImage
            src={item.image.src}
            alt={item.image.alt}
            ratio={{ w: 711, h: 840 }}
            mid={{ src: item.image.src, ratio: { w: 674, h: 760 } }}
            sizes="(min-width: 950px) 25vw, (min-width: 500px) 19rem, 16rem"
            className="tt-card__mci"
            imgClassName="card-zoom"
          />
        </span>
        <span className="tt-card__scrim" aria-hidden="true" />
      </span>
      <span className="tt-card__label text-card-title">{item.title}</span>
      <span className="sr-only"> — {item.blurb}</span>
    </Link>
  );
}

function TourTypesRail({
  items,
  reduced,
}: {
  items: TourTypeTuple;
  reduced: boolean;
}): JSX.Element {
  const swiperRef = useRef<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTranslate = useCallback(
    (swiper: SwiperClass) => {
      if (!reduced) applyRailParallax(swiper);
    },
    [reduced],
  );

  return (
    <div className="tt__railwrap">
      <Swiper
        className="tt__rail"
        modules={[FreeMode]}
        slidesPerView="auto"
        spaceBetween={0}
        speed={reduced ? 0 : 550}
        freeMode={{ enabled: true, sticky: true, momentumBounce: false }}
        watchSlidesProgress
        grabCursor
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          handleTranslate(swiper);
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        onSetTranslate={handleTranslate}
        onResize={handleTranslate}
        a11y={{ enabled: true, containerMessage: "Tour types carousel" }}
      >
        {items.map((item) => (
          <SwiperSlide className="tt-cell" key={item.href}>
            <TourTypeCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>

      <ol className="tt__dots" aria-label="Tour types pages">
        {items.map((item, index) => (
          <li key={`tt-dot-${item.href}`}>
            <button
              type="button"
              className="tt__dot"
              data-active={index === activeIndex || undefined}
              aria-label={`Show ${item.title} (card ${index + 1} of ${items.length})`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => swiperRef.current?.slideTo(index)}
            />
          </li>
        ))}
      </ol>
    </div>
  );
}

export function TourTypes({ items }: { items: TourTypeTuple }): JSX.Element {
  const isLaptop = useMediaQuery(MQ_LAPTOP);
  const reduced = usePrefersReducedMotion();

  return (
    <section
      className="tt section-shell"
      style={{ marginTop: "var(--section-margin)" }}
      aria-labelledby="tt-heading"
    >
      <div className="tt__header">
        <h2 id="tt-heading" className="tt__h2 text-section-h2">
          Tour Types
        </h2>
        <Link
          className="pill pill--outline tt__all text-btn"
          href="/tours"
          data-ptah-type="link"
          data-ptah-value="allTours"
        >
          See all Tours
        </Link>
      </div>
      {isLaptop ? (
        <ul className="tt__grid">
          {items.map((item) => (
            <li className="tt-cell tt-cell--grid" key={item.href}>
              <TourTypeCard item={item} />
            </li>
          ))}
        </ul>
      ) : (
        <TourTypesRail items={items} reduced={reduced} />
      )}
    </section>
  );
}

export default TourTypes;