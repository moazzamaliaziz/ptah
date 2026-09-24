"use client";

import { useActionState } from "react";
import { useParams } from "next/navigation";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { resetPasswordAction, type ResetState } from "@/app/[lang]/(site)/reset-password/actions";
import { AuthField, FormError, SubmitButton } from "@/components/account/ui";
import type { PageContent } from "@/i18n/pages/en";

const INITIAL: ResetState = { ok: false, error: null };

export default function ResetPasswordForm({ token, labels }: { token: string; labels: PageContent["resetPassword"] }) {
  const { lang } = useParams<{ lang?: string }>();
  const [state, formAction] = useActionState(resetPasswordAction, INITIAL);

  if (state.ok) {
    return (
      <div className="mt-8 rounded-2xl border border-grey-300/60 bg-white p-6">
        <p className="text-body text-ink/80">{labels.doneMessage}</p>
        <Link
          href="/login"
          className="mt-4 inline-block rounded-full bg-nile px-6 py-3 text-btn text-white transition-colors hover:bg-nile/90"
        >
          {labels.loginLink}
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="lang" value={lang ?? ""} />
      <AuthField id="password" label={labels.passwordLabel} type="password" autoComplete="new-password" minLength={10} />
      <AuthField id="confirmPassword" label={labels.confirmPasswordLabel} type="password" autoComplete="new-password" minLength={10} />
      <FormError message={state.error} />
      <SubmitButton pendingLabel={labels.working}>{labels.submit}</SubmitButton>
    </form>
  );
}
