/*
  Warnings:

  - You are about to drop the column `formationName` on the `PreRegistrationUser` table. All the data in the column will be lost.
  - You are about to drop the column `formationObtention` on the `PreRegistrationUser` table. All the data in the column will be lost.
  - You are about to drop the column `formationName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `formationObtention` on the `User` table. All the data in the column will be lost.
  - Added the required column `city` to the `PreRegistrationUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `PreRegistrationUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postalCode` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idNationality1` to the `VerifyUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PreRegistrationUser" DROP COLUMN "formationName",
DROP COLUMN "formationObtention",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "idNationality1" INTEGER,
ADD COLUMN     "idNationality2" INTEGER,
ADD COLUMN     "idNationality3" INTEGER,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "yearsOfExperience" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "formationName",
DROP COLUMN "formationObtention",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "postalCode" TEXT NOT NULL,
ADD COLUMN     "yearsOfExperience" INTEGER;

-- AlterTable
ALTER TABLE "VerifyUser" ADD COLUMN     "idNationality1" TEXT NOT NULL,
ADD COLUMN     "idNationality2" TEXT,
ADD COLUMN     "idNationality3" TEXT,
ADD COLUMN     "idNumber3" TEXT,
ADD COLUMN     "recto3" TEXT,
ADD COLUMN     "verso3" TEXT;

-- CreateTable
CREATE TABLE "UserDiploma" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "obtention" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserDiploma_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreRegistrationDiploma" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "obtention" TEXT NOT NULL,
    "preRegistrationId" TEXT NOT NULL,

    CONSTRAINT "PreRegistrationDiploma_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserDiploma" ADD CONSTRAINT "UserDiploma_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreRegistrationDiploma" ADD CONSTRAINT "PreRegistrationDiploma_preRegistrationId_fkey" FOREIGN KEY ("preRegistrationId") REFERENCES "PreRegistrationUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
