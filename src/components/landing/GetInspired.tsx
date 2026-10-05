"use client";

/**
 * Section 3.2 — "Get Inspired" (design.md §3.2).
 *
 * Hand-rolled ARIA tabs (role=tablist/tab/tabpanel, roving tabindex, arrow
 * keys + Home/End, stable slug-derived ids per §6.4 A-2 — no SSR duplicate-id
 * window) with the reference's instant mount/unmount panel switch (§4.8.5).
 *
 * Each panel is a Swiper rail — the sanctioned §8.4 consolidation replacing
 * Flickity (one vendor carousel lib). Behaviours replicated:
 *   - cells calc(237px + 1rem) <950 -> fluid 4-up @950 (gutter absorption via
 *     padding-inline on the rail = --container-padding, so the first card
 *     starts exactly at the content edge);
 *   - 1/3-parallax on the media (§3.2.4) via Swiper progress;
 *   - 6px dots (#ccc -> gold active -> ink hover), 44px arrows docked
 *     top:-5rem right, hidden <950;
 *   - cards 1095/1176 -> 754/850, 19px h3, clock+tag meta in rust,
 *     stretched link with an sr-only "See details about {title}".
 */
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { useCallback, useRef, useState } from "react";
import type { JSX, KeyboardEvent as ReactKeyboardEvent } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import MultiCropImage from "@/components/site/MultiCropImage";
import Icon from "@/components/ui/Icon";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { MQ_LAPTOP, useMediaQuery } from "@/hooks/use-media-query";
import type { InspiredCard, InspiredTab } from "@/content/landing";
import { applyRailParallax } from "./rail-parallax";
import "swiper/css";

const CARDS_PER_PAGE = 4;

function TripCard({ card }: { card: InspiredCard }): JSX.Element {
  return (
    <article className="gi-card hover-card">
      <div className="gi-card__media">
        <div className="rail-parallax">
          <MultiCropImage
            src={card.image.src}
            alt={card.image.alt}
            ratio={{ w: 1095, h: 1176 }}
            mid={{ src: card.image.src, ratio: { w: 754, h: 850 } }}
            sizes="(min-width: 950px) 25vw, (min-width: 744px) 40vw, 237px"
            className="gi-card__mci"
            imgClassName="card-zoom"
          />
        </div>
      </div>
      <h3 className="gi-card__title text-trip-h3">{card.title}</h3>
      {card.days !== undefined || card.experiences !== undefined ? (
        <dl className="gi-card__meta">
          {card.days !== undefined ? (
            <>
              <dt className="sr-only">Duration</dt>
              <dd className="gi-card__meta-item">
                <Icon name="clock" size={14} className="gi-card__meta-icon" />
                {/* Day tours are real now that the rail carries catalog tours,
                    so the plural has to agree — "1 Days" otherwise. */}
                <span>{card.days} {card.days === 1 ? "Day" : "Days"}</span>
              </dd>
            </>
          ) : null}
          {card.experiences !== undefined ? (
            <>
              <dt className="sr-only">Num of Experiences</dt>
              <dd className="gi-card__meta-item">
                <Icon name="tag" size={14} className="gi-card__meta-icon" />
                <span>{card.experiences} Experiences</span>
              </dd>
            </>
          ) : null}
        </dl>
      ) : null}
      <Link className="gi-card__stretched" href={card.href}>
        <span className="sr-only">See details about {card.title}</span>
      </Link>
    </article>
  );
}

