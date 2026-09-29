import Icon, { type IconName } from "@/components/ui/Icon";

interface TrustItem {
  icon: IconName;
  title: string;
  body: string;
}

/**
 * Three generic, defensible reasons-to-book value props (server component).
 *
 * Deliberately free of numbers we cannot substantiate — no ratings, review
 * counts, or cancellation windows. Each claim is true of the operator as a
 * whole (licensed local guides, private/group formats, secure online
 * checkout), so it holds on every city page without invented specifics.
 */
const ITEMS: TrustItem[] = [
  {
    icon: "user",
    title: "Guided by local experts",
    body: "Licensed Egyptologists and local guides who know the story behind every site.",
  },
  {
    icon: "ticket",
    title: "Private & group options",
    body: "Travel privately or join a small group — at the pace and budget that suit you.",
  },
  {
    icon: "info",
    title: "Secure online booking",
    body: "Reserve online with clear, up-front pricing and an encrypted checkout.",
  },
];

export default function CityTrustBar() {
  return (
    <section className="rounded-2xl border border-grey-300/50 bg-papyrus/40 p-6 sm:p-8">
      <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {ITEMS.map((item) => (
          <li key={item.title} className="flex gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-nile shadow-sm">
              <Icon name={item.icon} size={20} />
            </span>
            <div>
              <p className="text-card-title font-semibold text-ink">{item.title}</p>
              <p className="mt-1 text-meta leading-relaxed text-ink/65">{item.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
