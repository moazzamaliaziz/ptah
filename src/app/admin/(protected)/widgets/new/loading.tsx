import type { JSX } from "react";
import AdminLoading from "@/components/admin/AdminLoading";

/** Navigation skeleton for new widget — shape-matched so nothing reflows on arrival. */
export default function Loading(): JSX.Element {
  return <AdminLoading variant="form" fields={7} />;
}
