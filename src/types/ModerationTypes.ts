import { ReportingEvent } from "@prisma/client";

export type ReportingEventInputDto = Omit<ReportingEvent, 'id' | 'createdAt' | 'updatedAt' | 'userId'>;