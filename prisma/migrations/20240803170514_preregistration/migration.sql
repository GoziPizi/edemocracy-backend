-- CreateTable
CREATE TABLE "PreRegistrationUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "profession" TEXT,
    "profilePicture" TEXT,
    "formationName" TEXT,
    "formationDuration" TEXT,
    "birthSex" TEXT,
    "actualSex" TEXT,
    "sexualOrientation" TEXT,
    "religion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PreRegistrationUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PreRegistrationUser_email_key" ON "PreRegistrationUser"("email");
