"use client";

/**
 * "Real travelers, real moments" — landing showcase of hand-picked guest photos.
 *
 * A Swiper filmstrip (peeking multiple slides) over the featured gallery photos,
 * with a "See all photos" CTA into /gallery. Autoplay runs only when the user
 * has NOT requested reduced motion; custom chevron arrows drive manual nav. The
 * photos come straight from the static gallery content module — this section is
 * intentionally NOT part of the editable-landing CMS pipeline.
 */
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { useRef } from "react";
import type { JSX } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import Icon from "@/components/ui/Icon";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { GalleryPhoto } from "@/content/gallery";
import "swiper/css";

export interface TravelersShowcaseStrings {
  eyebrow: string;
  title: string;
  blurb: string;
  cta: string;
  prev: string;
  next: string;
}

export function TravelersShowcase({
  photos,
  strings,
}: {
  photos: GalleryPhoto[];
  strings: TravelersShowcaseStrings;
}): JSX.Element | null {
  const reduced = usePrefersReducedMotion();
  const swiperRef = useRef<SwiperClass | null>(null);

  if (photos.length === 0) return null;
  const loop = photos.length > 3;

  return (
    <section className="section-shell" style={{ marginTop: "var(--section-margin)" }} aria-labelledby="travelers-heading">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-eyebrow text-rust">{strings.eyebrow}</p>
          <h2 id="travelers-heading" className="text-section-h2 text-ink">{strings.title}</h2>
          <p className="text-body mt-2 text-ink/80">{strings.blurb}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label={strings.prev}
            onClick={() => swiperRef.current?.slidePrev()}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-grey-300/70 bg-white text-ink hover:border-nile/50"
          >
            <Icon name="chevron" size={20} style={{ transform: "rotate(180deg)" }} />
          </button>
          <button
            type="button"
            aria-label={strings.next}
            onClick={() => swiperRef.current?.slideNext()}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-grey-300/70 bg-white text-ink hover:border-nile/50"
          >
            <Icon name="chevron" size={20} />
          </button>
        </div>
      </div>

      <Swiper
        modules={reduced ? [] : [Autoplay]}
        onSwiper={(s) => {
          swiperRef.current = s;
        }}
        slidesPerView={1.15}
        spaceBetween={16}
        loop={loop}
        autoplay={reduced ? false : { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        breakpoints={{ 640: { slidesPerView: 2.15, spaceBetween: 20 }, 1024: { slidesPerView: 3.15, spaceBetween: 24 } }}
        role="region"
        aria-roledescription="carousel"
        aria-label={strings.title}
      >
        {photos.map((photo) => (
          <SwiperSlide key={photo.src}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-nile/5">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 88vw"
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-6">
        <Link href="/gallery" className="pill pill--solid">
          {strings.cta}
          <Icon name="arrow-right" size={18} />
        </Link>
      </div>
    </section>
  );
}

export default TravelersShowcase;
