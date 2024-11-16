import { Reporting, ReportingEvent } from "@prisma/client";


//concatenation of the two types : report and event
export type personalReport = {report: Reporting, sanction: ReportingEvent};