import type { Metadata } from "next";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { Card } from "@/components/ui";
import { ButtonLink } from "@/components/ui";
import { IconArrowRight } from "@/components/icons";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.pages.howItWorks.title };
}

export default async function HowItWorksPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);

  return (
    <div>
      <div className="border-b border-navy-100 bg-navy-950 py-16">
        <div className="container-site max-w-3xl">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {dict.pages.howItWorks.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-navy-200">
            {dict.pages.howItWorks.intro}
          </p>
        </div>
      </div>

      <div className="container-site grid gap-10 py-16 lg:grid-cols-2">
        {[
          {
            title: dict.home.sellersTitle,
            steps: dict.home.sellerSteps,
            cta: { href: `/${lang}/for-sellers`, label: dict.pages.forSellers.cta },
          },
          {
            title: dict.home.investorsTitle,
            steps: dict.home.investorSteps,
            cta: { href: `/${lang}/for-investors`, label: dict.pages.forInvestors.cta },
          },
        ].map((col) => (
          <Card key={col.title} className="p-8">
            <h2 className="text-2xl font-bold text-navy-950">{col.title}</h2>
            <ol className="mt-7 space-y-7">
              {col.steps.map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-900 font-bold text-gold-400">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-navy-900">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-navy-500">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <ButtonLink href={col.cta.href} variant="outline" className="mt-8">
              {col.cta.label}
              <IconArrowRight className="h-4 w-4" />
            </ButtonLink>
          </Card>
        ))}
      </div>
    </div>
  );
}
