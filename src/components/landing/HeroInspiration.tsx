"use client";

/**
 * Section 3.1 — Hero: InspirationSelector (design.md §3.1, motion §3.1.5).
 *
 * Swiper fade engine (speed 2000, loop, autoplay 8000/dont-disable-on-interaction)
 * + the reference's bespoke choreography:
 *   - title enter .8s / delay 1s, exit .3s          (CSS, driven by .swiper-slide-active)
 *   - hotspot orchestration delay .5s + stagger .5s, items 3s, exit .3s (CSS, same class)
 *   - tooltip enter/exit .4s with the -80% -> -50% -> -20% y dance (motion/AnimatePresence)
 *   - dot <-> chevron .08s (+.03s chevron lag)      (CSS custom properties)
 *   - season pill expand/collapse .3s with .08 stagger, reversed on collapse (motion)
 *   - custom 48px cursor: scale 0/.25/1 in .2s, bg white <-> ink in .2s
 *   - pause/play with an 8000ms SVG progress ring (pathLength 0 -> 1, linear)
 *
 * Mobile (<744): the reference swaps the whole slide UX (labelled dot buttons,
 * stacked heading + text links, no image hotspots). We keep ONE Swiper and
 * CSS-switch the two control/hotspot presentations (no duplicated focusables —
 * `display:none` removes the inactive variant from tab order), and swap the
 * prev/next zones + custom cursor off entirely <744 (desktop flag).
 *
 * Reduced motion (§4.6 rule 2): autoplay paused by default, cross-fade speed
 * 0 (hard cut), cursor disabled, tooltips/staggers instant via MotionConfig +
 * explicit zero durations; the CSS clamp in globals.css covers the rest.
 */
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { CSSProperties, JSX } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import Image from "next/image";
import MultiCropImage from "@/components/site/MultiCropImage";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  MQ_DESKTOP,
  MQ_HOVER_FINE,
  useMediaQuery,
} from "@/hooks/use-media-query";
import type { HeroSlide } from "@/content/landing";
import "swiper/css";
import "swiper/css/effect-fade";

export interface HeroInspirationProps {
  slides: HeroSlide[];
}

const SEASON_LABELS: Record<HeroSlide["season"], string> = {
  summer: "Summer",
  winter: "Winter",
};

type ZoneKind = "none" | "prev" | "next" | "hotspot";

function PauseGlyph(): JSX.Element {
  return (
    <svg className="hero__playpause-glyph" viewBox="0 0 18 18" width="18" height="18" aria-hidden="true" focusable="false">
      <rect x="4" y="3" width="3.5" height="12" rx="1" />
      <rect x="10.5" y="3" width="3.5" height="12" rx="1" />
    </svg>
  );
}

function PlayGlyph(): JSX.Element {
  return (
    <svg className="hero__playpause-glyph" viewBox="0 0 18 18" width="18" height="18" aria-hidden="true" focusable="false">
      <path d="M5 3.2l10 5.8-10 5.8z" />
    </svg>
  );
}

interface HotspotProps {
  label: string;
  href: string;
  xPct: number;
  yPct: number;
  index: number;
  reduced: boolean;
  onZoneChange: (zone: ZoneKind) => void;
}

