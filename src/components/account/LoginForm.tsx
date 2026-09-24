"use client";

import { useActionState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { loginAction, type LoginState } from "@/app/[lang]/(site)/login/actions";
import { getWishlistIds, setWishlistIds } from "@/lib/wishlist";
import { AuthField, FormError, SubmitButton } from "@/components/account/ui";
import { localizePath } from "@/i18n/routing";
import { isLocale } from "@/i18n/config";
import type { PageContent } from "@/i18n/pages/en";

const INITIAL: LoginState = { ok: false, error: null };

export default function LoginForm({ from, labels }: { from?: string; labels: PageContent["login"] }) {
  const router = useRouter();
  const { lang } = useParams<{ lang?: string }>();
  const [state, formAction] = useActionState(loginAction, INITIAL);
  const wishlistRef = useRef<HTMLInputElement>(null);

  // Snapshot the guest wishlist slugs into the hidden field for account merge.
  // Writing the DOM value directly (not React state) reads localStorage on the
  // client without a mount-time state update; the form action serializes the
  // current input value at submit.
  useEffect(() => {
    if (wishlistRef.current) {
      wishlistRef.current.value = JSON.stringify(getWishlistIds());
    }
  }, []);

  // On success: hydrate the local wishlist from the merged account set, navigate.
  useEffect(() => {
    if (state.ok) {
      setWishlistIds(state.wishlist);
      router.push(isLocale(lang) ? localizePath(state.redirectTo, lang) : state.redirectTo);
      router.refresh();
    }
  }, [state, router, lang]);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {from ? <input type="hidden" name="from" value={from} /> : null}
      <input type="hidden" name="lang" value={lang ?? ""} />
      <input ref={wishlistRef} type="hidden" name="wishlist" defaultValue="[]" />
      <AuthField id="email" label={labels.emailLabel} type="email" autoComplete="email" />
      <AuthField id="password" label={labels.passwordLabel} type="password" autoComplete="current-password" />
      <div className="text-right">
        <Link href="/forgot-password" className="text-meta text-nile hover:underline">
          {labels.forgotPasswordLink}
        </Link>
      </div>
      {!state.ok && <FormError message={state.error} />}
      <SubmitButton pendingLabel={labels.working}>{labels.submit}</SubmitButton>
    </form>
  );
}
