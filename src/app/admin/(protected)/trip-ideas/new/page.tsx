import type { JSX } from "react";
import Link from "next/link";
import { requireCapability } from "@/server/auth/rbac";
import NewTripIdeaForm from "./NewTripIdeaForm";

export const dynamic = "force-dynamic";

export default async function NewTripIdeaPage(): Promise<JSX.Element> {
  await requireCapability("tripideas.edit");

  return (
    <>
      <div className="admin-head">
        <Link className="admin-btn admin-btn--ghost" href="/admin/trip-ideas">← All trip ideas</Link>
        <h1>New trip idea</h1>
        <p>Create the editorial intro first. Once saved, you can curate which tours it links to. It starts as a draft.</p>
      </div>
      <NewTripIdeaForm />
    </>
  );
}
