import type { JSX } from "react";
import Link from "next/link";
import { requireCapability } from "@/server/auth/rbac";
import DestinationEditor from "../DestinationEditor";

export const dynamic = "force-dynamic";

export default async function NewDestinationPage(): Promise<JSX.Element> {
  await requireCapability("catalog.edit");
  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>New destination</h1>
            <p>Create a city or region. Link tours to it from each tour&apos;s editor.</p>
          </div>
          <Link className="admin-btn admin-btn--ghost" href="/admin/destinations">← All destinations</Link>
        </div>
      </div>
      <DestinationEditor />
    </>
  );
}
