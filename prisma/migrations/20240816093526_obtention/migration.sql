/*
  Warnings:

  - Changed the type of `obtention` on the `PreRegistrationDiploma` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `obtention` on the `UserDiploma` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "PreRegistrationDiploma" DROP COLUMN "obtention",
ADD COLUMN     "obtention" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UserDiploma" DROP COLUMN "obtention",
ADD COLUMN     "obtention" INTEGER NOT NULL;
