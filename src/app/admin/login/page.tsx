import type { JSX } from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/server/auth/session";
import { isStaff } from "@/server/auth/rbac";
import { loginAction } from "./actions";
import SubmitButton from "@/components/admin/SubmitButton";

const ERRORS: Record<string, string> = {
  invalid: "Incorrect email or password.",
  rate: "Too many attempts. Please wait a minute and try again.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}): Promise<JSX.Element> {
  // Already signed in as staff → skip the form.
  const current = await getSessionUser();
  if (current && isStaff(current)) redirect("/admin");

  const { error, from } = await searchParams;
  const message = error ? ERRORS[error] ?? "Sign-in failed." : null;
  const safeFrom = typeof from === "string" && from.startsWith("/admin") && !from.startsWith("//") && !from.includes("\\") ? from : "/admin";

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <h1>Ptah Admin</h1>
        <p>Sign in to manage the platform.</p>
        {message ? (
          <div className="admin-alert admin-alert--error" role="alert">
            {message}
          </div>
        ) : null}
        <form action={loginAction}>
          <input type="hidden" name="from" value={safeFrom} />
          <label className="admin-field">
            <span>Email</span>
            <input
              className="admin-input"
              type="email"
              name="email"
              autoComplete="username"
              required
              autoFocus
            />
          </label>
          <label className="admin-field">
            <span>Password</span>
            <input
              className="admin-input"
              type="password"
              name="password"
              autoComplete="current-password"
              required
            />
          </label>
          <SubmitButton pendingLabel="Signing in…" style={{ width: "100%", marginTop: "0.5rem" }}>
            Sign in
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
