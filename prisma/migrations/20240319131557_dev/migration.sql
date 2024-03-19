/*
  Warnings:

  - You are about to drop the `Groupe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PartyMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PartyRole" AS ENUM ('MEMBER', 'FOUNDER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "Party" DROP CONSTRAINT "Party_founderId_fkey";

-- DropForeignKey
ALTER TABLE "_PartyMembers" DROP CONSTRAINT "_PartyMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "_PartyMembers" DROP CONSTRAINT "_PartyMembers_B_fkey";

-- DropTable
DROP TABLE "Groupe";

-- DropTable
DROP TABLE "_PartyMembers";

-- CreateTable
CREATE TABLE "PartyMembership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "partyId" TEXT NOT NULL,
    "role" "PartyRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PartyMembership_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PartyMembership" ADD CONSTRAINT "PartyMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartyMembership" ADD CONSTRAINT "PartyMembership_partyId_fkey" FOREIGN KEY ("partyId") REFERENCES "Party"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
