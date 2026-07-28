import type { Metadata } from "next";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { ButtonLink, Card, SectionHeading } from "@/components/ui";
import { IconCheck, IconChart, IconDoc, IconHandshake, IconShield, IconStar, IconUsers } from "@/components/icons";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.services.title, description: dict.services.subtitle };
}

const AUTOMATED_ICONS = [IconDoc, IconShield, IconChart];

export default async function ServicesPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const t = dict.services;

  return (
    <div className="bg-navy-50/40">
      <div className="border-b border-navy-100 bg-navy-950">
        <div className="container-site py-12">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {t.title}
          </h1>
          <p className="mt-2 max-w-3xl text-navy-200">{t.subtitle}</p>
        </div>
      </div>

      {/* Automated tier */}
      <section className="border-b border-navy-100 bg-white">
        <div className="container-site py-14">
          <SectionHeading
            kicker={t.automatedKicker}
            title={t.automatedTitle}
            align="left"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {t.automatedItems.map((item, i) => {
              const Icon = AUTOMATED_ICONS[i] ?? IconDoc;
              return (
                <Card key={item.title} className="p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-950 text-gold-400">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-bold text-navy-950">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-navy-500">
                    {item.text}
                  </p>
                </Card>
              );
            })}
          </div>
          <ButtonLink
            href={`/${lang}/dashboard/tools`}
            variant="primary"
            className="mt-8"
          >
            {t.toolsCta}
          </ButtonLink>
        </div>
      </section>

      {/* Premium tier */}
      <section className="border-b border-navy-100 bg-navy-950">
        <div className="container-site grid items-center gap-10 py-14 lg:grid-cols-[1fr_360px]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-500">
              {t.premiumKicker}
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white">
              {t.premiumTitle}
            </h2>
            <p className="mt-3 max-w-2xl text-navy-200">{t.premiumText}</p>
            <ul className="mt-6 space-y-2.5">
              {t.premiumItems.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2.5 text-sm text-navy-100"
                >
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <Card className="border-gold-500/40 bg-white/5 p-8 text-center ring-1 ring-gold-500/30">
            <IconHandshake className="mx-auto h-10 w-10 text-gold-400" />
            <p className="mt-4 font-display text-3xl font-bold text-white">
              {t.premiumPrice}
            </p>
            <ButtonLink
              href={`/${lang}/contact`}
              variant="gold"
              className="mt-6 w-full"
            >
              {t.premiumCta}
            </ButtonLink>
          </Card>
        </div>
      </section>

      {/* Revenue model */}
      <section className="container-site py-14">
        <SectionHeading kicker={t.revenueKicker} title={t.revenueTitle} />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {t.plans.map((plan, i) => (
            <Card
              key={plan.name}
              className={
                i === 3 ? "border-gold-400 p-6 ring-1 ring-gold-300" : "p-6"
              }
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-bold text-navy-950">{plan.name}</h3>
                {i === 3 && <IconStar className="h-5 w-5 shrink-0 text-gold-500" />}
                {i === 0 && <IconUsers className="h-5 w-5 shrink-0 text-navy-400" />}
              </div>
              <p className="mt-3 font-display text-xl font-bold text-gold-600">
                {plan.price}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-navy-500">
                {plan.detail}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
