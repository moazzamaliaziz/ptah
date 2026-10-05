/**
 * "Price per person by group size" (P8).
 *
 * The same table serves the tour detail page (plain price list) and the booking
 * form (the band matching the current party is highlighted, so the traveler
 * watches their rate drop as they add people). Presentational and hook-free, so
 * it renders in a Server Component and inside the client booking island alike.
 */
import type { JSX } from "react";
import { formatPriceCents } from "@/lib/utils";
import type { GroupPriceTier } from "@/server/booking-core";
import { resolveTierPriceCents } from "@/server/booking-core";

export interface GroupPriceTableLabels {
  heading: string;
  note: string;
  sizeColumn: string;
  priceColumn: string;
  /** "{min} traveler" — a band covering exactly one person. */
  single: string;
  /** "{min}–{max} travelers" — a closed band. */
  range: string;
  /** "{min}+ travelers" — the open-ended top band. */
  rangeOpen: string;
  /** Badge on the row matching the current party size. */
  activeBadge: string;
}

/** Human label for one band: "1 traveler", "3–4 travelers", "7+ travelers". */
export function tierRangeLabel(tier: GroupPriceTier, labels: GroupPriceTableLabels): string {
  if (tier.maxPax == null) return labels.rangeOpen.replace("{min}", String(tier.minPax));
  if (tier.maxPax === tier.minPax) return labels.single.replace("{min}", String(tier.minPax));
  return labels.range
    .replace("{min}", String(tier.minPax))
    .replace("{max}", String(tier.maxPax));
}

export default function GroupPriceTable({
  tiers,
  currency,
  labels,
  activePax,
  className,
}: {
  tiers: readonly GroupPriceTier[];
  currency: string;
  labels: GroupPriceTableLabels;
  /** Current party size; its band gets the "your rate" treatment. Omit on
   *  pages with no traveler picker (the tour detail page). */
  activePax?: number;
  className?: string;
}): JSX.Element | null {
  // A tour with no bands has a single flat price, already shown elsewhere on the
  // page — a one-row "table" would only add noise.
  if (tiers.length === 0) return null;

  const sorted = [...tiers].sort((a, b) => a.minPax - b.minPax);
  // Highlight by resolved PRICE, not by re-deriving the band here: that way the
  // row the customer sees marked is the row the server would actually charge,
  // even if two bands overlap.
  const activePrice =
    activePax == null ? null : resolveTierPriceCents(sorted, activePax);

  return (
    <div className={className}>
      <h3 className="text-card-title font-bold text-ink">{labels.heading}</h3>
      <p className="mt-1 text-meta text-ink/60">{labels.note}</p>
      <table className="mt-3 w-full border-collapse text-body">
        <thead>
          <tr className="border-b border-grey-300/60 text-left text-[11px] font-semibold uppercase tracking-wide text-ink/45">
            <th scope="col" className="py-2">{labels.sizeColumn}</th>
            <th scope="col" className="py-2 text-right">{labels.priceColumn}</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((tier) => {
            const active =
              activePrice != null &&
              activePax != null &&
              activePax >= tier.minPax &&
              (tier.maxPax == null || activePax <= tier.maxPax) &&
              tier.pricePerPersonCents === activePrice;
            return (
              <tr
                key={`${tier.minPax}-${tier.maxPax ?? "plus"}`}
                className={`border-b border-grey-300/40 last:border-0 ${active ? "bg-nile/5" : ""}`}
              >
                <td className="py-2.5 text-ink/80">
                  {tierRangeLabel(tier, labels)}
                  {active && (
                    <span className="ml-2 rounded-full bg-nile/10 px-2 py-0.5 text-[11px] font-semibold text-nile">
                      {labels.activeBadge}
                    </span>
                  )}
                </td>
                <td className={`py-2.5 text-right ${active ? "font-bold text-nile" : "font-semibold text-ink"}`}>
                  {formatPriceCents(tier.pricePerPersonCents, currency)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
