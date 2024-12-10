import { ReportingType } from "@prisma/client";
import PrismaRepository from "./PrismaRepository";
import { connect } from "http2";

class ReportRepository extends PrismaRepository {
    
    initializeEmptyReportForEntity = async (entityId: string, entityType: ReportingType, userId: string) => {
        
        const report = await this.prismaClient.reporting.create({
            data: {
                entityId,
                entityType, 
                userId
            }
        });
        return report;
    }

    addEventToReport = async (reportId: string, userId: string, reason: string, type: string, duration?: number, targetedUserId?: string) => {
        const event = await this.prismaClient.reportingEvent.create({
            data: {
                reportingId: reportId,
                userId,
                type,
                reason,
                duration,
                targetedUserId
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

    getSanctions = async (userId: string) => {
        const sanctions = await this.prismaClient.reportingEvent.findMany({
            where: {
                userId,
                type: {
                    in: ['ban', 'mute']
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return sanctions;
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

    setModerated = async (reportId: string) => {
        const report = await this.prismaClient.reporting.update({
            where: {
                id: reportId
            },
            data: {
                isModerated: true
            }
        });
        return report;
    }

    setModerated2 = async (reportId: string) => {
        const report = await this.prismaClient.reporting.update({
            where: {
                id: reportId
            },
            data: {
                isModerated2: true
            }
        })
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

    getRecentReports = async () => {
        const reports = await this.prismaClient.reporting.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        return reports;
    }

    getModeration1Reports = async () => {
        const reports = await this.prismaClient.reporting.findMany({
            where: {
                isModeration2Required: false,
                isModerated: false
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return reports;
    }

    getModeration2Reports = async () => {
        const reports = await this.prismaClient.reporting.findMany({
            where: {
                isModeration2Required: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return reports;
    }

    getPersonalReports = async (userId: string) => {
        const reports = await this.prismaClient.reporting.findMany({
            where: {
                userId,
                isModerated: true
            }, 
            orderBy: {
                createdAt: 'desc'
            }
        });
        return reports;
    }

    setModeration2Required = async (reportId: string) => {
        const report = await this.prismaClient.reporting.update({
            where: {
                id: reportId
            },
            data: {
                isModeration2Required: true
            }
        });
        return report;
    }

    getModerators = async () => {
        const moderators = await this.prismaClient.user.findMany({
            where: {
                role: {
                    in: ['MODERATOR1', 'MODERATOR2', 'ADMIN']
                }
            }
        });
        return moderators.map(moderator => {
            return {
                id: moderator.id,
                name: moderator.name + ' ' + moderator.firstName,
            }
        });
    }

    getFullHistoric = async () => {
        const reports = await this.prismaClient.reportingEvent.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: {
                type: {
                    in: ['ban']
                }
            }
        });
        return reports;
    }

    getHistoricOfModerator = async (userId: string) => {
        const reports = await this.prismaClient.reportingEvent.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            where: {
                userId,
                type: {
                    in: ['ban']
                }
            }
        });
        return reports;
    }

}

export default ReportRepository;