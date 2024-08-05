/*
  Warnings:

  - You are about to drop the column `contribution` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('NONE', 'STANDARD', 'PREMIUM');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "contribution",
ADD COLUMN     "contributionStatus" "MembershipStatus" DEFAULT 'NONE';
