/*
  Warnings:

  - Added the required column `politicSide` to the `PreRegistrationUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PreRegistrationUser" ADD COLUMN     "politicSide" "Affiliation" NOT NULL;
