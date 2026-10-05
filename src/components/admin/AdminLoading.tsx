import type { JSX } from "react";
import Skeleton from "@/components/ui/Skeleton";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";

/**
 * Shared loading skeletons for the admin area.
 *
 * Every admin route is `force-dynamic` — it reads the session cookie and the
 * DB on each request — so a click on a nav item cannot be served from a cache
 * and there is always a round trip before the page can paint. What makes that
 * *feel* slow is having nothing to look at in the meantime: the browser sits on
 * the previous screen with no sign that anything is happening.
 *
 * A route-level `loading.tsx` is Next's Suspense fallback for that navigation
 * and renders the instant the link is clicked, so the response time stops being
 * dead time. The point is for the placeholder to match the shape of what is
 * coming — a table where a table will appear, a form where a form will — so the
 * layout does not jump when the real content swaps in. One generic skeleton for
 * every route (what the admin had: three KPI tiles, correct only on the
 * dashboard) reflows on arrival, which reads as slower than no skeleton at all.
 *
 * `variant` picks the shape; each route's `loading.tsx` is a two-line wrapper
 * that names its own. Decorative only — the Skeletons are aria-hidden and this
 * component owns the single `role="status"` announcement.
 */
export type AdminLoadingVariant = "table" | "form" | "cards" | "detail" | "dashboard";

/* Stable keys — never array indices (lint rule + React reconciliation). */
const KEYS = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l"] as const;
const take = (n: number): readonly string[] => KEYS.slice(0, Math.min(n, KEYS.length));

function Head(): JSX.Element {
  return (
    <div className="admin-head">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-3 h-4 w-full max-w-xl" />
    </div>
  );
}

/** Table rows, sized to the real column count so the header row lines up. */
function TableBody({ rows, cols }: { rows: number; cols: number }): JSX.Element {
  return (
    <div className="admin-card" style={{ padding: 0 }}>
      <table className="admin-table">
        <tbody>
          {take(rows).map((r) => (
            <tr key={r}>
              {take(cols).map((c) => (
                <td key={c}>
                  <Skeleton className="h-4 w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FormBody({ fields }: { fields: number }): JSX.Element {
  return (
    <div className="admin-card">
      {take(fields).map((k) => (
        <div key={k} style={{ marginBottom: "1.1rem" }}>
          <Skeleton className="h-3 w-32" />
          <Skeleton className="mt-2 h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-40" />
    </div>
  );
}

function CardsBody({ cards }: { cards: number }): JSX.Element {
  return (
    <div className="admin-grid">
      {take(cards).map((k) => (
        <div key={k} className="admin-card">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-3 h-8 w-20" />
          <Skeleton className="mt-3 h-3 w-full" />
        </div>
      ))}
    </div>
  );
}

export default async function AdminLoading({
  variant,
  rows = 6,
  cols = 5,
  fields = 5,
  cards = 6,
}: {
  variant: AdminLoadingVariant;
  /** `table`: placeholder row count. */
  rows?: number;
  /** `table`: column count — match the real table so nothing shifts. */
  cols?: number;
  /** `form`/`detail`: number of label+input pairs. */
  fields?: number;
  /** `cards`/`dashboard`: number of card placeholders. */
  cards?: number;
}): Promise<JSX.Element> {
  const t = getAdminDict(await getAdminLocale()).common;
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{t.loading}</span>
      <Head />
      {variant === "table" ? <TableBody rows={rows} cols={cols} /> : null}
      {variant === "form" ? <FormBody fields={fields} /> : null}
      {variant === "cards" ? <CardsBody cards={cards} /> : null}
      {variant === "detail" ? (
        <>
          <CardsBody cards={2} />
          <div style={{ marginTop: "1.25rem" }}>
            <FormBody fields={fields} />
          </div>
        </>
      ) : null}
      {variant === "dashboard" ? (
        <>
          <section className="admin-kpis">
            {take(4).map((k) => (
              <div key={k} className="admin-kpi">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="mt-2 h-7 w-16" />
              </div>
            ))}
          </section>
          <div style={{ marginTop: "1.5rem" }}>
            <CardsBody cards={cards} />
          </div>
          <div style={{ marginTop: "1.5rem" }}>
            <TableBody rows={5} cols={6} />
          </div>
        </>
      ) : null}
    </div>
  );
}