function InspiredRail({ tab }: { tab: InspiredTab }): JSX.Element {
  const reduced = usePrefersReducedMotion();
  const isLaptop = useMediaQuery(MQ_LAPTOP) ?? false;
  const swiperRef = useRef<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const cardCount = tab.cards.length;
  const pageCount = isLaptop
    ? Math.max(1, Math.ceil(cardCount / CARDS_PER_PAGE))
    : cardCount;
  const activeDot = isLaptop
    ? Math.min(pageCount - 1, Math.floor(activeIndex / CARDS_PER_PAGE))
    : activeIndex;

  const handleTranslate = useCallback(
    (swiper: SwiperClass) => {
      if (!reduced) applyRailParallax(swiper);
    },
    [reduced],
  );

  return (
    <div
      className="gi__railwrap"
      role="region"
      aria-roledescription="carousel"
      aria-label={`${tab.label} highlights`}
    >
      <Swiper
        className="gi__rail"
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
        a11y={{ enabled: true, containerMessage: `${tab.label} highlights carousel` }}
      >
        {tab.cards.map((card) => (
          <SwiperSlide className="gi__cell" key={`${tab.key}-${card.href}-${card.title}`}>
            <TripCard card={card} />
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        type="button"
        className="gi__arrow gi__arrow--prev"
        aria-label={isLaptop ? "previous four slides" : "previous slide"}
        disabled={isLaptop ? activeDot === 0 : activeIndex === 0}
        onClick={() =>
          swiperRef.current?.slideTo(
            isLaptop
              ? Math.max(0, (activeDot - 1) * CARDS_PER_PAGE)
              : Math.max(0, activeIndex - 1),
          )
        }
      >
        <Icon name="chevron" size={18} />
      </button>
      <button
        type="button"
        className="gi__arrow gi__arrow--next"
        aria-label={isLaptop ? "next four slides" : "next slide"}
        disabled={
          isLaptop ? activeDot >= pageCount - 1 : activeIndex >= cardCount - 1
        }
        onClick={() =>
          swiperRef.current?.slideTo(
            isLaptop
              ? Math.min(cardCount - 1, (activeDot + 1) * CARDS_PER_PAGE)
              : Math.min(cardCount - 1, activeIndex + 1),
          )
        }
      >
        <Icon name="chevron" size={18} className="gi__arrow-glyph" />
      </button>

      <ol className="gi__dots">
        {Array.from({ length: pageCount }, (_, index) => (
          <li key={`${tab.key}-dot-${index}`}>
            <button
              type="button"
              className="gi__dot"
              data-active={index === activeDot || undefined}
              aria-label={
                isLaptop
                  ? `Show page ${index + 1} of ${pageCount}`
                  : `Show card ${index + 1} of ${pageCount}`
              }
              aria-current={index === activeDot ? "true" : undefined}
              onClick={() =>
                swiperRef.current?.slideTo(
                  isLaptop ? index * CARDS_PER_PAGE : index,
                )
              }
            />
          </li>
        ))}
      </ol>
    </div>
  );
}

export function GetInspired({ tabs }: { tabs: InspiredTab[] }): JSX.Element {
  const firstKey = tabs[0]?.key ?? "";
  const [activeKey, setActiveKey] = useState(firstKey);
  const [visited, setVisited] = useState<ReadonlySet<string>>(
    () => new Set(firstKey ? [firstKey] : []),
  );
  const tabRefs = useRef(new Map<string, HTMLButtonElement | null>());

  const activate = useCallback((key: string) => {
    setActiveKey(key);
    setVisited((prev) => (prev.has(key) ? prev : new Set(prev).add(key)));
  }, []);

  const onTabKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>, index: number) => {
      const last = tabs.length - 1;
      let nextIndex: number | null = null;
      if (event.key === "ArrowRight") nextIndex = index === last ? 0 : index + 1;
      else if (event.key === "ArrowLeft") nextIndex = index === 0 ? last : index - 1;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = last;
      if (nextIndex === null) return;
      event.preventDefault();
      const nextTab = tabs[nextIndex];
      if (!nextTab) return;
      activate(nextTab.key);
      tabRefs.current.get(nextTab.key)?.focus();
    },
    [activate, tabs],
  );

  return (
    <section
      className="gi section-shell"
      style={{ marginTop: "var(--section-margin)" }}
      aria-labelledby="gi-heading"
    >
      <h2 id="gi-heading" className="gi__h2 text-section-h2">
        Get Inspired
      </h2>

      <div className="gi__tabs">
        <div className="gi__tablist" role="tablist" aria-label="Get inspired categories">
          {tabs.map((tab, index) => {
            const selected = tab.key === activeKey;
            return (
              <button
                key={tab.key}
                id={`tabs--${tab.key}--tab`}
                ref={(node) => {
                  tabRefs.current.set(tab.key, node);
                }}
                type="button"
                role="tab"
                className="gi__tab"
                aria-selected={selected}
                aria-controls={`tabs--${tab.key}--panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => activate(tab.key)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="gi__panels">
          {tabs
            .filter((tab) => visited.has(tab.key))
            .map((tab) => (
              <div
                key={tab.key}
                id={`tabs--${tab.key}--panel`}
                role="tabpanel"
                className="gi__panel"
                aria-labelledby={`tabs--${tab.key}--tab`}
                tabIndex={-1}
                hidden={tab.key !== activeKey}
              >
                <InspiredRail tab={tab} />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

export default GetInspired;