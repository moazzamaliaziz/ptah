import type { JSX } from "react";
import Link from "next/link";
import { requireCapability } from "@/server/auth/rbac";
import NewTourForm from "./NewTourForm";

export const dynamic = "force-dynamic";

export default async function NewTourPage(): Promise<JSX.Element> {
  await requireCapability("catalog.edit");
  return (
    <>
      <div className="admin-head">
        <div className="admin-row admin-row--between">
          <div>
            <h1>New tour</h1>
            <p>Start with the essentials. You&apos;ll add itinerary, departures and images next.</p>
          </div>
          <Link className="admin-btn admin-btn--ghost" href="/admin/tours">← All tours</Link>
        </div>
      </div>
      <NewTourForm />
    </>
  );
}
