import type { JSX } from "react";
import Skeleton from "@/components/ui/Skeleton";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";

/* Stable keys for the placeholder tiles (no array-index keys). */
const TILE_KEYS = ["a", "b", "c"] as const;

/**
 * Admin loading state — shown while a protected admin page streams (the
 * layout's requireStaff() has already resolved by the time this renders).
 * Neutral heading + stat-tile skeletons; Tailwind utilities resolve app-wide.
 */
export default async function AdminLoading(): Promise<JSX.Element> {
  const t = getAdminDict(await getAdminLocale()).common;
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{t.loading}</span>
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-6 h-4 w-full max-w-xl" />
      <Skeleton className="mt-2 h-4 w-2/3 max-w-lg" />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TILE_KEYS.map((k) => (
          <Skeleton key={k} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
