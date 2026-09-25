import type { ReactNode, JSX } from "react";
import Link from "next/link";
import { requireStaff, can } from "@/server/auth/rbac";
import { logoutAction } from "@/app/admin/actions";
import { countNewContactMessages } from "@/server/contact";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";
import AdminNav, { type AdminNavItem } from "./AdminNav";
import AdminLocaleSwitcher from "@/components/admin/AdminLocaleSwitcher";
import { MediaPickerLabelsProvider } from "@/components/admin/MediaPickerLabels";
import SubmitButton from "@/components/admin/SubmitButton";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }): Promise<JSX.Element> {
  const user = await requireStaff();
  const locale = await getAdminLocale();
  const dict = getAdminDict(locale);
  const t = dict.nav;

  // Unread-enquiry badge for the nav (only queried when the user can see it).
  const newEnquiries = can(user, "enquiries.view") ? await countNewContactMessages() : 0;

  const items: AdminNavItem[] = [{ href: "/admin", label: t.dashboard }];
  if (can(user, "bookings.view")) items.push({ href: "/admin/bookings", label: t.orders });
  if (can(user, "reports.view")) items.push({ href: "/admin/reports", label: t.reports });
  if (can(user, "coupons.view")) items.push({ href: "/admin/coupons", label: t.coupons });
  if (can(user, "content.view")) items.push({ href: "/admin/content", label: t.content });
  if (can(user, "content.view")) items.push({ href: "/admin/translations", label: t.translations });
  if (can(user, "catalog.view")) items.push({ href: "/admin/tours", label: t.tours });
  if (can(user, "catalog.view")) items.push({ href: "/admin/destinations", label: t.destinations });
  if (can(user, "events.view")) items.push({ href: "/admin/events", label: t.events });
  if (can(user, "tripideas.view")) items.push({ href: "/admin/trip-ideas", label: t.tripIdeas });
  if (can(user, "enquiries.view")) {
    items.push({
      href: "/admin/enquiries",
      label: newEnquiries > 0 ? `${t.enquiries} (${newEnquiries})` : t.enquiries,
    });
  }
  if (can(user, "media.view")) items.push({ href: "/admin/media", label: t.media });
  if (can(user, "branding.view")) items.push({ href: "/admin/branding", label: t.branding });
  if (can(user, "widgets.view")) items.push({ href: "/admin/widgets", label: t.widgets });
  if (can(user, "toggles.view")) items.push({ href: "/admin/toggles", label: t.toggles });
  if (can(user, "integrations.view")) items.push({ href: "/admin/integrations", label: t.integrations });

  return (
    <div className="admin-shell">
      <a className="admin-skip-link" href="#admin-main">{dict.chrome.skipToContent}</a>
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          Ptah Tours
          <small>{dict.chrome.adminPanel}</small>
        </div>
        {/* Mobile-only "Menu" disclosure: a hidden checkbox + its <label> toggle
            the .admin-nav-collapse wrapper below (≤768px). On desktop the toggle
            is hidden and the wrapper is just the flex column that fills the rail,
            so the sidebar layout + bottom-pinned sign-out are unchanged. */}
        <input type="checkbox" id="admin-nav-toggle" className="admin-nav-toggle" />
        <label htmlFor="admin-nav-toggle" className="admin-nav-toggle__label">{dict.chrome.menu}</label>
        <div className="admin-nav-collapse">
          <AdminNav items={items} navLabel={dict.chrome.navLabel} />
          <Link
            href="/"
            target="_blank"
            rel="noopener"
            className="admin-nav-link"
            style={{ marginTop: "0.5rem", opacity: 0.85 }}
          >
            {dict.chrome.viewLiveSite} ↗
          </Link>
          <div className="admin-sidebar__spacer" />
          <AdminLocaleSwitcher current={locale} label={dict.chrome.language} />
          <div className="admin-sidebar__user">
            <div>{user.name}</div>
            <div style={{ opacity: 0.7 }}>{user.email}</div>
            <div style={{ marginTop: "0.15rem" }}>{user.role}</div>
          </div>
          <form action={logoutAction} style={{ marginTop: "0.5rem" }}>
            <SubmitButton className="admin-btn admin-btn--ghost" pendingLabel={dict.chrome.signingOut} style={{ width: "100%", color: "#fff", borderColor: "rgba(255,255,255,0.3)" }}>
              {dict.chrome.signOut}
            </SubmitButton>
          </form>
        </div>
      </aside>
      <main className="admin-main" id="admin-main" tabIndex={-1}>
        <MediaPickerLabelsProvider labels={dict.mediaPicker}>{children}</MediaPickerLabelsProvider>
      </main>
    </div>
  );
}
