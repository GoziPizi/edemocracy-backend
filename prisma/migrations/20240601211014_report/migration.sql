-- CreateEnum
CREATE TYPE "ReportingType" AS ENUM ('TOPIC', 'DEBATE', 'ARGUMENT', 'REFORMULATION', 'COMMENT');

-- CreateTable
CREATE TABLE "Reporting" (
    "id" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityType" "ReportingType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reporting_pkey" PRIMARY KEY ("id")
);
