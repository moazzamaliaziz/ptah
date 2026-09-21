import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./admin.css";

/* The whole admin area is dynamic (reads cookies/DB, never cached) and must
   never be indexed. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return children;
}
