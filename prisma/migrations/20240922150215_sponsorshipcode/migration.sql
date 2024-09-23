-- CreateEnum
CREATE TYPE "jackpotStatus" AS ENUM ('WAITING', 'PENDING');

-- AlterTable
ALTER TABLE "PreRegistrationUser" ADD COLUMN     "sponsorshipCode" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "sponsorshipCode" TEXT;

-- CreateTable
CREATE TABLE "PersonalJackpot" (
    "userId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "iban" TEXT,
    "status" "jackpotStatus" NOT NULL DEFAULT 'WAITING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PersonalJackpot_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "PersonalJackpot" ADD CONSTRAINT "PersonalJackpot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
