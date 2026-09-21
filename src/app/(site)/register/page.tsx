import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import RegisterForm from "@/components/account/RegisterForm";
import { getSessionUser } from "@/server/auth/session";
import { getToggle } from "@/server/toggles";

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
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const safe = safeFrom(from);

  const user = await getSessionUser();
  if (user) redirect(safe ?? "/account");

  const signupEnabled = await getToggle("SIGNUP_ENABLED");

  return (
    <Container className="min-h-[70vh] py-20">
      <div className="mx-auto max-w-sm">
        <h1 className="text-section-h2 font-bold text-ink">Create your account</h1>
        <p className="mt-3 text-body text-ink/70">Join Ptah Tours and start planning your next journey.</p>

        {signupEnabled ? (
          <RegisterForm from={safe} />
        ) : (
          <p className="mt-8 rounded-2xl border border-grey-300/60 bg-white p-6 text-body text-ink/70">
            New account registration is temporarily unavailable. Please check back shortly.
          </p>
        )}

        <p className="mt-6 text-meta text-ink/60">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-nile hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </Container>
  );
}