/** One percentage-placed hotspot; button + tooltip with framer choreography. */
function HeroHotspot({
  label,
  href,
  xPct,
  yPct,
  index,
  reduced,
  onZoneChange,
}: HotspotProps): JSX.Element {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const tooltipId = useId();

  const show = useCallback(() => {
    setOpen(true);
    onZoneChange("hotspot");
  }, [onZoneChange]);

  const hide = useCallback(() => {
    setOpen(false);
    onZoneChange("none");
  }, [onZoneChange]);

  const enterTransition = reduced
    ? { duration: 0 }
    : {
        opacity: { duration: 0.4, ease: "linear" as const, delay: 0.4 },
        y: { duration: 0.4, ease: "easeOut" as const, delay: 0.4 },
      };
  const exitTransition = reduced
    ? { duration: 0 }
    : {
        opacity: { duration: 0.4, ease: "linear" as const },
        y: { duration: 0.4, ease: "easeIn" as const },
      };

  const style = {
    left: `${xPct}%`,
    top: `${yPct}%`,
    "--i": index,
  } as CSSProperties;

  return (
    <li className="hero__hotspot" style={style}>
      <button
        type="button"
        className="hero__hotspot-dot"
        aria-label={label}
        aria-describedby={open ? tooltipId : undefined}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={() => router.push(href)}
        data-ptah-type="hotspot"
        data-ptah-value={href.replace(/^\//, "")}
      >
        <svg className="hero__hotspot-glyph hero__hotspot-glyph--dot" viewBox="0 0 28 28" width="28" height="28" aria-hidden="true" focusable="false">
          <circle cx="14" cy="14" r="5.25" />
        </svg>
        <svg className="hero__hotspot-glyph hero__hotspot-glyph--chev" viewBox="0 0 28 28" width="28" height="28" aria-hidden="true" focusable="false">
          <path d="M11.5 7.5l6.5 6.5-6.5 6.5" />
        </svg>
      </button>
      <span className="hero__hotspot-anchor">
        <AnimatePresence>
          {open ? (
            <motion.span
              id={tooltipId}
              className="hero__hotspot-pill"
              initial={{ opacity: 0, y: "-80%" }}
              animate={{ opacity: 1, y: "-50%" }}
              exit={{ opacity: 0, y: "-20%", transition: exitTransition }}
              transition={enterTransition}
            >
              {label}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </span>
    </li>
  );
}
export function HeroInspiration({ slides }: HeroInspirationProps): JSX.Element {
  const reduced = usePrefersReducedMotion();
  const isDesktop = useMediaQuery(MQ_DESKTOP) ?? true;
  const finePointer = useMediaQuery(MQ_HOVER_FINE) ?? false;

  const seasons = useMemo(
    () => Array.from(new Set(slides.map((slide) => slide.season))),
    [slides],
  );
  const [season, setSeason] = useState<HeroSlide["season"]>(
    slides[0]?.season ?? "summer",
  );
  const seasonSlides = useMemo(
    () => slides.filter((slide) => slide.season === season),
    [slides, season],
  );

  const router = useRouter();
  const swiperRef = useRef<SwiperClass | null>(null);
  const ringRef = useRef<SVGCircleElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [seasonOpen, setSeasonOpen] = useState(false);
  const [zone, setZone] = useState<ZoneKind>("none");

  const seasonVariants = useMemo(() => makeSeasonVariants(reduced), [reduced]);

  /* Mirror of `playing` for handlers that must not re-create on every toggle. */
  const playingRef = useRef(true);
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  /* §4.6 rule 2 — reduced motion: autoplay paused by default, hard cut. */
  useEffect(() => {
    const swiper = swiperRef.current;
    if (!swiper || !reduced) return;
    swiper.autoplay?.stop();
    swiper.params.speed = 0;
    setPlaying(false);
  }, [reduced]);

  /* Autoplay pauses while the season menu is expanded (§3.1.4). */
  const toggleSeasonMenu = useCallback(() => {
    const next = !seasonOpen;
    setSeasonOpen(next);
    const swiper = swiperRef.current;
    if (next) {
      swiper?.autoplay?.pause();
    } else if (playingRef.current && !reduced) {
      swiper?.autoplay?.resume();
    }
  }, [seasonOpen, reduced]);

  const pickSeason = useCallback((next: HeroSlide["season"]) => {
    setSeason(next);
    setSeasonOpen(false);
    setActiveIndex(0);
    const swiper = swiperRef.current;
    if (playingRef.current) swiper?.autoplay?.resume();
  }, []);

  const togglePlay = useCallback(() => {
    const swiper = swiperRef.current;
    if (!swiper) return;
    if (playingRef.current) {
      swiper.autoplay?.stop();
      setPlaying(false);
    } else {
      swiper.autoplay?.start();
      setPlaying(true);
    }
  }, []);

  /* Custom cursor: 0s position tracking, scale/bg by zone (§3.1.5). */
  const handleCursorMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const cursor = cursorRef.current;
      const stage = stageRef.current;
      if (!cursor || !stage) return;
      const rect = stage.getBoundingClientRect();
      cursor.style.transform = `translate3d(${event.clientX - rect.left}px, ${
        event.clientY - rect.top
      }px, 0)`;
    },
    [],
  );

  return (
    <MotionConfig reducedMotion="user">
      <section className="hero" aria-label="Inspiration" data-season={season}>
        <div
          className="hero__band"
          ref={stageRef}
          onMouseMove={finePointer ? handleCursorMove : undefined}
          onMouseLeave={() => setZone("none")}
        >
          <div className="hero__backdrop-cream" aria-hidden="true" />

          {/* §3.1.6 — hidden stack of every season image so cross-fades are cache-warm */}
          <div className="hero__preloader" aria-hidden="true">
            {slides.map((slide) => (
              <span className="hero__preload-item" key={`${slide.id}-preload`}>
                <Image src={slide.image.src} alt="" width={388} height={610} sizes="100vw" loading="eager" />
                {slide.image.mid ? (
                  <Image src={slide.image.mid} alt="" width={1420} height={800} sizes="100vw" loading="eager" />
                ) : null}
              </span>
            ))}
          </div>

          <Swiper
            key={season}
            className="hero__media"
            modules={[Autoplay, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: false }}
            speed={reduced ? 0 : 2000}
            loop={seasonSlides.length > 1}
            autoplay={reduced ? false : { delay: 8000, disableOnInteraction: false }}
            slidesPerView={1}
            watchSlidesProgress
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
              setActiveIndex(swiper.realIndex);
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            onAutoplayTimeLeft={(_swiper, _timeLeft, percentage) => {
              const ring = ringRef.current;
              if (!ring) return;
              const value = Math.min(1, Math.max(0, percentage));
              ring.style.strokeDasharray = `${value} 1`;
            }}
            a11y={{ enabled: true, containerMessage: "Hero inspiration slideshow" }}
          >
            {seasonSlides.map((slide, slideIndex) => (
              <SwiperSlide className="hero__slide" key={slide.id}>
                <MultiCropImage
                  src={slide.image.src}
                  alt={slide.image.alt}
                  ratio={{ w: 388, h: 610 }}
                  mid={{ src: slide.image.mid ?? slide.image.src, ratio: { w: 1420, h: 800 } }}
                  sizes="100vw"
                  priority={slideIndex === 0}
                  className="hero__image mci--square-frame"
                />
                <span className="hero__image-overlay" aria-hidden="true" />

                <h2 className="hero__title text-hero">{slide.title}</h2>

                {/* Markup swap at 744 (§3.1.2 mobile row): desktop = placed
                    image hotspots; mobile = stacked heading + text-link list. */}
                {isDesktop ? (
                  <ul className="hero__hotspots" aria-label="Points of interest">
                    {slide.hotspots.map((hotspot, hotspotIndex) => (
                      <HeroHotspot
                        key={`${slide.id}-${hotspot.label}`}
                        label={hotspot.label}
                        href={hotspot.href}
                        xPct={hotspot.xPct}
                        yPct={hotspot.yPct}
                        index={hotspotIndex}
                        reduced={reduced}
                        onZoneChange={setZone}
                      />
                    ))}
                  </ul>
                ) : (
                  <ul className="hero__hotspot-links">
                    {slide.hotspots.map((hotspot) => (
                      <li key={`${slide.id}-link-${hotspot.label}`}>
                        <button
                          type="button"
                          className="hero__hotspot-link link-inline"
                          onClick={() => router.push(hotspot.href)}
                          data-ptah-type="hotspot"
                          data-ptah-value={hotspot.href.replace(/^\//, "")}
                        >
                          {hotspot.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
          {isDesktop ? (
            <>
              <button
                type="button"
                className="hero__zone hero__zone--prev"
                aria-label="previous slide"
                onClick={() => swiperRef.current?.slidePrev()}
                onMouseEnter={() => setZone("prev")}
                onMouseLeave={() => setZone("none")}
              />
              <button
                type="button"
                className="hero__zone hero__zone--next"
                aria-label="next slide"
                onClick={() => swiperRef.current?.slideNext()}
                onMouseEnter={() => setZone("next")}
                onMouseLeave={() => setZone("none")}
              />
            </>
          ) : null}

          <nav
            className="hero__nav"
            aria-label="Slideshow controls"
            data-variant={isDesktop ? "desktop" : "mobile"}
          >
            {isDesktop ? (
              <div className="hero__numbers">
                {seasonSlides.map((slide, index) => (
                  <button
                    key={`num-${slide.id}`}
                    type="button"
                    className="hero__number"
                    aria-label={`Show slide ${index + 1}: ${slide.shortLabel}`}
                    aria-current={index === activeIndex ? "true" : undefined}
                    onClick={() => swiperRef.current?.slideToLoop(index)}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </button>
                ))}
              </div>
            ) : (
              <div className="hero__dots">
                {seasonSlides.map((slide, index) => (
                  <button
                    key={`dot-${slide.id}`}
                    type="button"
                    className="hero__dot"
                    aria-label={`show ${slide.shortLabel}`}
                    aria-current={index === activeIndex ? "true" : undefined}
                    onClick={() => swiperRef.current?.slideToLoop(index)}
                  />
                ))}
              </div>
            )}

            {seasons.length > 1 ? (
              <div className="hero__season" data-open={seasonOpen}>
                <button
                  type="button"
                  className="hero__season-trigger"
                  aria-expanded={seasonOpen}
                  onClick={toggleSeasonMenu}
                >
                  {SEASON_LABELS[season]}
                </button>
                <AnimatePresence initial={false}>
                  {seasonOpen ? (
                    <motion.ul
                      className="hero__season-list"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={seasonVariants.list}
                    >
                      {seasons.map((option) => (
                        <motion.li key={option} variants={seasonVariants.item}>
                          <button
                            type="button"
                            className="hero__season-option"
                            aria-pressed={option === season}
                            onClick={() => pickSeason(option)}
                          >
                            {SEASON_LABELS[option]}
                          </button>
                        </motion.li>
                      ))}
                    </motion.ul>
                  ) : null}
                </AnimatePresence>
              </div>
            ) : null}

            <button
              type="button"
              className="hero__playpause"
              aria-label={playing ? "pause slideshow" : "play slideshow"}
              onClick={togglePlay}
              data-playing={playing}
            >
              <svg
                className="hero__ring"
                viewBox="0 0 40 40"
                width="40"
                height="40"
                aria-hidden="true"
                focusable="false"
              >
                <circle
                  className="hero__ring-track"
                  cx="20"
                  cy="20"
                  r="18"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="2"
                />
                <circle
                  ref={ringRef}
                  className="hero__ring-progress"
                  cx="20"
                  cy="20"
                  r="18"
                  strokeWidth="2"
                  fill="none"
                  pathLength={1}
                  strokeDasharray="0 1"
                />
              </svg>
              {playing ? <PauseGlyph /> : <PlayGlyph />}
            </button>
          </nav>

          <p className="hero__credit text-meta">
            Image: {seasonSlides[activeIndex]?.image.credit ?? ""}
          </p>

          {finePointer && !reduced ? (
            <div className="hero__cursor" data-zone={zone} ref={cursorRef} aria-hidden="true">
              <span className="hero__cursor-dot" />
            </div>
          ) : null}

          <p className="sr-only" aria-live="polite">
            {`Slide ${activeIndex + 1} of ${seasonSlides.length}: ${
              seasonSlides[activeIndex]?.title ?? ""
            }`}
          </p>
        </div>
      </section>
    </MotionConfig>
  );
}

/* Season pill variants (§3.1.5): expand width 0 -> auto, children stagger .08;
   collapse reverses the stagger (staggerDirection -1 + .08 delayChildren). */
function makeSeasonVariants(reduced: boolean): {
  list: import("motion/react").Variants;
  item: import("motion/react").Variants;
} {
  const duration = reduced ? 0 : 0.3;
  return {
    list: {
      hidden: { width: 0 },
      visible: {
        width: "auto",
        transition: {
          duration,
          ease: "easeOut",
          staggerChildren: reduced ? 0 : 0.08,
        },
      },
      exit: {
        width: 0,
        transition: {
          duration,
          ease: "easeIn",
          staggerChildren: reduced ? 0 : 0.08,
          staggerDirection: -1,
          delayChildren: reduced ? 0 : 0.08,
        },
      },
    },
    item: {
      hidden: { opacity: 0, y: 6 },
      visible: { opacity: 1, y: 0, transition: { duration, ease: "easeOut" } },
      exit: { opacity: 0, transition: { duration, ease: "easeIn" } },
    },
  };
}

export default HeroInspiration;