// Database step of the Vercel build (see "vercel-build" in package.json).
//
// 1. Probes database connectivity. If the database is unreachable from the
//    build environment, the step logs a warning and EXITS SUCCESSFULLY —
//    deploys must never depend on database connectivity (the schema can
//    always be managed via the SQL Editor scripts in prisma/supabase-*.sql,
//    and the app connects at runtime through the pooled URL).
// 2. Applies pending Prisma migrations against the production database.
// 3. Seeds demo accounts + content ONLY when the database is empty (first
//    deploy). Later deploys never touch existing data.
//
// Pooler note: migrations need a session-capable connection. If
// DIRECT_DATABASE_URL is not set, the pooled URL is converted automatically:
//   - Supabase: transaction pooler (port 6543, pgbouncer=true) → SESSION
//     pooler: same host and tenant user, port 5432, pgbouncer params dropped.
//     (The "direct" db.<ref>.supabase.co host is IPv6-only and unreachable
//     from IPv4 build environments like Vercel — never derive it.)
//   - Neon: drop the "-pooler" host segment.
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
      // Supabase session pooler: same host and "postgres.<ref>" user as the
      // transaction pooler, but port 5432 and no PgBouncer semantics — safe
      // for prisma migrate and reachable over IPv4.
      u.port = "5432";
      u.searchParams.delete("pgbouncer");
      u.searchParams.delete("connection_limit");
      return u.toString();
    }
  } catch {
    /* fall through to the Neon-style rewrite */
  }
  return pooled.replace("-pooler.", ".");
}

const directUrl =
  process.env.DIRECT_DATABASE_URL?.trim() || deriveDirectUrl(url);
const env = { ...process.env, DATABASE_URL: directUrl };

const { PrismaClient } = await import("@prisma/client");
const prisma = new PrismaClient({ datasources: { db: { url: directUrl } } });

// --- 1. Connectivity probe -------------------------------------------------
try {
  await prisma.$queryRaw`SELECT 1`;
} catch (e) {
  const lines = (e?.message ?? "").split("\n").map((l) => l.trim());
  const reason =
    lines.find((l) => /P1\d{3}|Can't reach|timed? ?out|ECONN|ENOTFOUND/i.test(l)) ??
    lines.find(Boolean) ??
    "connection error";
  console.warn(
    `[deploy-db] Database unreachable from the build environment (${reason}).`
  );
  console.warn(
    "[deploy-db] Skipping migrations and seed — the build continues. " +
      "Schema state is managed via prisma/migrations (or the SQL Editor " +
      "scripts prisma/supabase-*.sql); the app connects at runtime through DATABASE_URL."
  );
  await prisma.$disconnect();
  process.exit(0);
}

// --- 2. Migrations (the database IS reachable: real failures fail the build)
console.log("[deploy-db] Applying migrations…");
try {
  execSync("npx prisma migrate deploy", { stdio: "inherit", env });
} catch {
  // P3005: the schema is not empty but has no _prisma_migrations table —
  // this happens when the database was created by pasting the initial
  // migration SQL by hand (e.g. in the Supabase SQL Editor). Baseline the
  // hand-applied init migration and retry so later migrations apply normally.
  console.log(
    "[deploy-db] migrate deploy failed — attempting baseline of the hand-applied init migration…"
  );
  execSync("npx prisma migrate resolve --applied 20260728233421_init", {
    stdio: "inherit",
    env,
  });
  execSync("npx prisma migrate deploy", { stdio: "inherit", env });
}

// --- 3. First-deploy seed (empty database only) ----------------------------
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
