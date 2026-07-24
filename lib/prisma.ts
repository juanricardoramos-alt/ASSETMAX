import { PrismaClient } from "@prisma/client";

// Neon's connection pooler (PgBouncer, "-pooler" host) needs pgbouncer=true so
// Prisma avoids prepared-statement reuse across pooled connections.
function databaseUrl(): string | undefined {
  const url = process.env.DATABASE_URL;
  if (!url || !url.includes("-pooler.") || url.includes("pgbouncer=")) return url;
  return url + (url.includes("?") ? "&" : "?") + "pgbouncer=true";
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ datasources: { db: { url: databaseUrl() } } });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
