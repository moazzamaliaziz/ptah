import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import RegisterForm from "@/components/account/RegisterForm";
import { getSessionUser } from "@/server/auth/session";
import { getToggle } from "@/server/toggles";
import { localizePath } from "@/i18n/routing";
import { toLocale } from "@/i18n/config";
import { getPageContent } from "@/i18n/pages";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Create your account | Ptah Tours",
  robots: { index: false, follow: false },
};

function safeFrom(v: string | undefined): string | undefined {
  if (v && v.startsWith("/") && !v.startsWith("//") && !v.includes("\\") && !v.startsWith("/admin")) return v;
  return undefined;
}

export default async function RegisterPage({
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

  const user = await getSessionUser();
  if (user) redirect(localizePath(safe ?? "/account", locale));

  const signupEnabled = await getToggle("SIGNUP_ENABLED");
  const t = (await getPageContent(locale)).register;

  return (
    <Container className="min-h-[70vh] py-20">
      <div className="mx-auto max-w-sm">
        <h1 className="text-section-h2 font-bold text-ink">{t.heading}</h1>
        <p className="mt-3 text-body text-ink/70">{t.subtext}</p>

        {signupEnabled ? (
          <RegisterForm from={safe} labels={t} />
        ) : (
          <p className="mt-8 rounded-2xl border border-grey-300/60 bg-white p-6 text-body text-ink/70">
            {t.disabledMessage}
          </p>
        )}

        <p className="mt-6 text-meta text-ink/60">
          {t.loginPromptPre}{" "}
          <Link href="/login" className="font-semibold text-nile hover:underline">
            {t.loginPromptLink}
          </Link>
        </p>
      </div>
    </Container>
  );
}
