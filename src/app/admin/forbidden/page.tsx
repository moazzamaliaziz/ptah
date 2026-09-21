import type { JSX } from "react";
import Link from "next/link";
import { logoutAction } from "@/app/admin/actions";

export default function AdminForbiddenPage(): JSX.Element {
  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <h1>Access denied</h1>
        <p>Your account doesn&rsquo;t have permission to view this area.</p>
        <div className="admin-row">
          <Link className="admin-btn admin-btn--ghost" href="/">
            Back to site
          </Link>
          <form action={logoutAction}>
            <button className="admin-btn" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
