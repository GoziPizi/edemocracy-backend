import { ReportingType } from "@prisma/client";

export function ReportIntToReportType(a: number): ReportingType {
    switch (a) {
        case 0:
        return ReportingType.TOPIC
        case 1:
        return ReportingType.DEBATE;
        case 2:
        return ReportingType.ARGUMENT;
        case 3:
        return ReportingType.COMMENT;
        case 4:
        return ReportingType.REFORMULATION;
        default:
        throw new Error('Invalid ReportingType');
    }
}