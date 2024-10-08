/*
  Warnings:

  - You are about to drop the column `message` on the `Notifications` table. All the data in the column will be lost.
  - Added the required column `contentid` to the `Notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Notifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notifications" DROP COLUMN "message",
ADD COLUMN     "contentid" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;
