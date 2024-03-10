import TopicRepository from "@/repositories/TopicRepository";
import AuthentificationService from "./AuthentificationService";
import { JwtCheckException } from "@/exceptions/JwtExceptions";

class TopicService {
    private static topicRepository: TopicRepository = new TopicRepository()

    static async getTopicById(id: string) {
        const topic = await TopicService.topicRepository.findTopicById(id);
        return topic
    }

    static async getTopics(page: number) {
        const topics = await TopicService.topicRepository.findTopics(page);
        return topics
    }
}

export default TopicService;