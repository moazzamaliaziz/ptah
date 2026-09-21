export default function Eyebrow({
  children,
  tone = "rust",
}: {
  children: string;
  /** `rust` for light backgrounds (default); `light` for dark/hero surfaces. */
  tone?: "rust" | "light";
}) {
  return (
    <span
      className={`inline-block text-xs font-semibold uppercase tracking-[0.14em] ${
        tone === "rust" ? "text-rust" : "text-white/80"
      }`}
    >
      {children}
    </span>
  );
}
