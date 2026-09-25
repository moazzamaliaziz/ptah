"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { JSX } from "react";

export interface AdminNavItem {
  href: string;
  label: string;
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
          </Link>
        );
      })}
    </nav>
  );
}
