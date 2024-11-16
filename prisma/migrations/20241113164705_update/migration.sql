/*
  Warnings:

  - Added the required column `userId` to the `Debate` table without a default value. This is not possible if the table is not empty.
  - Made the column `userId` on table `Topic` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Topic" DROP CONSTRAINT "Topic_userId_fkey";

-- AlterTable
ALTER TABLE "Debate" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Reporting" ADD COLUMN     "isModeration2Required" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "Topic" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Topic" ADD CONSTRAINT "Topic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
