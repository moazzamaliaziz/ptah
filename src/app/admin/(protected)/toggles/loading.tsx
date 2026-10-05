import type { JSX } from "react";
import AdminLoading from "@/components/admin/AdminLoading";

/** Navigation skeleton for site toggles — shape-matched so nothing reflows on arrival. */
export default function Loading(): JSX.Element {
  return <AdminLoading variant="cards" cards={6} />;
}
