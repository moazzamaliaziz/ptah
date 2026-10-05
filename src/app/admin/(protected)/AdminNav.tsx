"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { JSX, ReactNode } from "react";

export interface AdminNavItem {
  href: string;
  label: string;
  /**
   * Optional server-rendered trailing content (the unread-enquiry count).
   * Taken as a node rather than a number so the layout can hand over a
   * <Suspense> boundary: the link renders immediately and the count streams in
   * when its query resolves, instead of the whole sidebar waiting on it.
   */
  badge?: ReactNode;
}

/** Sidebar nav with active-item highlighting. Links are pre-filtered by
    capability on the server; this only owns aria-current. */
export default function AdminNav({ items, navLabel }: { items: AdminNavItem[]; navLabel: string }): JSX.Element {
  const pathname = usePathname();
  return (
    <nav aria-label={navLabel} style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
      {items.map((item) => {
        const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="admin-nav-link"
            aria-current={active ? "page" : undefined}
          >
            {item.label}
            {item.badge}
          </Link>
        );
      })}
    </nav>
  );
}
