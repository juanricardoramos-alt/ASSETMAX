import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { localizedAll } from "@/lib/l10n";
import { CATEGORIES, countryName } from "@/lib/constants";
import { INSIGHTS } from "@/lib/insights";
import { formatDate } from "@/lib/utils";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { HeroVideo } from "@/components/home/HeroVideo";
import { WorldMap } from "@/components/home/WorldMap";
import { MarketRefsBar } from "@/components/commodities/MarketRefsBar";
import { SmartImage } from "@/components/SmartImage";
import { CountUp } from "@/components/CountUp";
import { Reveal } from "@/components/Reveal";
import { ButtonLink, SectionHeading, Card, Badge } from "@/components/ui";
import {
  CATEGORY_ICONS,
  IconSearch,
  IconShield,
  IconLock,
  IconGlobe,
  IconArrowRight,
  IconCheck,
} from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);

  const [featuredRaw, published, categoryCounts] = await Promise.all([
    prisma.project.findMany({
      where: { status: "PUBLISHED", featured: true },
      include: { images: { orderBy: { order: "asc" } }, owner: { select: { role: true } } },
      orderBy: { views: "desc" },
      take: 6,
    }),
    prisma.project.findMany({
      where: { status: "PUBLISHED" },
      select: {
        slug: true,
        title: true,
        countryCode: true,
        category: true,
        lat: true,
        lng: true,
        investmentMax: true,
        investmentMin: true,
      },
    }),
    prisma.project.groupBy({
      by: ["category"],
      where: { status: "PUBLISHED" },
      _count: true,
    }),
  ]);

  const featured = localizedAll(featuredRaw, lang);

  const countByCategory = Object.fromEntries(
    categoryCounts.map((c) => [c.category, c._count])
  );
  const countries = new Set(published.map((p) => p.countryCode));
  const pipeline = published.reduce(
    (sum, p) => sum + (p.investmentMax ?? p.investmentMin ?? 0),
    0
  );
  const pins = published
    .filter((p) => p.lat != null && p.lng != null)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      country: countryName(p.countryCode, lang),
      category: p.category,
      lat: p.lat as number,
      lng: p.lng as number,
    }));

  const trustBadges = [
    { icon: IconShield, label: dict.home.trustBadge1 },
    { icon: IconLock, label: dict.home.trustBadge2 },
    { icon: IconGlobe, label: dict.home.trustBadge3 },
  ];

  const partnerLogos = [
    "NORTHBRIDGE",
    "MERIDIAN PARTNERS",
    "ALDRIDGE HOLDINGS",
    "ANDES CAPITAL",
    "KESTREL INFRA",
    "SOLARIA GROUP",
  ];

  return (
    <>
      {/* ------------------------------------------------------------ Hero */}
      <section className="relative overflow-hidden bg-navy-950">
        <div className="absolute inset-0 bg-grid-dots opacity-60" />
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-navy-700/40 blur-3xl" />
        {/* Motion background — desktop only, loads after idle, static fallback */}
        <HeroVideo
          clips={[
            // Slots 2-4 are drop-in: a missing file self-removes from rotation.
            { mp4: "/videos/hero-embers.mp4", webm: "/videos/hero-embers.webm" },
            { mp4: "/videos/hero-sweep.mp4", webm: "/videos/hero-sweep.mp4" },
            { mp4: "/videos/hero-flow.mp4", webm: "/videos/hero-flow.mp4" },
            { mp4: "/videos/hero-extra.mp4", webm: "/videos/hero-extra.mp4" },
          ]}
        />
        {/* Radial scrim keeps the copy readable over bright footage */}
        <div className="pointer-events-none absolute inset-0 hero-scrim" />
        <div className="container-site relative py-20 sm:py-28">
          <div className="mx-auto max-w-4xl text-center">
            <p className="hero-text-shadow animate-fade-up text-xs font-bold uppercase tracking-[0.25em] text-gold-400">
              {dict.home.heroKicker}
            </p>
            <h1 className="hero-text-shadow mt-5 animate-fade-up font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {dict.home.heroTitle}
            </h1>
            <p className="hero-text-shadow mx-auto mt-6 max-w-2xl animate-fade-up text-base leading-relaxed text-navy-100 sm:text-lg">
              {dict.home.heroSubtitle}
            </p>

            <form
              action={`/${lang}/projects`}
              data-vorta-tour="search"
              className="mx-auto mt-9 flex max-w-2xl overflow-hidden rounded-lg bg-white shadow-card-hover transition focus-within:ring-2 focus-within:ring-gold-400"
            >
              <div className="flex flex-1 items-center gap-2 pl-4">
                <IconSearch className="h-5 w-5 shrink-0 text-navy-400" />
                <input
                  type="text"
                  name="q"
                  placeholder={dict.home.searchPlaceholder}
                  className="w-full border-0 py-4 text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-0"
                />
              </div>
              <button
                type="submit"
                className="bg-gold-500 px-6 text-sm font-semibold text-navy-950 transition hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-navy-800"
              >
                {dict.home.searchCta}
              </button>
            </form>

            <div
              data-vorta-tour="cta"
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            >
              <ButtonLink href={`/${lang}/auth/register`} variant="gold" size="lg">
                {dict.home.heroCtaSellers}
              </ButtonLink>
              <ButtonLink href={`/${lang}/projects`} variant="outline-light" size="lg">
                {dict.home.heroCtaInvestors}
                <IconArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {trustBadges.map((b) => (
                <div key={b.label} className="hero-text-shadow flex items-center gap-2 text-sm text-navy-200">
                  <b.icon className="h-4 w-4 text-gold-400" />
                  {b.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------- Market reference bar */}
      <MarketRefsBar
        title={dict.commodities.marketRefs}
        note={dict.commodities.marketRefsNote}
        lang={lang}
      />

      {/* -------------------------------------------------- Partner logos */}
      <section className="border-b border-navy-100 bg-white">
        <div className="container-site py-8">
          <p className="mb-5 text-center text-[11px] font-bold uppercase tracking-[0.22em] text-navy-400">
            {dict.home.partnersTitle}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {partnerLogos.map((logo) => (
              <span
                key={logo}
                className="text-sm font-extrabold tracking-widest text-navy-300"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Categories */}
      <section className="bg-navy-50/60 py-20">
        <div className="container-site">
          <SectionHeading
            kicker={dict.home.kickers.categories}
            title={dict.home.categoriesTitle}
            subtitle={dict.home.categoriesSubtitle}
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat];
              return (
                <Link
                  key={cat}
                  href={`/${lang}/projects?category=${cat}`}
                  className="group rounded-xl border border-navy-100 bg-white p-6 shadow-card transition hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-card-hover"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-900 text-gold-400 transition group-hover:bg-navy-800">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-bold text-navy-950">
                    {dict.categories[cat]}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-navy-400">
                    {countByCategory[cat] ?? 0}{" "}
                    {(countByCategory[cat] ?? 0) === 1
                      ? dict.common.projectSingular
                      : dict.common.projects}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Featured */}
      <section className="py-20">
        <div className="container-site">
          <SectionHeading
            kicker={dict.home.kickers.featured}
            title={dict.home.featuredTitle}
            subtitle={dict.home.featuredSubtitle}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <ProjectCard key={p.id} project={p} lang={lang} dict={dict} priority={i < 3} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href={`/${lang}/projects`} variant="outline" size="lg">
              {dict.common.viewAll}
              <IconArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- World map */}
      <section className="bg-navy-950 py-20">
        <div className="container-site">
          <SectionHeading
            kicker={dict.home.kickers.map}
            title={dict.home.mapTitle}
            subtitle={dict.home.mapSubtitle}
            dark
          />
          <WorldMap
            pins={pins}
            lang={lang}
            categoryLabels={dict.categories as unknown as Record<string, string>}
          />

          {/* Stats band — animated counters */}
          <div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              {
                node: <CountUp value={published.length} />,
                label: dict.home.statProjects,
              },
              {
                node: <CountUp value={countries.size} />,
                label: dict.home.statCountries,
              },
              {
                node: (
                  <CountUp
                    value={pipeline / 1_000_000_000}
                    prefix="USD "
                    suffix="B"
                    decimals={1}
                  />
                ),
                label: dict.home.statPipeline,
              },
              {
                // Demo maturity figure, consistent with the Recently Closed section.
                node: <CountUp value={27} />,
                label: dict.home2.statDeals,
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/10 bg-white/5 p-6 text-center"
              >
                <p className="text-3xl font-extrabold text-gold-400 sm:text-4xl">
                  {s.node}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-navy-300">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- How it works */}
      <section className="py-20">
        <div className="container-site">
          <SectionHeading
            kicker={dict.home.kickers.how}
            title={dict.home.howTitle}
            subtitle={dict.home.howSubtitle}
          />
          <div className="grid gap-10 lg:grid-cols-2">
            {[
              { title: dict.home.sellersTitle, steps: dict.home.sellerSteps, cta: { href: `/${lang}/for-sellers`, label: dict.nav.forSellers } },
              { title: dict.home.investorsTitle, steps: dict.home.investorSteps, cta: { href: `/${lang}/for-investors`, label: dict.nav.forInvestors } },
            ].map((col) => (
              <Card key={col.title} className="p-8">
                <h3 className="text-xl font-bold text-navy-950">{col.title}</h3>
                <ol className="mt-6 space-y-6">
                  {col.steps.map((step, i) => (
                    <li key={step.title} className="flex gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy-900 text-sm font-bold text-gold-400">
                        {i + 1}
                      </span>
                      <div>
                        <h4 className="font-bold text-navy-900">{step.title}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-navy-500">
                          {step.text}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
                <Link
                  href={col.cta.href}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-navy-700 hover:text-gold-600"
                >
                  {dict.common.learnMore}
                  <IconArrowRight className="h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- Recently closed */}
      <section className="py-20">
        <div className="container-site">
          <SectionHeading
            kicker={dict.closedDeals.kicker}
            title={dict.closedDeals.title}
            subtitle={dict.closedDeals.subtitle}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {dict.closedDeals.items.map((deal, i) => (
              <Reveal key={deal.asset} delay={i * 60}>
                <Card className="flex h-full flex-col p-6">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200">
                      <IconCheck className="h-3.5 w-3.5" />
                      Closed
                    </Badge>
                    <span className="text-xs font-semibold text-navy-400">{deal.date}</span>
                  </div>
                  <p className="mt-4 font-bold leading-snug text-navy-950">{deal.asset}</p>
                  <p className="mt-1 flex-1 text-sm text-navy-500">{deal.outcome}</p>
                  <p className="mt-4 border-t border-navy-100 pt-3 text-xl font-extrabold text-navy-900">
                    {deal.value}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Insights */}
      <section className="bg-navy-50/60 py-20">
        <div className="container-site">
          <SectionHeading
            kicker={dict.insights.kicker}
            title={dict.insights.title}
            subtitle={dict.insights.subtitle}
          />
          <div className="grid gap-6 md:grid-cols-3">
            {INSIGHTS.slice(0, 3).map((article, i) => {
              const l = lang === "es" ? "es" : "en";
              return (
                <Reveal key={article.slug} delay={i * 60}>
                  <Link
                    href={`/${lang}/insights/${article.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-xl border border-navy-100 bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
                  >
                    <div className="relative h-40 overflow-hidden bg-navy-100">
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
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display text-lg font-bold leading-snug text-navy-950 group-hover:text-navy-700">
                        {article[l].title}
                      </h3>
                      <p className="mt-2 line-clamp-2 flex-1 text-sm text-navy-500">
                        {article[l].excerpt}
                      </p>
                      <p className="mt-3 text-xs text-navy-400">
                        {article.author} · {formatDate(article.date, lang)}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <ButtonLink href={`/${lang}/insights`} variant="outline">
              {dict.insights.landingCta}
              <IconArrowRight className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Commodities */}
      <section className="border-y border-navy-100 bg-white py-20">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-500">
              {dict.commodities.landingKicker}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy-950 sm:text-4xl">
              {dict.commodities.landingTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-navy-500">
              {dict.commodities.landingText}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href={`/${lang}/commodities`} variant="primary" size="lg">
                {dict.commodities.landingCta}
                <IconArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink
                href={`/${lang}/dashboard/commodities/new`}
                variant="outline"
                size="lg"
              >
                {dict.commodities.postCta}
              </ButtonLink>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { key: "copper_cathodes", icon: CATEGORY_ICONS.mining },
                { key: "lithium_carbonate", icon: CATEGORY_ICONS.energy },
                { key: "iron_ore", icon: CATEGORY_ICONS.manufacturing },
                { key: "fishmeal", icon: CATEGORY_ICONS.agro },
              ] as const
            ).map(({ key, icon: Icon }) => (
              <Link
                key={key}
                href={`/${lang}/commodities?commodity=${key}`}
                className="rounded-xl border border-navy-100 bg-navy-50/60 p-5 transition hover:-translate-y-0.5 hover:border-gold-300 hover:shadow-card"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-900 text-gold-400">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-3 font-bold text-navy-950">
                  {dict.commodities.names[key]}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- Testimonials */}
      <section className="bg-navy-50/60 py-20">
        <div className="container-site">
          <SectionHeading
            kicker={dict.home.kickers.testimonials}
            title={dict.home.testimonialsTitle}
          />
          <div className="grid gap-6 md:grid-cols-3">
            {dict.home.testimonials.map((t) => (
              <Card key={t.author} className="flex flex-col p-7">
                <p className="text-gold-500">★★★★★</p>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-navy-700">
                  “{t.quote}”
                </blockquote>
                <footer className="mt-5 border-t border-navy-100 pt-4">
                  <p className="text-sm font-bold text-navy-900">{t.author}</p>
                  <p className="text-xs text-navy-400">{t.location}</p>
                </footer>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- CTA */}
      <section className="relative overflow-hidden bg-navy-950 py-20">
        <div className="absolute inset-0 bg-grid-dots opacity-40" />
        <div className="container-site relative text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {dict.home.ctaTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-navy-200">{dict.home.ctaSubtitle}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href={`/${lang}/auth/register`} variant="gold" size="lg">
              {dict.home.ctaSellers}
            </ButtonLink>
            <ButtonLink href={`/${lang}/projects`} variant="outline-light" size="lg">
              {dict.home.ctaInvestors}
            </ButtonLink>
            <ButtonLink
              href={`/${lang}/dashboard/mandates/new`}
              variant="outline-light"
              size="lg"
            >
              {dict.mandates.postCta}
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
