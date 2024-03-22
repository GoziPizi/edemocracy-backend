/*
  Warnings:

  - You are about to drop the column `content` on the `Opinion` table. All the data in the column will be lost.
  - Added the required column `opinion` to the `Opinion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Opinion" DROP COLUMN "content",
ADD COLUMN     "opinion" TEXT NOT NULL;
