import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import ResetPasswordForm from "@/components/account/ResetPasswordForm";

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

  return (
    <Container className="min-h-[70vh] py-20">
      <div className="mx-auto max-w-sm">
        <h1 className="text-section-h2 font-bold text-ink">Set a new password</h1>

        {token ? (
          <>
            <p className="mt-3 text-body text-ink/70">Choose a new password for your account.</p>
            <ResetPasswordForm token={token} />
          </>
        ) : (
          <div className="mt-8 rounded-2xl border border-grey-300/60 bg-white p-6">
            <p className="text-body text-ink/80">
              This reset link is missing or malformed. Please request a new one.
            </p>
            <Link href="/forgot-password" className="mt-4 inline-block text-meta font-semibold text-nile hover:underline">
              Request a reset link
            </Link>
          </div>
        )}
      </div>
    </Container>
  );
}
