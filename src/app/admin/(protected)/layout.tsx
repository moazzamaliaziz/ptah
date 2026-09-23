import type { ReactNode, JSX } from "react";
import Link from "next/link";
import { requireStaff, can } from "@/server/auth/rbac";
import { logoutAction } from "@/app/admin/actions";
import { countNewContactMessages } from "@/server/contact";
import AdminNav, { type AdminNavItem } from "./AdminNav";
import SubmitButton from "@/components/admin/SubmitButton";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }): Promise<JSX.Element> {
  const user = await requireStaff();

  // Unread-enquiry badge for the nav (only queried when the user can see it).
  const newEnquiries = can(user, "enquiries.view") ? await countNewContactMessages() : 0;

  const items: AdminNavItem[] = [{ href: "/admin", label: "Dashboard" }];
  if (can(user, "bookings.view")) items.push({ href: "/admin/bookings", label: "Orders" });
  if (can(user, "content.view")) items.push({ href: "/admin/content", label: "Content (CMS)" });
  if (can(user, "catalog.view")) items.push({ href: "/admin/tours", label: "Tours" });
  if (can(user, "catalog.view")) items.push({ href: "/admin/destinations", label: "Destinations" });
  if (can(user, "events.view")) items.push({ href: "/admin/events", label: "Events" });
  if (can(user, "tripideas.view")) items.push({ href: "/admin/trip-ideas", label: "Trip ideas" });
  if (can(user, "enquiries.view")) {
    items.push({ href: "/admin/enquiries", label: newEnquiries > 0 ? `Enquiries (${newEnquiries})` : "Enquiries" });
  }
  if (can(user, "media.view")) items.push({ href: "/admin/media", label: "Media library" });
  if (can(user, "branding.view")) items.push({ href: "/admin/branding", label: "Branding" });
  if (can(user, "widgets.view")) items.push({ href: "/admin/widgets", label: "Floating widgets" });
  if (can(user, "toggles.view")) items.push({ href: "/admin/toggles", label: "Site toggles" });
  if (can(user, "integrations.view")) items.push({ href: "/admin/integrations", label: "Integrations" });

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          Ptah Tours
          <small>Admin panel</small>
        </div>
        <AdminNav items={items} />
        <Link
          href="/"
          target="_blank"
          rel="noopener"
          className="admin-nav-link"
          style={{ marginTop: "0.5rem", opacity: 0.85 }}
        >
          View live site ↗
        </Link>
        <div className="admin-sidebar__spacer" />
        <div className="admin-sidebar__user">
          <div>{user.name}</div>
          <div style={{ opacity: 0.7 }}>{user.email}</div>
          <div style={{ marginTop: "0.15rem" }}>{user.role}</div>
        </div>
        <form action={logoutAction} style={{ marginTop: "0.5rem" }}>
          <SubmitButton className="admin-btn admin-btn--ghost" pendingLabel="Signing out…" style={{ width: "100%", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>
            Sign out
          </SubmitButton>
        </form>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
