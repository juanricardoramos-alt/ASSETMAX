import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import {
  CertificationChecklist,
  ProposalTemplates,
} from "@/components/services/SupplierToolkit";
import { ButtonLink, Card } from "@/components/ui";
import { IconStar } from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function ToolsPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);
  const t = dict.services;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gold-600">
          {t.automatedKicker}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-navy-950">
          {t.automatedTitle}
        </h1>
      </div>

      <CertificationChecklist dict={dict} />
      <ProposalTemplates dict={dict} />

      {/* Premium upsell */}
      <Card className="flex flex-wrap items-center justify-between gap-4 border-gold-400 bg-navy-950 p-6 ring-1 ring-gold-500/40">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gold-500 text-navy-950">
            <IconStar className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="font-bold text-white">{t.upsell.title}</p>
            <p className="mt-0.5 text-sm text-navy-200">
              {t.upsell.text}{" "}
              <span className="font-semibold text-gold-400">
                {t.premiumPrice}
              </span>
            </p>
          </div>
        </div>
        <ButtonLink href={`/${lang}/services`} variant="gold" size="sm">
          {t.upsell.cta}
        </ButtonLink>
      </Card>
    </div>
  );
}
