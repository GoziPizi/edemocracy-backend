/*
  Warnings:

  - Added the required column `userId` to the `DebateDescriptionReformulation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DebateDescriptionReformulation" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "DebateDescriptionReformulation" ADD CONSTRAINT "DebateDescriptionReformulation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
