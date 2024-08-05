/*
  Warnings:

  - You are about to drop the column `recto` on the `VerifyUser` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `VerifyUser` table. All the data in the column will be lost.
  - You are about to drop the column `verso` on the `VerifyUser` table. All the data in the column will be lost.
  - Added the required column `email` to the `VerifyUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idNumber1` to the `VerifyUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recto1` to the `VerifyUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verso1` to the `VerifyUser` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "VerifyUser" DROP CONSTRAINT "VerifyUser_userId_fkey";

-- AlterTable
ALTER TABLE "VerifyUser" DROP COLUMN "recto",
DROP COLUMN "userId",
DROP COLUMN "verso",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "idNumber1" TEXT NOT NULL,
ADD COLUMN     "idNumber2" TEXT,
ADD COLUMN     "recto1" TEXT NOT NULL,
ADD COLUMN     "recto2" TEXT,
ADD COLUMN     "verso1" TEXT NOT NULL,
ADD COLUMN     "verso2" TEXT;
