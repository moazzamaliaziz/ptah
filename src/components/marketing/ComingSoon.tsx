import Container from "@/components/layout/Container";
import Eyebrow from "@/components/ui/Eyebrow";
import Button from "@/components/ui/Button";

export default function ComingSoon({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-4 max-w-lg text-section-h2 font-bold text-ink">
        {title}
      </h1>
      <p className="mt-4 max-w-md text-body text-ink/65">
        {description}
      </p>
      <Button href="/" variant="secondary" className="mt-8">
        Back to home
      </Button>
    </Container>
  );
}
