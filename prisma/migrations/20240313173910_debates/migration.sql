/*
  Warnings:

  - You are about to drop the column `topicId` on the `Argument` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Argument" DROP CONSTRAINT "Argument_topicId_fkey";

-- AlterTable
ALTER TABLE "Argument" DROP COLUMN "topicId",
ADD COLUMN     "debateId" TEXT;

-- AlterTable
ALTER TABLE "Topic" ADD COLUMN     "debates" TEXT[];

-- CreateTable
CREATE TABLE "Debate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "topicId" TEXT,

    CONSTRAINT "Debate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Argument" ADD CONSTRAINT "Argument_debateId_fkey" FOREIGN KEY ("debateId") REFERENCES "Debate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
