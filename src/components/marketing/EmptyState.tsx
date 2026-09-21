import Link from "next/link";
import { Compass } from "lucide-react";

export default function EmptyState({
  title,
  description,
  links,
}: {
  title: string;
  description: string;
  links?: { href: string; label: string }[];
}) {
  return (
    <div className="rounded-xl border border-dashed border-grey-300/70 bg-papyrus/50 p-8 text-center">
      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-nile/10 text-nile">
        <Compass size={18} />
      </span>
      <p className="mt-3 text-card-title font-semibold text-ink">{title}</p>
      <p className="mx-auto mt-1.5 max-w-sm text-meta text-ink/65">{description}</p>
      {links && links.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-nile/20 px-4 py-2 text-[13px] font-semibold text-nile transition-colors hover:border-rust hover:text-rust"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
