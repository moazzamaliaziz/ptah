import Eyebrow from "./Eyebrow";

export default function SectionHeading({
  eyebrow,
  title,
  emphasis,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  emphasis?: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center mx-auto max-w-xl" : "max-w-lg"}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 font-display text-4xl leading-[1.1] text-charcoal md:text-[2.75rem]">
        {title}{" "}
        {emphasis && <em className="text-burgundy not-italic font-medium">{emphasis}</em>}
      </h2>
      {description && (
        <p className="mt-4 text-[15px] leading-relaxed text-warm-gray">
          {description}
        </p>
      )}
    </div>
  );
}
