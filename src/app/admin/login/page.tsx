import type { JSX } from "react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/server/auth/session";
import { isStaff } from "@/server/auth/rbac";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";
import { loginAction } from "./actions";
import SubmitButton from "@/components/admin/SubmitButton";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}): Promise<JSX.Element> {
  // Already signed in as staff → skip the form.
  const current = await getSessionUser();
  if (current && isStaff(current)) redirect("/admin");

  const t = getAdminDict(await getAdminLocale()).auth;
  const errors: Record<string, string> = { invalid: t.errInvalid, rate: t.errRate };

  const { error, from } = await searchParams;
  const message = error ? errors[error] ?? t.errGeneric : null;
  const safeFrom = typeof from === "string" && from.startsWith("/admin") && !from.startsWith("//") && !from.includes("\\") ? from : "/admin";

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <h1>{t.loginTitle}</h1>
        <p>{t.loginSubtitle}</p>
        {message ? (
          <div className="admin-alert admin-alert--error" role="alert">
            {message}
          </div>
        ) : null}
        <form action={loginAction}>
          <input type="hidden" name="from" value={safeFrom} />
          <label className="admin-field">
            <span>{t.email}</span>
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
            <span>{t.password}</span>
            <input
              className="admin-input"
              type="password"
              name="password"
              autoComplete="current-password"
              required
            />
          </label>
          <SubmitButton pendingLabel={t.signingIn} style={{ width: "100%", marginTop: "0.5rem" }}>
            {t.signIn}
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}
