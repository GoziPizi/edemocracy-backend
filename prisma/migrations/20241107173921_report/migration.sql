-- CreateTable
CREATE TABLE "ReportingEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "reportingId" TEXT,

    CONSTRAINT "ReportingEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReportingEvent" ADD CONSTRAINT "ReportingEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportingEvent" ADD CONSTRAINT "ReportingEvent_reportingId_fkey" FOREIGN KEY ("reportingId") REFERENCES "Reporting"("id") ON DELETE SET NULL ON UPDATE CASCADE;
