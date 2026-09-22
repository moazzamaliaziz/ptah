"use client";

import { useActionState, type JSX } from "react";
import { subscribeNewsletterAction, type NewsletterState } from "@/app/(site)/newsletter/actions";
import { FormError, SubmitButton } from "@/components/account/ui";

const INITIAL: NewsletterState = { ok: false, error: null };

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-grey-300 bg-white px-4 py-3 text-body text-ink outline-none transition-colors focus-visible:border-nile focus-visible:ring-2 focus-visible:ring-nile/20";
const labelClass = "text-meta font-medium text-ink";

export default function NewsletterForm(): JSX.Element {
  const [state, formAction] = useActionState(subscribeNewsletterAction, INITIAL);

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-grey-300/60 bg-white p-6">
        <p className="text-card-title font-semibold text-ink">You&apos;re on the list.</p>
        <p className="mt-2 text-body text-ink/70">
          Thanks for subscribing — keep an eye on your inbox for stories, seasonal tips, and the occasional
          quiet-season offer. No spam, and you can unsubscribe any time.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5" noValidate>
      {/* Honeypot — visually hidden, off the tab order; bots fill it, humans don't. */}
      <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="name" className={labelClass}>Name <span className="text-ink/45">(optional)</span></label>
        <input id="name" name="name" type="text" autoComplete="name" maxLength={120} className={fieldClass} />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" maxLength={255} className={fieldClass} />
      </div>

      <FormError message={state.error} />
      <SubmitButton>Subscribe</SubmitButton>

      <p className="text-meta text-ink/55">
        By subscribing you agree to our{" "}
        <a href="/privacy-policy" className="font-semibold text-nile hover:underline">Privacy Policy</a>. We&apos;ll
        never share your email, and you can unsubscribe any time.
      </p>
    </form>
  );
}
