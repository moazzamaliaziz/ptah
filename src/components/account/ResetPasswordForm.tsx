"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPasswordAction, type ResetState } from "@/app/(site)/reset-password/actions";
import { AuthField, FormError, SubmitButton } from "@/components/account/ui";

const INITIAL: ResetState = { ok: false, error: null };

export default function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction] = useActionState(resetPasswordAction, INITIAL);

  if (state.ok) {
    return (
      <div className="mt-8 rounded-2xl border border-grey-300/60 bg-white p-6">
        <p className="text-body text-ink/80">
          Your password has been reset and you&apos;ve been signed out of all devices. You can now log in
          with your new password.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-block rounded-full bg-nile px-6 py-3 text-btn text-white transition-colors hover:bg-nile/90"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="token" value={token} />
      <AuthField id="password" label="New password" type="password" autoComplete="new-password" minLength={10} />
      <AuthField id="confirmPassword" label="Confirm new password" type="password" autoComplete="new-password" minLength={10} />
      <FormError message={state.error} />
      <SubmitButton>Reset password</SubmitButton>
    </form>
  );
}
