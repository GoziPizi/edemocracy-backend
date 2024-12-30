-- AlterTable
ALTER TABLE "Debate" ADD COLUMN     "isOwnedByParty" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isOwnedByPersonality" BOOLEAN NOT NULL DEFAULT false;
