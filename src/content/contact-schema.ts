/**
 * Contact-form input contract (pure — no server-only/DB/Next imports so it is
 * safe to import from the client form for shared field limits and from the
 * server action for validation). zod v4.
 */
import { z } from "zod";

export const CONTACT_LIMITS = {
  name: 120,
  email: 255,
  phone: 40,
  subject: 200,
  message: 4000,
} as const;

/** Public contact submission. `website` is a honeypot — must stay empty. */
export const contactInputSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(CONTACT_LIMITS.name),
  email: z.email("Please enter a valid email address.").max(CONTACT_LIMITS.email),
  phone: z
    .string()
    .trim()
    .max(CONTACT_LIMITS.phone)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
  subject: z
    .string()
    .trim()
    .max(CONTACT_LIMITS.subject)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
  message: z
    .string()
    .trim()
    .min(10, "Please share a little more detail (at least 10 characters).")
    .max(CONTACT_LIMITS.message),
});

export type ContactInput = z.infer<typeof contactInputSchema>;
