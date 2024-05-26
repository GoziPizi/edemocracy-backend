-- AlterTable
ALTER TABLE "DebateDescriptionReformulation" ADD COLUMN     "score" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "VoteForReformulation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "debateReformulationId" TEXT NOT NULL,
    "value" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VoteForReformulation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VoteForReformulation" ADD CONSTRAINT "VoteForReformulation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoteForReformulation" ADD CONSTRAINT "VoteForReformulation_debateReformulationId_fkey" FOREIGN KEY ("debateReformulationId") REFERENCES "DebateDescriptionReformulation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
