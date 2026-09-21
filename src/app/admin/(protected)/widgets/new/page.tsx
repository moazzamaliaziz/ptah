import type { JSX } from "react";
import Link from "next/link";
import { requireCapability } from "@/server/auth/rbac";
import WidgetEditor from "../WidgetEditor";

export const dynamic = "force-dynamic";

export default async function NewWidgetPage(): Promise<JSX.Element> {
  await requireCapability("widgets.edit");
  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div><h1>New widget</h1><p>Add a floating contact button.</p></div>
          <Link className="admin-btn admin-btn--ghost" href="/admin/widgets">← All widgets</Link>
        </div>
      </div>
      <WidgetEditor />
    </>
  );
}
