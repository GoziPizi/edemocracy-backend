-- CreateEnum
CREATE TYPE "DebateVoteType" AS ENUM ('FOR', 'AGAINST', 'NEUTRAL', 'REALLY_FOR', 'REALLY_AGAINST');

-- CreateTable
CREATE TABLE "DebateVote" (
    "id" TEXT NOT NULL,
    "value" "DebateVoteType" NOT NULL,
    "userId" TEXT NOT NULL,
    "debateId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DebateVote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DebateVote" ADD CONSTRAINT "DebateVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DebateVote" ADD CONSTRAINT "DebateVote_debateId_fkey" FOREIGN KEY ("debateId") REFERENCES "Debate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
