import type { JSX } from "react";
import AdminLoading from "@/components/admin/AdminLoading";

/** Navigation skeleton for event editor — shape-matched so nothing reflows on arrival. */
export default function Loading(): JSX.Element {
  return <AdminLoading variant="detail" fields={6} />;
}
