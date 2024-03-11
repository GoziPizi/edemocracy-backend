/*
  Warnings:

  - You are about to drop the column `affiliation` on the `User` table. All the data in the column will be lost.
  - Added the required column `politicSide` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "affiliation",
ADD COLUMN     "politicSide" "Affiliation" NOT NULL;
