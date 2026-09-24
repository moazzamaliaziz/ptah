"use client";

import { useActionState } from "react";
import { useParams } from "next/navigation";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { forgotPasswordAction, type ForgotState } from "@/app/[lang]/(site)/forgot-password/actions";
import { AuthField, FormError, SubmitButton } from "@/components/account/ui";
import type { PageContent } from "@/i18n/pages/en";

const INITIAL: ForgotState = { done: false, error: null };

export default function ForgotPasswordForm({ labels }: { labels: PageContent["forgotPassword"] }) {
  const { lang } = useParams<{ lang?: string }>();
  const [state, formAction] = useActionState(forgotPasswordAction, INITIAL);

  if (state.done) {
    return (
      <div className="mt-8 rounded-2xl border border-grey-300/60 bg-white p-6">
        <p className="text-body text-ink/80">{labels.doneMessage}</p>
        <Link href="/login" className="mt-4 inline-block text-meta font-semibold text-nile hover:underline">
          {labels.backToLoginLink}
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="lang" value={lang ?? ""} />
      <AuthField id="email" label={labels.emailLabel} type="email" autoComplete="email" />
      <FormError message={state.error} />
      <SubmitButton pendingLabel={labels.working}>{labels.submit}</SubmitButton>
      <p className="text-center text-meta text-ink/60">
        {labels.loginPromptPre}{" "}
        <Link href="/login" className="font-semibold text-nile hover:underline">
          {labels.loginPromptLink}
        </Link>
      </p>
    </form>
  );
}
