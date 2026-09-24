import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import ForgotPasswordForm from "@/components/account/ForgotPasswordForm";
import { getPageContent } from "@/i18n/pages";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Reset your password | Ptah Tours",
  robots: { index: false, follow: false },
};

export default async function ForgotPasswordPage() {
  const t = (await getPageContent()).forgotPassword;

  return (
    <Container className="min-h-[70vh] py-20">
      <div className="mx-auto max-w-sm">
        <h1 className="text-section-h2 font-bold text-ink">{t.heading}</h1>
        <p className="mt-3 text-body text-ink/70">{t.subtext}</p>
        <ForgotPasswordForm labels={t} />
      </div>
    </Container>
  );
}
