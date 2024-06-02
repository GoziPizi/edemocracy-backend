import ReportRepository from "@/repositories/ReportRepository";
import { ReportingType } from "@prisma/client";
import ArgumentService from "./ArgumentService";
import PartyService from "./PartyService";
import DebateService from "./DebateService";
import TopicService from "./TopicService";

class ModerationService {

    private static reportRepository: ReportRepository = new ReportRepository()

    static async report(id: string, type: ReportingType){
        this.reportRepository.createReport(id, type);
    }

    static async getReports(){
        return this.reportRepository.getReports();
    }

    static async ignoreReport(id: string){
        this.reportRepository.deleteReport(id);
    }

    static async deleteEntity(id: string){
        const report = await this.reportRepository.getReport(id);
        if(!report) {
            throw new Error('Report not found');
        }
        try {
            switch(report.entityType) {
                case ReportingType.ARGUMENT:
                    ArgumentService.deleteArgument(report.entityId);
                    break;
                case ReportingType.COMMENT:
                    PartyService.forceDeleteComment(report.entityId);
                    break;
                case ReportingType.DEBATE:
                    DebateService.deleteDebate(report.entityId);
                    break;
                case ReportingType.TOPIC:
                    TopicService.deleteTopic(report.entityId);
                    break;
                case ReportingType.REFORMULATION:
                    DebateService.deleteReformulation(report.entityId);
                    break;
            }
        } catch (error) {
            console.log(error);
        }
        this.reportRepository.deleteReport(id);
    }

    static async banUser(id: string){ }

}

export default ModerationService;