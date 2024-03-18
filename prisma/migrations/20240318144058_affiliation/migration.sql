/*
  Warnings:

  - Added the required column `politicSide` to the `Party` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Party" ADD COLUMN     "politicSide" "Affiliation" NOT NULL;
