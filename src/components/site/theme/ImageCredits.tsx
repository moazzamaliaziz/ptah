import type { ThemeImage } from "@/content/theme-media";

/**
 * On-page image attribution (server). Every photo is CC-licensed or public
 * domain, so creator + license + a link back to the Wikimedia Commons file
 * page is required. Collapsed by default via a native <details> so it never
 * competes with the editorial content.
 */
export default function ImageCredits({ images, summary }: { images: ThemeImage[]; summary: string }) {
  return (
    <details className="rounded-xl border border-grey-300/50 bg-papyrus/30 p-4">
      <summary className="cursor-pointer text-meta font-semibold text-ink/80">{summary}</summary>
      <ul className="mt-4 space-y-2 text-meta text-ink/60">
        {images.map((img) => (
          <li key={img.src}>
            <a href={img.credit.page} target="_blank" rel="noopener noreferrer" className="link-inline">
              {img.credit.title}
            </a>
            {" — "}
            {img.credit.creator}, {img.credit.license}
          </li>
        ))}
      </ul>
    </details>
  );
}
