import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { INSIGHTS } from "@/lib/insights";
import { formatDate } from "@/lib/utils";
import { SmartImage } from "@/components/SmartImage";
import { Badge } from "@/components/ui";
import { Reveal } from "@/components/Reveal";

export async function generateMetadata({
  params,
}: {
  params: { lang: string };
}): Promise<Metadata> {
  const dict = await getDictionary(params.lang);
  return { title: dict.insights.title, description: dict.insights.subtitle };
}

export default async function InsightsPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const l = lang === "es" ? "es" : "en";

  return (
    <div className="bg-navy-50/40">
      <div className="border-b border-navy-100 bg-navy-950 py-14">
        <div className="container-site max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
            {dict.insights.kicker}
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-white">
            {dict.insights.title}
          </h1>
          <p className="mt-3 text-navy-200">{dict.insights.subtitle}</p>
        </div>
      </div>

      <div className="container-site grid gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {INSIGHTS.map((article, i) => (
          <Reveal key={article.slug} delay={i * 60}>
            <Link
              href={`/${lang}/insights/${article.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-navy-100 bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div className="relative h-44 overflow-hidden bg-navy-100">
                <SmartImage
                  src={article.image}
                  alt={article[l].title}
                  className="transition duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 to-transparent" />
                <Badge className="absolute left-3 top-3 bg-navy-950/80 text-white backdrop-blur">
                  {article.category}
                </Badge>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h2 className="font-display text-lg font-bold leading-snug text-navy-950 group-hover:text-navy-700">
                  {article[l].title}
                </h2>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-navy-500">
                  {article[l].excerpt}
                </p>
                <div className="mt-4 border-t border-navy-100 pt-4 text-xs text-navy-400">
                  <span className="font-semibold text-navy-600">{article.author}</span> ·{" "}
                  {article.role} · {formatDate(article.date, lang)}
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
