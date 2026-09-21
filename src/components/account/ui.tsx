"use client";

/**
 * Shared presentational bits for the account/auth forms (Phase 4). Uses the
 * real semantic tokens (nile/gold/ink/grey-300/papyrus) so the account flow is
 * visually consistent with the Phase 3 commerce pages.
 */
import { useFormStatus } from "react-dom";

export function AuthField({
  id,
  label,
  type = "text",
  autoComplete,
  required = true,
  defaultValue,
  minLength,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  defaultValue?: string;
  minLength?: number;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-meta font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        defaultValue={defaultValue}
        minLength={minLength}
        className="mt-1.5 w-full rounded-xl border border-grey-300 bg-white px-4 py-3 text-body text-ink outline-none transition-colors focus-visible:border-nile focus-visible:ring-2 focus-visible:ring-nile/20"
      />
    </div>
  );
}

export function FormError({ message }: { message: string | null | undefined }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-lg bg-rust/10 px-3 py-2 text-meta text-rust">
      {message}
    </p>
  );
}

export function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-nile px-6 py-3 text-btn text-white transition-colors hover:bg-nile/90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Please wait…" : children}
    </button>
  );
}
