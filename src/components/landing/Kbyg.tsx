/**
 * Section 3.5 — "Know Before You Go" (design.md §3.5).
 *
 * RSC: static. 2-up (span 3 of 6) -> 4-up (span 3 of 12) @744 — never 1-col;
 * cards 160px tall -> 220px @1128; copy + inline CTA hidden below 1128
 * (display switch, per §3.5.2). The >=1128 hover choreography (sand bg,
 * pre-shifted icon+title block, delayed paragraph reveal, arrow pseudo) is
 * CSS-only and also fires on :focus-within for keyboard parity (§6.4 A-6,
 * §6.1 hover/focus parity).
 */
import Link from "next/link";
import type { JSX } from "react";
import Icon from "@/components/ui/Icon";
import type { KbygItem } from "@/content/landing";

export function Kbyg({ items }: { items: readonly [KbygItem, KbygItem, KbygItem, KbygItem] }): JSX.Element {
  return (
    <section
      className="kbyg section-shell"
      style={{ marginTop: "var(--section-margin)" }}
      aria-labelledby="kbyg-heading"
    >
      <h2 id="kbyg-heading" className="kbyg__h2 text-kbyg-h2">
        Know Before You Go
      </h2>
      <ul className="kbyg__grid">
        {items.map((item) => (
          <li className="kbyg-card" key={item.title}>
            <div className="kbyg-card__inner">
              <div className="kbyg-card__head">
                <Icon name={item.iconKey} size={28} className="kbyg-card__icon" />
                <h3 className="kbyg-card__title text-card-title">{item.title}</h3>
              </div>
              <p className="kbyg-card__copy">{item.copy}</p>
              <Link
                className="kbyg-card__cta link-inline"
                href={item.cta.href}
                data-ptah-type="link"
                data-ptah-value={item.cta.href.replace(/^\//, "")}
              >
                {item.cta.label}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Kbyg;