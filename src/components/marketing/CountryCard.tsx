import Image from "next/image";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { ArrowUpRight } from "lucide-react";

/**
 * Country card — presentational, brand-token styled. Counts are passed in
 * (computed once on the page) so this component stays data-source agnostic.
 */
export interface CountryCardData {
  slug: string;
  name: string;
  tagline: string;
  heroImage: string;
  cityCount: number;
  tourCount: number;
}

export default function CountryCard({ country }: { country: CountryCardData }) {
  const { cityCount, tourCount } = country;
  return (
    <Link
      href={`/countries/${country.slug}`}
      className="group relative block h-72 overflow-hidden rounded-xl transition-shadow duration-200 hover:shadow-[0_18px_44px_-24px_rgba(26,35,64,0.5)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nile"
    >
      <Image
        src={country.heroImage}
        alt={country.name}
        fill
        sizes="(min-width: 1024px) 30vw, 90vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-nile/85 via-nile/25 to-transparent" />

      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-nile">
        {tourCount > 0 ? `${tourCount} ${tourCount === 1 ? "tour" : "tours"}` : "Coming soon"}
      </span>

      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-trip-h3 font-semibold text-white">{country.name}</p>
          <p className="text-meta text-white/75">
            {cityCount > 0 ? `${cityCount} ${cityCount === 1 ? "city" : "cities"}` : country.tagline}
          </p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-nile transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
          <ArrowUpRight size={16} />
        </span>
      </div>
    </Link>
  );
}
