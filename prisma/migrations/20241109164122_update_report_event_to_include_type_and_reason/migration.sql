/*
  Warnings:

  - Added the required column `reason` to the `ReportingEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReportingEvent" ADD COLUMN     "reason" TEXT NOT NULL;
