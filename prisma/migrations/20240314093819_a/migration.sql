/*
  Warnings:

  - Added the required column `userId` to the `Argument` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Argument" DROP CONSTRAINT "Argument_id_fkey";

-- AlterTable
ALTER TABLE "Argument" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Argument" ADD CONSTRAINT "Argument_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
