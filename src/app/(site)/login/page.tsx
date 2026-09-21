import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Container from "@/components/layout/Container";
import LoginForm from "@/components/account/LoginForm";
import { getSessionUser } from "@/server/auth/session";
import { getToggle } from "@/server/toggles";

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
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const safe = safeFrom(from);

  // Already signed in → skip the form.
  const user = await getSessionUser();
  if (user) redirect(safe ?? "/account");

  const loginEnabled = await getToggle("LOGIN_ENABLED");

  return (
    <Container className="min-h-[70vh] py-20">
      <div className="mx-auto max-w-sm">
        <h1 className="text-section-h2 font-bold text-ink">Welcome back</h1>
        <p className="mt-3 text-body text-ink/70">Sign in to continue your journey with Ptah Tours.</p>

        {loginEnabled ? (
          <LoginForm from={safe} />
        ) : (
          <p className="mt-8 rounded-2xl border border-grey-300/60 bg-white p-6 text-body text-ink/70">
            Sign-in is temporarily unavailable. Please check back shortly.
          </p>
        )}

        <p className="mt-6 text-meta text-ink/60">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-nile hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </Container>
  );
}
