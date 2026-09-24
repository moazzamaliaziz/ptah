import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-warm-gray">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight size={12} className="text-border" aria-hidden />}
          {item.href ? (
            <Link href={item.href} className="hover:text-burgundy">
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="text-charcoal">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
