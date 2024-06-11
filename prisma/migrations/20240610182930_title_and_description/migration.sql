/*
  Warnings:

  - You are about to drop the column `anonymous` on the `Argument` table. All the data in the column will be lost.
  - Added the required column `title` to the `Argument` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `DebateDescriptionReformulation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Argument" DROP COLUMN "anonymous",
ADD COLUMN     "isNameDisplayed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPoliticSideDisplayed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isWorkDisplayed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DebateDescriptionReformulation" ADD COLUMN     "isNameDisplayed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPoliticSideDisplayed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isWorkDisplayed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "title" TEXT NOT NULL;
