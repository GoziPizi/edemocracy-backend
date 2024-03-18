/*
  Warnings:

  - Added the required column `founderId` to the `Party` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Party" ADD COLUMN     "founderId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Party" ADD CONSTRAINT "Party_founderId_fkey" FOREIGN KEY ("founderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
