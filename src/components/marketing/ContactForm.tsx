"use client";

import { useActionState, type JSX } from "react";
import { submitContactAction, type ContactState } from "@/app/[lang]/(site)/contact/actions";
import { FormError, SubmitButton } from "@/components/account/ui";
import { CONTACT_LIMITS } from "@/content/contact-schema";

const INITIAL: ContactState = { ok: false, error: null };

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-grey-300 bg-white px-4 py-3 text-body text-ink outline-none transition-colors focus-visible:border-nile focus-visible:ring-2 focus-visible:ring-nile/20";
const labelClass = "text-meta font-medium text-ink";

export default function ContactForm(): JSX.Element {
  const [state, formAction] = useActionState(submitContactAction, INITIAL);

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-grey-300/60 bg-white p-6">
        <p className="text-card-title font-semibold text-ink">Thanks — your message is on its way.</p>
        <p className="mt-2 text-body text-ink/70">
          We&apos;ve received your enquiry and someone from the Cairo team will get back to you soon,
          usually within one business day.
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

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelClass}>Name</label>
          <input id="name" name="name" type="text" required autoComplete="name" maxLength={CONTACT_LIMITS.name} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" maxLength={CONTACT_LIMITS.email} className={fieldClass} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className={labelClass}>Phone <span className="text-ink/45">(optional)</span></label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={CONTACT_LIMITS.phone} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="subject" className={labelClass}>Subject <span className="text-ink/45">(optional)</span></label>
          <input id="subject" name="subject" type="text" maxLength={CONTACT_LIMITS.subject} className={fieldClass} />
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>Message</label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={CONTACT_LIMITS.message}
          rows={6}
          className={`${fieldClass} resize-y`}
          placeholder="Tell us about the trip you have in mind — dates, group size, must-sees…"
        />
      </div>

      <FormError message={state.error} />
      <SubmitButton>Send message</SubmitButton>

      <p className="text-meta text-ink/55">
        By sending this message you agree to our{" "}
        <a href="/privacy-policy" className="font-semibold text-nile hover:underline">Privacy Policy</a>.
      </p>
    </form>
  );
}
