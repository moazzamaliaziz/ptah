"use client";

import { useActionState } from "react";
import { changePasswordAction, type ChangePasswordState } from "@/app/[lang]/(site)/account/actions";
import { AuthField, FormError, SubmitButton } from "@/components/account/ui";
import type { PageContent } from "@/i18n/pages/en";

const INITIAL: ChangePasswordState = { ok: false, error: null };

export default function ChangePasswordForm({ labels }: { labels: PageContent["account"] }) {
  const [state, formAction] = useActionState(changePasswordAction, INITIAL);

  return (
    <form action={formAction} className="space-y-4" key={state.ok ? "done" : "form"}>
      <AuthField id="currentPassword" label={labels.currentPasswordLabel} type="password" autoComplete="current-password" />
      <AuthField id="password" label={labels.newPasswordLabel} type="password" autoComplete="new-password" minLength={10} />
      <AuthField id="confirmPassword" label={labels.confirmPasswordLabel} type="password" autoComplete="new-password" minLength={10} />
      {state.ok ? (
        <p role="status" className="rounded-lg bg-nile/10 px-3 py-2 text-meta text-nile">
          {labels.passwordUpdatedMessage}
        </p>
      ) : (
        <FormError message={state.error} />
      )}
      <SubmitButton>{labels.changePasswordSubmit}</SubmitButton>
    </form>
  );
}
