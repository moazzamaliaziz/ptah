import type { JSX } from "react";
import { countNewContactMessages } from "@/server/contact";

/**
 * Unread-enquiry count for the sidebar link, as its own async component so it
 * can be streamed.
 *
 * It used to be interpolated straight into the nav label in the layout, which
 * meant the ENTIRE admin shell — sidebar, user block, and the page rendered
 * inside <main> — was blocked behind a COUNT query that nothing on screen
 * depends on. Wrapped in <Suspense> by the layout, the shell paints on the
 * session read alone and the number arrives a moment later.
 *
 * Returns null when there is nothing unread (no "(0)" noise), and on a DB error
 * — a nav badge must never take the panel down.
 */
export default async function EnquiryBadge({ label }: { label: string }): Promise<JSX.Element | null> {
  let count = 0;
  try {
    count = await countNewContactMessages();
  } catch {
    return null;
  }
  if (count <= 0) return null;
  return (
    <span className="admin-nav-link__badge" aria-label={`${count} ${label}`}>
      {count}
    </span>
  );
}
