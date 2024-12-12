import ReportRepository from "@/repositories/ReportRepository";
import { ReportingEvent, ReportingType, Role } from "@prisma/client";
import ArgumentService from "./ArgumentService";
import PartyService from "./PartyService";
import DebateService from "./DebateService";
import TopicService from "./TopicService";
import { Forbidden } from "@/exceptions/AdminExceptions";
import { personalReport } from "@/types/dtos/ModerationDtos";
import UserRepository from "@/repositories/UserRepository";
import { sendWarnMail } from "./MailService";
import { EntityAlreadyReportedByUserException } from "@/exceptions/ModerationException";
import { ReportingEventInputDto } from "@/types/ModerationTypes";

class ModerationService {

    private static reportRepository: ReportRepository = new ReportRepository()
    private static userRepository: UserRepository = new UserRepository()

    //Gives the ability for any authenticated user to report an entity.
    //If there is no current report for this entity, a new report is created.
    //If there is already a report for this entity, the array of events is updated.
    //TODO handle case where entity has already been moderated
        //TODO handle case it has already been reported by this user
    static async report(reporterId: string, entityId: string, entityType: ReportingType, reason: string){
        try {

            let report = await this.reportRepository.getReportFromEntity(entityId);
            if(!report) {
                const userId = await ModerationService.getAuthor(entityId, entityType);
                report = await this.reportRepository.initializeEmptyReportForEntity(entityId, entityType, userId);
            }

            const events = await this.reportRepository.getEvents(report.id);
            if(events.find(event => event.userId === reporterId && event.type === 'report')) {
                throw new EntityAlreadyReportedByUserException();
            }

            const event: ReportingEventInputDto = {
                reportingId: report.id,
                reason,
                type: 'report',
                duration: null,
                targetedUserId: null
            }

            await this.reportRepository.addEventToReport(reporterId, event);

            //Update flags
            if(events.filter(event => event.type === 'report').length >= 5) {
                this.setFlag(entityId, entityType, true);
            }

            return report;
        } catch (error) {
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
        const report = await this.reportRepository.getReport(id);
        if(!report) {
            return;
        }
        //Update reputation
        this.updateReputationsOfReporters(id, -1);

        //TODO remove flags
        this.setFlag(report.entityId, report.entityType, false);

        //Delete report
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
            throw error;
        }
        //Update reputation
        this.updateReputationsOfReporters(id, -1);

        //Delete report
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

    static async warnUser(userId: string, moderatorId: string, reason: string, reportId?: string) {
        //TOTEST
        try {
            const user = await this.userRepository.getUser(userId);
            if(!user) {
                throw new Error('User not found');
            }
            const report = await this.reportRepository.getReport(reportId!);
            let warn: ReportingEvent | null = null;

            const event: ReportingEventInputDto = {
                reportingId: reportId!,
                reason,
                type: 'warn',
                duration: null,
                targetedUserId: null
            }

            if(report) {
                warn = await this.reportRepository.addEventToReport(moderatorId, event);
            }

            sendWarnMail(user.email, reason);
            return warn;

        } catch (error) {
            throw error;
        }
    }

    static async postSanction(moderatorId: string, reportId: string, reportingEvent: ReportingEventInputDto){
        //TOTEST
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

            const userId = report.userId;
            const finalEvent: ReportingEventInputDto = {
                ...reportingEvent,
                targetedUserId: userId
            }

            const event = await this.reportRepository.addEventToReport(moderatorId, finalEvent);
            await this.reportRepository.updateReportTime(report.id);
            await this.reportRepository.setModerated(report.id);

            //Update reputation
            this.updateReputationsOfReporters(reportId, 1);

            return event;

        } catch (error) {
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

            const event: ReportingEventInputDto = {
                reportingId: reportId,
                reason,
                type: 'contest',
                duration: null,
                targetedUserId: null
            }

            const contestEvent = await this.reportRepository.addEventToReport(userId, event);
            await this.reportRepository.updateReportTime(reportId);
            await this.reportRepository.setModeration2Required(reportId);
            return contestEvent;

        } catch (error) {
            throw error;
        }
    }

    //Historic related methods
    static async getModerators(): Promise<{name: string, id: string}[]> {
        return this.reportRepository.getModerators();
    }

    static async getHistoric(): Promise<ReportingEvent[]> {
        return this.reportRepository.getFullHistoric();
    }

    static async getHistoricOfModerator(moderatorId: string): Promise<ReportingEvent[]> {
        return this.reportRepository.getHistoricOfModerator(moderatorId);
    }

    //Reputation
    static async updateReputationsOfReporters(reportId: string, value: number){
        const events = await this.reportRepository.getEvents(reportId);
        for (const event of events) {
            if(event.type === 'report') {
                await this.userRepository.updateReputation(event.userId, value);
            }
        }
    }

    //Flags
    static async setFlag(entityId: string, entityType: ReportingType, isFlaged: boolean){
        switch(entityType) {
            case ReportingType.ARGUMENT:
                ArgumentService.setFlag(entityId, isFlaged);
                break;
            case ReportingType.COMMENT:
                PartyService.setFlag(entityId, isFlaged);
                break;
            case ReportingType.DEBATE:
                DebateService.setDebateFlag(entityId, isFlaged);
                break;
            case ReportingType.TOPIC:
                TopicService.setFlag(entityId, isFlaged);
                break;
            case ReportingType.REFORMULATION:
                DebateService.setReformulationFlag(entityId, isFlaged);
                break;
        }
    }

    static async getUserStatus(userId: string) {
        const sanctions = await this.reportRepository.getSanctions(userId);
        for (const sanction of sanctions) {
            if(!sanction.duration) {
                return sanction.type;
            } 
            if(sanction.createdAt.getTime() + sanction.duration * 60 * 60 * 1000 > Date.now()) {
                return sanction.type;
            }
        }
        return 'ok';
    }


}

export default ModerationService;