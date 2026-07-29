// Database step of the Vercel build (see "vercel-build" in package.json).
//
// 1. Applies pending Prisma migrations against the production database.
// 2. Seeds demo accounts + content ONLY when the database is empty (first
//    deploy). Later deploys never touch existing data.
//
// Pooler note: migrations need a direct (non-pooled) connection. If
// DIRECT_DATABASE_URL is not set, the pooled URL is converted automatically:
//   - Neon:      drop the "-pooler" host segment.
//   - Supabase:  "postgres.<ref>@aws-X-<region>.pooler.supabase.com:6543" →
//                "postgres@db.<ref>.supabase.co:5432" (pgbouncer params dropped).
// Both transformations are no-ops for URLs that are already direct.

import { execSync } from "node:child_process";

const url = process.env.DATABASE_URL ?? "";

if (!/^postgres(ql)?:\/\//i.test(url)) {
  console.log(
    "[deploy-db] DATABASE_URL is not a PostgreSQL URL — skipping migrations and seed (local build)."
  );
  process.exit(0);
}

function deriveDirectUrl(pooled) {
  try {
    const u = new URL(pooled);
    if (u.hostname.endsWith(".pooler.supabase.com")) {
      // Username on the Supabase pooler is "postgres.<project-ref>".
      const ref = u.username.split(".")[1];
      if (ref) {
        u.hostname = `db.${ref}.supabase.co`;
        u.port = "5432";
        u.username = "postgres";
        u.searchParams.delete("pgbouncer");
        u.searchParams.delete("connection_limit");
        return u.toString();
      }
    }
  } catch {
    /* fall through to the Neon-style rewrite */
  }
  return pooled.replace("-pooler.", ".");
}

const directUrl =
  process.env.DIRECT_DATABASE_URL?.trim() || deriveDirectUrl(url);
const env = { ...process.env, DATABASE_URL: directUrl };

console.log("[deploy-db] Applying migrations…");
execSync("npx prisma migrate deploy", { stdio: "inherit", env });

const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient({ datasources: { db: { url: directUrl } } });

try {
  const users = await prisma.user.count();
  if (users === 0) {
    console.log("[deploy-db] Empty database detected — running demo seed…");
    execSync("npx tsx prisma/seed.ts", { stdio: "inherit", env });
  } else {
    console.log(`[deploy-db] Database already has ${users} users — seed skipped.`);
  }
} finally {
  await prisma.$disconnect();
}
