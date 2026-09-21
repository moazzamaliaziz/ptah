import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import ForgotPasswordForm from "@/components/account/ForgotPasswordForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Reset your password | Ptah Tours",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <Container className="min-h-[70vh] py-20">
      <div className="mx-auto max-w-sm">
        <h1 className="text-section-h2 font-bold text-ink">Reset your password</h1>
        <p className="mt-3 text-body text-ink/70">
          Enter your email and we&apos;ll send you a link to set a new password.
        </p>
        <ForgotPasswordForm />
      </div>
    </Container>
  );
}
