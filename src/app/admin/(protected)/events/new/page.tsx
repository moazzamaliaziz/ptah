import type { JSX } from "react";
import Link from "next/link";
import { requireCapability } from "@/server/auth/rbac";
import NewEventForm from "./NewEventForm";

export const dynamic = "force-dynamic";

export default async function NewEventPage(): Promise<JSX.Element> {
  await requireCapability("events.edit");

  return (
    <>
      <div className="admin-head">
        <Link className="admin-btn admin-btn--ghost" href="/admin/events">← All events</Link>
        <h1>New event</h1>
        <p>Create a cultural event or festival. It starts as a draft — publish it from the editor when ready.</p>
      </div>
      <NewEventForm />
    </>
  );
}
