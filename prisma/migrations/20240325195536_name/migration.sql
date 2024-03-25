-- CreateTable
CREATE TABLE "VerifyUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "recto" TEXT NOT NULL,
    "verso" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerifyUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "VerifyUser" ADD CONSTRAINT "VerifyUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
