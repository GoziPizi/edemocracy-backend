import { ReportingType } from "@prisma/client";
import PrismaRepository from "./PrismaRepository";

class ReportRepository extends PrismaRepository {
    
    createReport = async (id: string, type: ReportingType) => {
        const report = await this.prismaClient.reporting.create({
            data: {
                entityType: type,
                entityId: id
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

    getReport = async (id: string) => {
        const report = await this.prismaClient.reporting.findUnique({
            where: {
                id
            }
        });
        return report;
    }
}

export default ReportRepository;