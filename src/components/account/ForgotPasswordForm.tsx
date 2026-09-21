"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPasswordAction, type ForgotState } from "@/app/(site)/forgot-password/actions";
import { AuthField, FormError, SubmitButton } from "@/components/account/ui";

const INITIAL: ForgotState = { done: false, error: null };

export default function ForgotPasswordForm() {
  const [state, formAction] = useActionState(forgotPasswordAction, INITIAL);

  if (state.done) {
    return (
      <div className="mt-8 rounded-2xl border border-grey-300/60 bg-white p-6">
        <p className="text-body text-ink/80">
          If an account exists for that email, we&apos;ve sent a link to reset your password. The link
          expires in one hour.
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
      <SubmitButton>Send reset link</SubmitButton>
      <p className="text-center text-meta text-ink/60">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-nile hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
