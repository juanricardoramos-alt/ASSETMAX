-- Rebrand: ASSETMAX Global -> VORTAMAX Global.
-- Renames the demo-account emails and company already present in databases
-- seeded under the old brand. No-op on fresh databases (seeded post-rebrand).
UPDATE "User"
SET "email" = replace("email", '@assetmax.global', '@vortamax.global')
WHERE "email" LIKE '%@assetmax.global';

UPDATE "User"
SET "company" = 'VORTAMAX Global'
WHERE "company" = 'ASSETMAX Global';
