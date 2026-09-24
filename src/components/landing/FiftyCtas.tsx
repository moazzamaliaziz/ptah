/**
 * Section 3.4 — 50/50 CTA pair (design.md §3.4).
 *
 * RSC: static. Grid 6col (stacked) -> 12col 2-up @744; radius 8->12 via
 * --radius-step; dual scrims 57.18% top / 20.7% bottom; content padded 8%/6.9%
 * of the card; pill pinned to the card bottom via margin-top:auto.
 * Media hover zoom uses the --card-image-scale contract (§4.8.7).
 */
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import type { JSX } from "react";
import MultiCropImage from "@/components/site/MultiCropImage";
import type { FiftyCta } from "@/content/landing";

function slugValue(href: string): string {
  const tail = href.split("/").filter(Boolean).pop() ?? href;
  return tail.replace(/[^a-z0-9-]/gi, "").toLowerCase() || "fiftyCta";
}

export function FiftyCtas({ items }: { items: readonly [FiftyCta, FiftyCta] }): JSX.Element {
  return (
    <ul className="fifty section-shell" style={{ marginTop: "var(--section-margin)" }}>
      {items.map((item) => (
        <li className="fifty__item" key={item.title}>
          <div className="fifty-card">
            <div className="fifty-card__media">
              <MultiCropImage
                src={item.image.src}
                alt={item.image.alt}
                ratio={{ w: 728, h: 980 }}
                mid={{ src: item.image.mid ?? item.image.src, ratio: { w: 1396, h: 1420 } }}
                wide={{
                  src: item.image.wide ?? item.image.mid ?? item.image.src,
                  ratio: { w: 1396, h: 1420 },
                }}
                wideAt={1128}
                sizes="(min-width: 744px) 50vw, 100vw"
                className="fifty-card__mci"
                imgClassName="card-zoom"
              />
            </div>
            <span className="fifty-card__scrim fifty-card__scrim--top" aria-hidden="true" />
            <span className="fifty-card__scrim fifty-card__scrim--bottom" aria-hidden="true" />
            <div className="fifty-card__content">
              <h2 className="fifty-card__h2 text-section-h2">{item.title}</h2>
              <p className="fifty-card__copy">{item.copy}</p>
              <Link
                className="pill fifty-card__cta"
                href={item.cta.href}
                data-ptah-type="link"
                data-ptah-value={slugValue(item.cta.href)}
              >
                {item.cta.label}
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default FiftyCtas;