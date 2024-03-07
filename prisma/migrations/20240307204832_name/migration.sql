-- CreateEnum
CREATE TYPE "Affiliation" AS ENUM ('DROITE', 'GAUCHE', 'EXTREME_DROITE', 'EXTREME_GAUCHE', 'CENTRE', 'AUTRE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MODERATOR', 'USER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "affiliation" "Affiliation" NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "language" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
