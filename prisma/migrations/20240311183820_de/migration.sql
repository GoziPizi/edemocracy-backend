/*
  Warnings:

  - The values [DROITE,GAUCHE,EXTREME_DROITE,EXTREME_GAUCHE,CENTRE,AUTRE] on the enum `Affiliation` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Affiliation_new" AS ENUM ('RIGHT', 'LEFT', 'FAR_RIGHT', 'FAR_LEFT', 'CENTER');
ALTER TABLE "User" ALTER COLUMN "affiliation" TYPE "Affiliation_new" USING ("affiliation"::text::"Affiliation_new");
ALTER TYPE "Affiliation" RENAME TO "Affiliation_old";
ALTER TYPE "Affiliation_new" RENAME TO "Affiliation";
DROP TYPE "Affiliation_old";
COMMIT;
