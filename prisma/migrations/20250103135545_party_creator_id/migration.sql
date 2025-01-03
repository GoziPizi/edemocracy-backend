/*
  Warnings:

  - You are about to drop the column `isOwnedByParty` on the `Debate` table. All the data in the column will be lost.
  - You are about to drop the column `isOwnedByPersonality` on the `Debate` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Debate" DROP COLUMN "isOwnedByParty",
DROP COLUMN "isOwnedByPersonality",
ADD COLUMN     "partyCreatorId" TEXT,
ADD COLUMN     "personalityCreatorId" TEXT;
