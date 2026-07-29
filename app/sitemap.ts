import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { locales } from "@/lib/i18n";

// Project listings are database-driven — serve the sitemap on demand instead
// of freezing it (and requiring a reachable database) at build time.
export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/projects",
    "/companies",
    "/needs",
    "/suppliers",
    "/tenders",
    "/matching",
    "/services",
    "/about",
    "/how-it-works",
    "/for-sellers",
    "/for-investors",
    "/contact",
    "/terms",
    "/privacy",
  ];

  const projects = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  const entries: MetadataRoute.Sitemap = [];
  for (const lang of locales) {
    for (const path of staticPaths) {
      entries.push({
        url: `${BASE_URL}/${lang}${path}`,
        changeFrequency: "daily",
        priority: path === "" ? 1 : 0.7,
      });
    }
    for (const p of projects) {
      entries.push({
        url: `${BASE_URL}/${lang}/projects/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }
  return entries;
}
