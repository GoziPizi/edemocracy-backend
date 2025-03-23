/*
  Warnings:

  - You are about to drop the column `origin` on the `PreRegistrationUser` table. All the data in the column will be lost.
  - You are about to drop the column `origin` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PreRegistrationUser" DROP COLUMN "origin",
ADD COLUMN     "origin1" TEXT,
ADD COLUMN     "origin2" TEXT,
ADD COLUMN     "origin3" TEXT,
ADD COLUMN     "origin4" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "origin",
ADD COLUMN     "origin1" TEXT,
ADD COLUMN     "origin2" TEXT,
ADD COLUMN     "origin3" TEXT,
ADD COLUMN     "origin4" TEXT;
