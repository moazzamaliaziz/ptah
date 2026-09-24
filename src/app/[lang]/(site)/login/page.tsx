import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import LoginForm from "@/components/account/LoginForm";
import { getSessionUser } from "@/server/auth/session";
import { getToggle } from "@/server/toggles";
import { localizePath } from "@/i18n/routing";
import { toLocale } from "@/i18n/config";
import { getPageContent } from "@/i18n/pages";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Log in | Ptah Tours",
  robots: { index: false, follow: false },
};

function safeFrom(v: string | undefined): string | undefined {
  if (v && v.startsWith("/") && !v.startsWith("//") && !v.includes("\\") && !v.startsWith("/admin")) return v;
  return undefined;
}

export default async function LoginPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { lang } = await params;
  const { from } = await searchParams;
  const safe = safeFrom(from);
  const locale = toLocale(lang);

  // Already signed in → skip the form.
  const user = await getSessionUser();
  if (user) redirect(localizePath(safe ?? "/account", locale));

  const loginEnabled = await getToggle("LOGIN_ENABLED");
  const t = (await getPageContent(locale)).login;

  return (
    <Container className="min-h-[70vh] py-20">
      <div className="mx-auto max-w-sm">
        <h1 className="text-section-h2 font-bold text-ink">{t.heading}</h1>
        <p className="mt-3 text-body text-ink/70">{t.subtext}</p>

        {loginEnabled ? (
          <LoginForm from={safe} labels={t} />
        ) : (
          <p className="mt-8 rounded-2xl border border-grey-300/60 bg-white p-6 text-body text-ink/70">
            {t.disabledMessage}
          </p>
        )}

        <p className="mt-6 text-meta text-ink/60">
          {t.signupPromptPre}{" "}
          <Link href="/register" className="font-semibold text-nile hover:underline">
            {t.signupPromptLink}
          </Link>
        </p>
      </div>
    </Container>
  );
}
