import type { JSX } from "react";
import AdminLoading from "@/components/admin/AdminLoading";

/** Navigation skeleton for records to translate — shape-matched so nothing reflows on arrival. */
export default function Loading(): JSX.Element {
  return <AdminLoading variant="table" rows={8} cols={4} />;
}
