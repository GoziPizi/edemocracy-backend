import ReportRepository from "@/repositories/ReportRepository";
import { ReportingEvent, ReportingType, Role } from "@prisma/client";
import ArgumentService from "./ArgumentService";
import PartyService from "./PartyService";
import DebateService from "./DebateService";
import TopicService from "./TopicService";
import { Forbidden } from "@/exceptions/AdminExceptions";
import { personalReport } from "@/types/dtos/ModerationDtos";
import UserRepository from "@/repositories/UserRepository";

class ModerationService {

    private static reportRepository: ReportRepository = new ReportRepository()
    private static userRepository: UserRepository = new UserRepository()

    //Gives the ability for any authenticated user to report an entity.
    //If there is no current report for this entity, a new report is created.
    //If there is already a report for this entity, the array of events is updated.
    static async report(reporterId: string, entityId: string, entityType: ReportingType, reason: string){
        try {
            let currentReport = await this.reportRepository.getReportFromEntity(entityId);
            if(currentReport) {
                await this.reportRepository.addEventToReport(currentReport.id, reporterId, reason, 'report');
            } else {
                const userId = await ModerationService.getAuthor(entityId, entityType);
                currentReport = await this.reportRepository.initializeEmptyReportForEntity(entityId, entityType, userId)
                await this.reportRepository.addEventToReport(currentReport.id, reporterId, reason, 'report');
            }
            const report = await this.reportRepository.updateReportTime(currentReport.id)
            return report;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static async getAuthor(entityId: string, entityType: string): Promise<string> {
        switch(entityType) {
            case ReportingType.ARGUMENT:
                return await ArgumentService.getAuthor(entityId);
            case ReportingType.COMMENT:
                return await PartyService.getCommentAuthor(entityId);
            case ReportingType.DEBATE:
                return await DebateService.getAuthor(entityId);
            case ReportingType.TOPIC:
                return await TopicService.getAuthor(entityId);
            case ReportingType.REFORMULATION:
                return DebateService.getReformulationAuthor(entityId);
            default:
                return '';
        }
    }

    static async getEntityOfReport(reportId: string): Promise<any>{
        try {
            const report = await this.reportRepository.getReport(reportId);
            if(!report) {
                throw new Error('Report not found');
            }
            switch(report.entityType) {
                case ReportingType.ARGUMENT:
                    return await ArgumentService.getArgumentById(report.entityId);
                case ReportingType.COMMENT:
                    return await PartyService.getCommentById(report.entityId);
                case ReportingType.DEBATE:
                    return await DebateService.getDebateById(report.entityId);
                case ReportingType.TOPIC:
                    return await TopicService.getTopicById(report.entityId);
                case ReportingType.REFORMULATION:
                    return await DebateService.getReformulationById(report.entityId);
                default:
                    return {};
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static async getReports(){
        return this.reportRepository.getRecentReports();
    }

    static async getReportsForModerationLvl1() {
        return this.reportRepository.getModeration1Reports();
    }

    static async getModeration2Reports(){
        return this.reportRepository.getModeration2Reports();
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

    //Moderation as a user

    static async getPersonalReports(userId: string): Promise<personalReport[]>{
        const reports = await this.reportRepository.getPersonalReports(userId);
        const personalReports = await Promise.all(reports.map(async report => {
            const events = await this.reportRepository.getEvents(report.id);
            const sanction: ReportingEvent = events.find(event => event.type === 'ban' || event.type === 'mute' || event.type === 'delete' || event.type === 'mask')!;
            return {
                report,
                sanction
            }
        }));
        return personalReports;
    }

    //Moderator actions

    static async escalateToModeration2(reportId: string){
        try {
            const report = await this.reportRepository.getReport(reportId);
            if(!report) {
                throw new Error('Report not found');
            }
            if(report.isModerated) {
                throw new Error('This report is already moderated');
            }
            if(report.isModeration2Required) {
                throw new Error('This report is already escalated to moderation 2');
            }
            await this.reportRepository.setModeration2Required(report.id);
        } catch (error) {
            throw error;
        }
    }

    static async postSanction(reportId: string, moderatorId: string, type: string, duration? :number, reason?: string){
        try {
            const report = await this.reportRepository.getReport(reportId);
            if(!report) {
                throw new Error('Report not found');
            }

            //Check moderation
            if (report.isModeration2Required) {
                const moderator = await this.userRepository.getUser(moderatorId);
                if (!moderator) {
                    throw new Error('Moderator not found');
                }
                if (moderator.role !== Role.ADMIN && moderator.role !== Role.MODERATOR2) {
                    throw new Forbidden();
                }
            }

            //TODO handle special case

            const event = await this.reportRepository.addEventToReport(reportId, moderatorId, reason ? reason : 'No reason specified', type, duration);
            await this.reportRepository.updateReportTime(report.id);
            await this.reportRepository.setModerated(report.id);
            return event;

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    static async contestReport(reportId: string, userId: string, reason: string){
        try {
            const report = await this.reportRepository.getReport(reportId);
            if(!report) {
                throw new Error('Report not found');
            }
            if(report.userId !== userId) {
                throw new Forbidden();
            }
            if(!report.isModerated) {
                throw new Error('this report is not moderated');
            }
            if(report.isModeration2Required) {
                throw new Error('You already contested this report');
            }

            const contestEvent = await this.reportRepository.addEventToReport(reportId, userId, reason, 'contest');
            await this.reportRepository.updateReportTime(reportId);
            await this.reportRepository.setModeration2Required(reportId);
            return contestEvent;

        } catch (error) {
            console.log(error);
            throw error;
        }
    }

}

export default ModerationService;