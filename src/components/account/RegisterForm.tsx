"use client";

import { useActionState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { registerAction, type RegisterState } from "@/app/[lang]/(site)/register/actions";
import { getWishlistIds, setWishlistIds } from "@/lib/wishlist";
import { AuthField, FormError, SubmitButton } from "@/components/account/ui";
import { localizePath } from "@/i18n/routing";
import { isLocale } from "@/i18n/config";
import type { PageContent } from "@/i18n/pages/en";

const INITIAL: RegisterState = { ok: false, error: null };

export default function RegisterForm({ from, labels }: { from?: string; labels: PageContent["register"] }) {
  const router = useRouter();
  const { lang } = useParams<{ lang?: string }>();
  const [state, formAction] = useActionState(registerAction, INITIAL);
  const wishlistRef = useRef<HTMLInputElement>(null);

  // Snapshot the guest wishlist into the hidden field for account merge (DOM
  // write, not React state — reads localStorage on the client without a
  // mount-time state update; serialized by the form action at submit).
  useEffect(() => {
    if (wishlistRef.current) {
      wishlistRef.current.value = JSON.stringify(getWishlistIds());
    }
  }, []);

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
      <AuthField id="name" label={labels.nameLabel} type="text" autoComplete="name" />
      <AuthField id="email" label={labels.emailLabel} type="email" autoComplete="email" />
      <AuthField id="password" label={labels.passwordLabel} type="password" autoComplete="new-password" minLength={10} />
      <AuthField id="confirmPassword" label={labels.confirmPasswordLabel} type="password" autoComplete="new-password" minLength={10} />
      {!state.ok && <FormError message={state.error} />}
      <SubmitButton pendingLabel={labels.working}>{labels.submit}</SubmitButton>
    </form>
  );
}
