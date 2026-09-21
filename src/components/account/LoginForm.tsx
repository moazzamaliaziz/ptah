"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction, type LoginState } from "@/app/(site)/login/actions";
import { getWishlistIds, setWishlistIds } from "@/lib/wishlist";
import { AuthField, FormError, SubmitButton } from "@/components/account/ui";

const INITIAL: LoginState = { ok: false, error: null };

export default function LoginForm({ from }: { from?: string }) {
  const router = useRouter();
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
      router.push(state.redirectTo);
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {from ? <input type="hidden" name="from" value={from} /> : null}
      <input ref={wishlistRef} type="hidden" name="wishlist" defaultValue="[]" />
      <AuthField id="email" label="Email" type="email" autoComplete="email" />
      <AuthField id="password" label="Password" type="password" autoComplete="current-password" />
      <div className="text-right">
        <Link href="/forgot-password" className="text-meta text-nile hover:underline">
          Forgot password?
        </Link>
      </div>
      {!state.ok && <FormError message={state.error} />}
      <SubmitButton>Log in</SubmitButton>
    </form>
  );
}
