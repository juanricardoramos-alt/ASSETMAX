-- =============================================================================
-- VORTAMAX Global — Supabase upgrade 1/2: schema baseline & delta DDL
-- =============================================================================
-- For a database whose 28 tables were created by pasting
-- prisma/migrations/20260728233421_init/migration.sql into the SQL Editor.
--
-- This script (all steps idempotent — safe to run more than once):
--   1. Creates Prisma's _prisma_migrations bookkeeping table.
--   2. Records the hand-applied init migration as applied.
--   3. Applies the delta DDL: 'translations' column on 6 tables +
--      the GeneratedDocument table (contract-templates library).
--   4. Records the delta migration as applied, so automatic migrations on
--      every Vercel deploy (scripts/deploy-db.mjs) take over from here.
--
-- Run BEFORE prisma/supabase-02-data-upgrade.sql.
-- Expected result: a two-row table with both migrations listed as applied.
-- =============================================================================

BEGIN;

-- 1. Prisma migrations bookkeeping table (exact shape Prisma expects).
CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id"                    VARCHAR(36) PRIMARY KEY NOT NULL,
    "checksum"              VARCHAR(64) NOT NULL,
    "finished_at"           TIMESTAMPTZ,
    "migration_name"        VARCHAR(255) NOT NULL,
    "logs"                  TEXT,
    "rolled_back_at"        TIMESTAMPTZ,
    "started_at"            TIMESTAMPTZ NOT NULL DEFAULT now(),
    "applied_steps_count"   INTEGER NOT NULL DEFAULT 0
);

-- 2. Baseline: the init migration was applied by hand in the SQL Editor.
INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT gen_random_uuid()::text, 'fc4883f3f47b15ee7ec50899c234082b77e1d44493aca318ca6692eb9a4c8663', now(), '20260728233421_init', now(), 1
WHERE NOT EXISTS (
  SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260728233421_init'
);

-- 3. Delta DDL (mirrors prisma/migrations/20260729003754_main_features_and_ecosystem_i18n).
ALTER TABLE "CommodityListing" ADD COLUMN IF NOT EXISTS "translations" TEXT NOT NULL DEFAULT '{}';
ALTER TABLE "CompanyProfile"   ADD COLUMN IF NOT EXISTS "translations" TEXT NOT NULL DEFAULT '{}';
ALTER TABLE "Mandate"          ADD COLUMN IF NOT EXISTS "translations" TEXT NOT NULL DEFAULT '{}';
ALTER TABLE "Need"             ADD COLUMN IF NOT EXISTS "translations" TEXT NOT NULL DEFAULT '{}';
ALTER TABLE "Project"          ADD COLUMN IF NOT EXISTS "translations" TEXT NOT NULL DEFAULT '{}';
ALTER TABLE "SupplierProfile"  ADD COLUMN IF NOT EXISTS "translations" TEXT NOT NULL DEFAULT '{}';

CREATE TABLE IF NOT EXISTS "GeneratedDocument" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "partyA" TEXT NOT NULL,
    "partyB" TEXT NOT NULL,
    "projectId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeneratedDocument_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'GeneratedDocument_createdById_fkey'
  ) THEN
    ALTER TABLE "GeneratedDocument"
      ADD CONSTRAINT "GeneratedDocument_createdById_fkey"
      FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- 4. Record the delta migration as applied.
INSERT INTO "_prisma_migrations" ("id", "checksum", "finished_at", "migration_name", "started_at", "applied_steps_count")
SELECT gen_random_uuid()::text, '73e2216801d414a7c2684b91e0fd50f67192093a7cec3995733a27c8efe64e97', now(), '20260729003754_main_features_and_ecosystem_i18n', now(), 1
WHERE NOT EXISTS (
  SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = '20260729003754_main_features_and_ecosystem_i18n'
);

COMMIT;

-- Verification: both migrations must appear as applied.
SELECT "migration_name", "finished_at" IS NOT NULL AS applied
FROM "_prisma_migrations" ORDER BY "migration_name";
