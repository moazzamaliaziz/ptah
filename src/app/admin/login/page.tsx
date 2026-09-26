import type { JSX } from "react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/server/auth/session";
import { isStaff } from "@/server/auth/rbac";
import { getAdminLocale } from "@/server/admin/locale";
import { getAdminDict } from "@/i18n/admin/dictionary";
import { getSettings } from "@/server/settings";
import { playfair } from "@/lib/fonts";
import { loginAction } from "./actions";
import SubmitButton from "@/components/admin/SubmitButton";
import PasswordField from "@/components/admin/PasswordField";
import AdminInstallButton from "@/components/admin/AdminInstallButton";
import AdminLocaleSwitcher from "@/components/admin/AdminLocaleSwitcher";

/**
 * Admin sign-in (redesign). Split-screen editorial layout: a full-bleed brand
 * hero on one side, the sign-in panel on the other, collapsing to a single
 * column with a slim hero band on small screens. Purely presentational — the
 * form still posts to the same `loginAction`, the field names (`email`,
 * `password`, `from`) are unchanged, and the rate-limit/credential logic in
 * actions.ts is untouched. Copy is localized (English/Arabic) via the admin
 * dictionary, and the footer carries the language switcher plus the PWA
 * "install the admin app" entry point.
 */
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; from?: string }>;
}): Promise<JSX.Element> {
  // Already signed in as staff → skip the form.
  const current = await getSessionUser();
  if (current && isStaff(current)) redirect("/admin");

  const locale = await getAdminLocale();
  const t = getAdminDict(locale).auth;
  const settings = await getSettings();
  const siteName = settings["branding.siteName"];

  const errors: Record<string, string> = { invalid: t.errInvalid, rate: t.errRate };
  const { error, from } = await searchParams;
  const message = error ? errors[error] ?? t.errGeneric : null;
  const safeFrom =
    typeof from === "string" && from.startsWith("/admin") && !from.startsWith("//") && !from.includes("\\")
      ? from
      : "/admin";

  return (
    <div className={`admin-login ${playfair.variable}`}>
      {/* LEFT — brand hero. Decorative image (the headline carries the meaning),
          so alt="" keeps it out of the accessibility tree. */}
      <section className="admin-login__hero" aria-hidden="true">
        <Image
          className="admin-login__hero-img"
          src="/assets/hero/hero-giza-portrait.webp"
          alt=""
          fill
          priority
          sizes="(max-width: 900px) 100vw, 52vw"
        />
        <div className="admin-login__hero-overlay" />
        <div className="admin-login__hero-copy">
          <p className="admin-login__hero-title">
            {t.heroHeadline}
            <br />
            <em>{t.heroHeadlineItalic}</em>
          </p>
          <p className="admin-login__hero-sub">{t.heroSubtitle}</p>
        </div>
      </section>

      {/* RIGHT — sign-in panel. */}
      <section className="admin-login__panel">
        <div className="admin-login__panel-inner">
          <div className="admin-login__brand">
            <span className="admin-login__brand-name">{siteName}</span>
            <span className="admin-login__brand-kicker">{t.brandKicker}</span>
          </div>

          <h1 className="admin-login__welcome">{t.welcomeBack}</h1>
          <p className="admin-login__lede">{t.loginLede}</p>

          {message ? (
            <div className="admin-alert admin-alert--error" role="alert">
              {message}
            </div>
          ) : null}

          <form action={loginAction} className="admin-login__form">
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

            <PasswordField label={t.password} showLabel={t.showPassword} hideLabel={t.hidePassword} />

            <SubmitButton
              className="admin-btn admin-login__submit"
              pendingLabel={t.signingIn}
            >
              <span>{t.signIn}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12h14m0 0-5.5-5.5M19 12l-5.5 5.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </SubmitButton>
          </form>

          <div className="admin-login__footer">
            <div className="admin-login__lang">
              <span className="admin-login__globe" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                  <path
                    d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9S14.5 18.5 12 21C9.5 18.5 8.2 15.3 8.2 12S9.5 5.5 12 3Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <AdminLocaleSwitcher current={locale} label={t.langSwitchLabel} />
            </div>
            <AdminInstallButton label={t.installApp} iosHint={t.installIosHint} menuHint={t.installMenuHint} />
          </div>
        </div>
      </section>
    </div>
  );
}
