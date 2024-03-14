/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Personality` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Personality` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Party" ALTER COLUMN "description" SET DEFAULT '',
ALTER COLUMN "reason" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Personality" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "description" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Personality_userId_key" ON "Personality"("userId");
