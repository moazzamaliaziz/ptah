import type { JSX } from "react";
import AdminLoading from "@/components/admin/AdminLoading";

/** Navigation skeleton for order list — shape-matched so nothing reflows on arrival. */
export default function Loading(): JSX.Element {
  return <AdminLoading variant="table" rows={8} cols={9} />;
}
