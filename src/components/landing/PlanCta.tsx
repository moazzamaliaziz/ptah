/**
 * Section 3.3 — "Plan Your Dream Trip" full-bleed CTA (design.md §3.3).
 *
 * RSC: static markup; the only motion is the house pill hover (CSS).
 * Crop set §1.4.2: 1095/1620 -> 1562/847 (>=744) -> 1988/1078 (>=1440).
 * Analytics hook (§7.5 vocabulary): data-ptah-type / data-ptah-value.
 */
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import type { JSX } from "react";
import MultiCropImage from "@/components/site/MultiCropImage";
import type { PlanCtaBlock } from "@/content/landing";

export function PlanCta({ block }: { block: PlanCtaBlock }): JSX.Element {
  const href =
    block.cta.type === "customButton" ? block.cta.button.href : block.cta.link.href;
  const label = block.cta.type === "customButton" ? block.cta.label : block.cta.link.label;
  const analytics =
    block.cta.type === "customButton"
      ? { type: "customButton", value: "tripCreateButton" }
      : { type: "link", value: "tripCreateLink" };

  return (
    <section
      className="fwcta section-shell"
      style={{ marginTop: "var(--section-margin-cta)" }}
      aria-labelledby="fwcta-heading"
    >
      <figure className="fwcta__figure">
        <MultiCropImage
          src={block.image.src}
          alt={block.image.alt}
          ratio={{ w: 1095, h: 1620 }}
          mid={{ src: block.image.mid ?? block.image.src, ratio: { w: 1562, h: 847 } }}
          wide={{
            src: block.image.wide ?? block.image.mid ?? block.image.src,
            ratio: { w: 1988, h: 1078 },
          }}
          wideAt={1440}
          sizes="(min-width: 130em) 1920px, (min-width: 70.5em) calc(100vw - 148px), (min-width: 46.5em) calc(100vw - 80px), calc(100vw - 36px)"
          className="fwcta__media"
          imgClassName="fwcta__img"
        />
        {/* uniform 30% black scrim across the image (§3.3.1) */}
        <span className="fwcta__scrim" aria-hidden="true" />
      </figure>

      <div className="fwcta__overlay">
        <h2 id="fwcta-heading" className="fwcta__h2 text-fwcta-h2">
          {block.title}
        </h2>
        <div className="fwcta__copywrap">
          <p className="fwcta__copy text-cta-copy">{block.copy}</p>
        </div>
        <Link
          className="pill fwcta__cta text-btn"
          href={href}
          data-ptah-type={analytics.type}
          data-ptah-value={analytics.value}
        >
          {label}
        </Link>
      </div>

      <figcaption className="fwcta__credit text-meta">
        Image attribution: {block.credit}
      </figcaption>
    </section>
  );
}

export default PlanCta;