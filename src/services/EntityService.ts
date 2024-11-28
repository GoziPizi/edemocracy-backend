import { ReportingType } from "@prisma/client";
import ArgumentService from "./ArgumentService";
import DebateService from "./DebateService";
import PartyService from "./PartyService";
import TopicService from "./TopicService";

class EntityService {
    
    static async getEntityName(entityId: string, entityType: string): Promise<string> {
        switch(entityType) {
            case ReportingType.ARGUMENT:
                return (await ArgumentService.getArgumentById(entityId)).title;
            case ReportingType.COMMENT:
                return (await PartyService.getCommentById(entityId))?.content!;
            case ReportingType.DEBATE:
                return (await DebateService.getDebateById(entityId)).title!;
            case ReportingType.TOPIC:
                return (await TopicService.getTopicById(entityId))!.title!;
            case ReportingType.REFORMULATION:
                return (await DebateService.getReformulationById(entityId))?.title!;
            //More cases TODO
            default:
                return 'Unnamed entity';
        }
    }

    static async deleteEntity(entityId: string, entityType: string): Promise<void> {
        switch(entityType) {
            case ReportingType.ARGUMENT:
                await ArgumentService.deleteArgument(entityId);
                break;
            case ReportingType.COMMENT:
                await PartyService.forceDeleteComment(entityId);
                break;
            case ReportingType.DEBATE:
                await DebateService.deleteDebate(entityId);
                break;
            case ReportingType.TOPIC:
                await TopicService.deleteTopic(entityId);
                break;
            case ReportingType.REFORMULATION:
                await DebateService.deleteReformulation(entityId);
                break;
            //More cases TODO
            default:
                break;
        }
    }
}

export default EntityService;