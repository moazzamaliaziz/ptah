import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import Container from "@/components/layout/Container";
import ResetPasswordForm from "@/components/account/ResetPasswordForm";
import { getPageContent } from "@/i18n/pages";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Set a new password | Ptah Tours",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const t = (await getPageContent()).resetPassword;

  return (
    <Container className="min-h-[70vh] py-20">
      <div className="mx-auto max-w-sm">
        <h1 className="text-section-h2 font-bold text-ink">{t.heading}</h1>

        {token ? (
          <>
            <p className="mt-3 text-body text-ink/70">{t.subtext}</p>
            <ResetPasswordForm token={token} labels={t} />
          </>
        ) : (
          <div className="mt-8 rounded-2xl border border-grey-300/60 bg-white p-6">
            <p className="text-body text-ink/80">{t.invalidMessage}</p>
            <Link href="/forgot-password" className="mt-4 inline-block text-meta font-semibold text-nile hover:underline">
              {t.requestLink}
            </Link>
          </div>
        )}
      </div>
    </Container>
  );
}
