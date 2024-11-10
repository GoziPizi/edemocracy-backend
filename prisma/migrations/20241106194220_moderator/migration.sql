/*
  Warnings:

  - The values [MODERATOR] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - The values [WAITING] on the enum `jackpotStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'MODERATOR1', 'MODERATOR2', 'USER');
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "jackpotStatus_new" AS ENUM ('PENDING', 'REQUESTED');
ALTER TABLE "PersonalJackpot" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "PersonalJackpot" ALTER COLUMN "status" TYPE "jackpotStatus_new" USING ("status"::text::"jackpotStatus_new");
ALTER TYPE "jackpotStatus" RENAME TO "jackpotStatus_old";
ALTER TYPE "jackpotStatus_new" RENAME TO "jackpotStatus";
DROP TYPE "jackpotStatus_old";
ALTER TABLE "PersonalJackpot" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "PersonalJackpot" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);
