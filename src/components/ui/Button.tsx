import { LocaleLink as Link } from "@/components/i18n/LocaleLink";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost-dark" | "ghost-light";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  primary: "bg-nile text-white hover:bg-nile/90",
  secondary:
    "border border-ink/15 bg-white text-ink hover:border-ink/30",
  "ghost-dark": "text-ink hover:text-rust",
  "ghost-light": "text-white hover:text-white/80",
};

export default function Button({
  children,
  href,
  variant = "primary",
  onClick,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
}) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
