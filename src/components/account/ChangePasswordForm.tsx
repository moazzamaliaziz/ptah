"use client";

import { useActionState } from "react";
import { changePasswordAction, type ChangePasswordState } from "@/app/(site)/account/actions";
import { AuthField, FormError, SubmitButton } from "@/components/account/ui";

const INITIAL: ChangePasswordState = { ok: false, error: null };

export default function ChangePasswordForm() {
  const [state, formAction] = useActionState(changePasswordAction, INITIAL);

  return (
    <form action={formAction} className="space-y-4" key={state.ok ? "done" : "form"}>
      <AuthField id="currentPassword" label="Current password" type="password" autoComplete="current-password" />
      <AuthField id="password" label="New password" type="password" autoComplete="new-password" minLength={10} />
      <AuthField id="confirmPassword" label="Confirm new password" type="password" autoComplete="new-password" minLength={10} />
      {state.ok ? (
        <p role="status" className="rounded-lg bg-nile/10 px-3 py-2 text-meta text-nile">
          Password updated. Other devices have been signed out.
        </p>
      ) : (
        <FormError message={state.error} />
      )}
      <SubmitButton>Update password</SubmitButton>
    </form>
  );
}
