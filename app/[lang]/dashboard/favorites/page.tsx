import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getDictionary, isLocale, defaultLocale, type Locale } from "@/lib/i18n";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { Card, ButtonLink } from "@/components/ui";

export default async function FavoritesPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang: Locale = isLocale(params.lang) ? params.lang : defaultLocale;
  const dict = await getDictionary(lang);
  const session = await auth();
  if (!session) redirect(`/${lang}/auth/signin`);

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      project: {
        include: {
          images: { orderBy: { order: "asc" } },
          owner: { select: { role: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const published = favorites.filter((f) => f.project.status === "PUBLISHED");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold text-navy-950">
        {dict.dashboard.favorites}
      </h1>
      {published.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-navy-500">{dict.dashboard.emptyFavorites}</p>
          <ButtonLink href={`/${lang}/projects`} variant="primary" className="mt-5">
            {dict.dashboard.emptyFavoritesCta}
          </ButtonLink>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {published.map((f) => (
            <ProjectCard key={f.id} project={f.project} lang={lang} dict={dict} />
          ))}
        </div>
      )}
    </div>
  );
}
