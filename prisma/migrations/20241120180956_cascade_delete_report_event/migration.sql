-- DropForeignKey
ALTER TABLE "ReportingEvent" DROP CONSTRAINT "ReportingEvent_reportingId_fkey";

-- AddForeignKey
ALTER TABLE "ReportingEvent" ADD CONSTRAINT "ReportingEvent_reportingId_fkey" FOREIGN KEY ("reportingId") REFERENCES "Reporting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
