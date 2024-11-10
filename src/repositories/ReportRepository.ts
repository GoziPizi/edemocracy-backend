import { ReportingType } from "@prisma/client";
import PrismaRepository from "./PrismaRepository";
import { connect } from "http2";

class ReportRepository extends PrismaRepository {
    
    initializeEmptyReportForEntity = async (entityId: string, entityType: ReportingType) => {
        
        const report = await this.prismaClient.reporting.create({
            data: {
                entityId,
                entityType
            }
        });
        return report;
    }

    addEventToReport = async (reportId: string,reason: string, type: string, userId: string) => {
        const event = await this.prismaClient.reportingEvent.create({
            //Connects the user to the event
            data: {
                type,
                reason,
                reportingId: reportId,
                userId
            }
        });
        return event;
    }

    getReport = async (id: string) => {
        const report = await this.prismaClient.reporting.findUnique({
            where: {
                id
            }
        });
        return report;
    }

    getReportFromEntity = async (entityId: string) => {
        const report = await this.prismaClient.reporting.findFirst({
            where: {
                entityId
            }
        });   
        return report;
    }

    getEvents = async (reportId: string) => {
        const events = await this.prismaClient.reportingEvent.findMany({
            where: {
                reportingId: reportId
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return events;
    }

    updateReportTime = async(reportId: string) => {
        const report = await this.prismaClient.reporting.update({
            where: {
                id: reportId
            },
            data: {
                updatedAt: new Date()
            }
        });
        return report;
    }

    deleteReport = async (id: string) => {
        const report = await this.prismaClient.reporting.delete({
            where: {
                id
            }
        });
        return report;
    }

    getReports = async () => {
        const reports = await this.prismaClient.reporting.findMany();
        return reports;
    }
}

export default ReportRepository;