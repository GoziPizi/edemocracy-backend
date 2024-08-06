/*
  Warnings:

  - You are about to drop the column `formationDuration` on the `PreRegistrationUser` table. All the data in the column will be lost.
  - You are about to drop the column `formationDuration` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PreRegistrationUser" DROP COLUMN "formationDuration",
ADD COLUMN     "formationObtention" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "formationDuration",
ADD COLUMN     "formationObtention" INTEGER;
