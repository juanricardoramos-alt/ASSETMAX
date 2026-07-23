import { Card, ButtonLink } from "@/components/ui";
import { IconCheck, IconArrowRight } from "@/components/icons";

/** Shared layout for the "For Sellers" / "For Investors" pages. */
export function AudiencePage({
  title,
  intro,
  benefits,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  intro: string;
  benefits: { title: string; text: string }[];
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <div>
      <div className="bg-navy-950 py-16">
        <div className="container-site max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">{title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-navy-200">{intro}</p>
          <ButtonLink href={ctaHref} variant="gold" size="lg" className="mt-8">
            {ctaLabel}
            <IconArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </div>

      <div className="container-site grid gap-6 py-16 sm:grid-cols-2">
        {benefits.map((b) => (
          <Card key={b.title} className="p-7">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-100 text-gold-700">
              <IconCheck className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-navy-950">{b.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-navy-500">{b.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
