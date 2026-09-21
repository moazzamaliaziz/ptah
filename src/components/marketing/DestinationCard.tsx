import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * Destination (city) card — presentational, brand-token styled. Self-contained
 * props (no mock-data type import); the whole card links to the city page.
 */
export interface DestinationCardData {
  slug: string;
  country: string;
  city: string;
  tourCount: number;
  image: string;
}

export default function DestinationCard({
  destination,
  className = "",
}: {
  destination: DestinationCardData;
  className?: string;
}) {
  const { tourCount } = destination;
  return (
    <Link
      href={`/cities/${destination.slug}`}
      className={`group relative block overflow-hidden rounded-xl transition-shadow duration-200 hover:shadow-[0_18px_44px_-24px_rgba(26,35,64,0.5)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nile ${className}`}
    >
      <Image
        src={destination.image}
        alt={`${destination.city}, ${destination.country}`}
        fill
        sizes="(min-width: 1024px) 40vw, 90vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-nile/85 via-nile/25 to-transparent" />

      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-nile">
        {tourCount > 0 ? `${tourCount} ${tourCount === 1 ? "tour" : "tours"}` : "Explore"}
      </span>

      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gold">
            {destination.country}
          </p>
          <p className="text-trip-h3 font-semibold text-white">{destination.city}</p>
          <p className="text-meta text-white/75">
            {tourCount > 0 ? "View tours" : "Guides coming soon"}
          </p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-nile transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
          <ArrowUpRight size={16} />
        </span>
      </div>
    </Link>
  );
}
