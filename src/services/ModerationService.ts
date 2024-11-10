import ReportRepository from "@/repositories/ReportRepository";
import { ReportingType } from "@prisma/client";
import ArgumentService from "./ArgumentService";
import PartyService from "./PartyService";
import DebateService from "./DebateService";
import TopicService from "./TopicService";

class ModerationService {

    private static reportRepository: ReportRepository = new ReportRepository()

    //Gives the ability for any authenticated user to report an entity.
    //If there is no current report for this entity, a new report is created.
    //If there is already a report for this entity, the array of events is updated.
    static async report(reporterId: string, entityId: string, entityType: ReportingType, reason: string){
        let currentReport = await this.reportRepository.getReportFromEntity(entityId);
        if(currentReport) {
            await this.reportRepository.addEventToReport(currentReport.id, reason,'report', reporterId);
        } else {
            currentReport = await this.reportRepository.initializeEmptyReportForEntity(entityId, entityType)
            await this.reportRepository.addEventToReport(currentReport.id, reason,'report', reporterId);
        }
        const report = await this.reportRepository.updateReportTime(currentReport.id)
        return report;
    }

    static async getReports(){
        return this.reportRepository.getReports();
    }

    static async getReport(id: string){
        const events = await this.reportRepository.getEvents(id);
        const report = await this.reportRepository.getReport(id);
        const result = {
            ...report,
            events
        }
        return result;
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