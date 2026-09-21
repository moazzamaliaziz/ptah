"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { registerAction, type RegisterState } from "@/app/(site)/register/actions";
import { getWishlistIds, setWishlistIds } from "@/lib/wishlist";
import { AuthField, FormError, SubmitButton } from "@/components/account/ui";

const INITIAL: RegisterState = { ok: false, error: null };

export default function RegisterForm({ from }: { from?: string }) {
  const router = useRouter();
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
      router.push(state.redirectTo);
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {from ? <input type="hidden" name="from" value={from} /> : null}
      <input ref={wishlistRef} type="hidden" name="wishlist" defaultValue="[]" />
      <AuthField id="name" label="Full name" type="text" autoComplete="name" />
      <AuthField id="email" label="Email" type="email" autoComplete="email" />
      <AuthField id="password" label="Password" type="password" autoComplete="new-password" minLength={10} />
      <AuthField id="confirmPassword" label="Confirm password" type="password" autoComplete="new-password" minLength={10} />
      {!state.ok && <FormError message={state.error} />}
      <SubmitButton>Create account</SubmitButton>
    </form>
  );
}
