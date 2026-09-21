"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resendVerificationAction, type ResendState } from "@/app/(site)/verify-email/actions";
import { AuthField, FormError, SubmitButton } from "@/components/account/ui";

const INITIAL: ResendState = { done: false, error: null };

/**
 * "Check your inbox" panel with a resend affordance. Shown on /verify-email
 * when there's no token in the URL (e.g. straight after registration). The
 * resend action is enumeration-safe, so the confirmation copy never reveals
 * whether the address exists.
 */
export default function ResendVerificationForm() {
  const [state, formAction] = useActionState(resendVerificationAction, INITIAL);

  if (state.done) {
    return (
      <div className="mt-8 rounded-2xl border border-grey-300/60 bg-white p-6">
        <p className="text-body text-ink/80">
          If your account still needs confirming, we&apos;ve sent a fresh link. It expires in 24 hours.
        </p>
        <Link href="/login" className="mt-4 inline-block text-meta font-semibold text-nile hover:underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <AuthField id="email" label="Email" type="email" autoComplete="email" />
      <FormError message={state.error} />
      <SubmitButton>Resend confirmation link</SubmitButton>
      <p className="text-center text-meta text-ink/60">
        Already confirmed?{" "}
        <Link href="/login" className="font-semibold text-nile hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
