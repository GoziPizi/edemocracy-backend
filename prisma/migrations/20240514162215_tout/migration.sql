/*
  Warnings:

  - You are about to drop the column `nbVotes` on the `Debate` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `Debate` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[debateResultId]` on the table `Debate` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[debateContributorsResultId]` on the table `Debate` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `debateContributorsResultId` to the `Debate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `debateResultId` to the `Debate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Debate" DROP COLUMN "nbVotes",
DROP COLUMN "score",
ADD COLUMN     "debateContributorsResultId" TEXT NOT NULL,
ADD COLUMN     "debateResultId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DebateVote" ADD COLUMN     "isFromContributor" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "DebateResult" (
    "id" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "nbVotes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "DebateResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Debate_debateResultId_key" ON "Debate"("debateResultId");

-- CreateIndex
CREATE UNIQUE INDEX "Debate_debateContributorsResultId_key" ON "Debate"("debateContributorsResultId");
