import type { JSX } from "react";
import AdminLoading from "@/components/admin/AdminLoading";

/**
 * Fallback for the dashboard, and the backstop for any admin route that has no
 * `loading.tsx` of its own. Shaped like the dashboard (KPI strip, revenue
 * cards, recent-orders table) because that is what it covers; routes with a
 * different shape declare their own, so they no longer inherit KPI tiles they
 * will never render.
 */
export default function AdminDashboardLoading(): JSX.Element {
  return <AdminLoading variant="dashboard" cards={3} />;
}
