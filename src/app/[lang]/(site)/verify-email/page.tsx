import type { Metadata } from "next";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import Container from "@/components/layout/Container";
import ResendVerificationForm from "@/components/account/ResendVerificationForm";
import { verifyEmailToken } from "@/server/auth/accounts";
import { getPageContent } from "@/i18n/pages";

/* Token-consuming + status page — never index. */
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Confirm your email | Ptah Tours",
  robots: { index: false, follow: false },
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const t = (await getPageContent()).verifyEmail;

  // No token → the "check your inbox" landing (post-registration) with a resend.
  if (!token) {
    return (
      <Container className="min-h-[70vh] py-20">
        <div className="mx-auto max-w-sm">
          <h1 className="text-section-h2 font-bold text-ink">{t.heading}</h1>
          <p className="mt-3 text-body text-ink/70">{t.subtext}</p>
          <ResendVerificationForm labels={t} />
        </div>
      </Container>
    );
  }

  const result = await verifyEmailToken(token);

  return (
    <Container className="min-h-[70vh] py-20">
      <div className="mx-auto max-w-sm text-center">
        {result.ok ? (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-nile/10">
              <svg viewBox="0 0 24 24" className="h-7 w-7 text-nile" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="mt-6 text-section-h2 font-bold text-ink">{t.successHeading}</h1>
            <p className="mt-3 text-body text-ink/70">{t.successBody}</p>
            <Link
              href="/login"
              className="mt-8 inline-block rounded-full bg-nile px-6 py-3 text-btn text-white transition-colors hover:bg-nile/90"
            >
              {t.continueLink}
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-section-h2 font-bold text-ink">{t.errorHeading}</h1>
            <p className="mt-3 text-body text-ink/70">{t.errorTokenInvalid}</p>
            <div className="mt-8 text-left">
              <ResendVerificationForm labels={t} />
            </div>
          </>
        )}
      </div>
    </Container>
  );
}
