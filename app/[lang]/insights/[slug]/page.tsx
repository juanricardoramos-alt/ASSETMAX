import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { getInsight, INSIGHTS } from "@/lib/insights";
import { formatDate } from "@/lib/utils";
import { SmartImage } from "@/components/SmartImage";
import { Badge } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: { lang: string; slug: string };
}): Promise<Metadata> {
  const article = getInsight(params.slug);
  if (!article) return {};
  const l = params.lang === "es" ? "es" : "en";
  return {
    title: article[l].title,
    description: article[l].excerpt,
    openGraph: { images: [{ url: article.image }] },
  };
}

export default async function InsightArticlePage({
  params,
}: {
  params: { lang: string; slug: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const article = getInsight(params.slug);
  if (!article) notFound();
  const l = lang === "es" ? "es" : "en";

  const related = INSIGHTS.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <article>
      <div className="relative h-72 bg-navy-950 sm:h-96">
        <SmartImage
          src={article.image}
          alt={article[l].title}
          sizes="100vw"
          priority
          className="opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
        <div className="container-site absolute inset-x-0 bottom-0 pb-10">
          <Badge className="bg-gold-500 text-navy-950">{article.category}</Badge>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl">
            {article[l].title}
          </h1>
          <p className="mt-3 text-sm text-navy-200">
            {dict.insights.byLine}{" "}
            <span className="font-semibold text-white">{article.author}</span> ·{" "}
            {article.role} · {formatDate(article.date, lang)}
          </p>
        </div>
      </div>

      <div className="container-site max-w-3xl py-12">
        <p className="text-lg font-medium leading-relaxed text-navy-700">
          {article[l].excerpt}
        </p>
        <div className="mt-8 space-y-6">
          {article[l].body.map((para, i) => (
            <p key={i} className="text-[16px] leading-[1.8] text-navy-800">
              {para}
            </p>
          ))}
        </div>

        <div className="mt-10 border-t border-navy-100 pt-6">
          <Link
            href={`/${lang}/insights`}
            className="text-sm font-bold text-gold-600 hover:text-gold-500"
          >
            ← {dict.insights.backTo}
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <div className="border-t border-navy-100 bg-navy-50/40 py-12">
          <div className="container-site">
            <h2 className="mb-6 font-display text-2xl font-bold text-navy-950">
              {dict.insights.title}
            </h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {related.map((a) => (
                <Link
                  key={a.slug}
                  href={`/${lang}/insights/${a.slug}`}
                  className="group rounded-xl border border-navy-100 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  <Badge className="bg-navy-50 text-navy-600 ring-1 ring-navy-200">
                    {a.category}
                  </Badge>
                  <h3 className="mt-3 font-display text-base font-bold leading-snug text-navy-950 group-hover:text-navy-700">
                    {a[l].title}
                  </h3>
                  <p className="mt-2 text-xs text-navy-400">
                    {a.author} · {formatDate(a.date, lang)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
