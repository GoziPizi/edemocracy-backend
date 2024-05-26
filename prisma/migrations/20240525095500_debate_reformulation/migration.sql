-- CreateTable
CREATE TABLE "DebateDescriptionReformulation" (
    "id" TEXT NOT NULL,
    "debateId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DebateDescriptionReformulation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DebateDescriptionReformulation" ADD CONSTRAINT "DebateDescriptionReformulation_debateId_fkey" FOREIGN KEY ("debateId") REFERENCES "Debate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
