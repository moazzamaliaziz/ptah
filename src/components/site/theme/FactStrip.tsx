import Icon from "@/components/ui/Icon";
import type { FactItem } from "@/content/theme-content";

/**
 * At-a-glance fact cards (server). A responsive row of icon + value + label
 * tiles used at the top of every theme page for quick orientation.
 */
export default function FactStrip({ facts }: { facts: FactItem[] }) {
  return (
    <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {facts.map((f, i) => (
        <div key={i} className="rounded-2xl border border-grey-300/50 bg-papyrus/40 p-5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-nile/5 text-nile">
            <Icon name={f.icon} size={20} />
          </span>
          <dd className="mt-3 text-trip-h3 font-bold text-ink">{f.value}</dd>
          <dt className="mt-1 text-meta text-ink/65">{f.label}</dt>
        </div>
      ))}
    </dl>
  );
}
