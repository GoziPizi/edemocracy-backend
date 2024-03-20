import TopicRepository from "@/repositories/TopicRepository";
import DebateRepository from "@/repositories/DebateRepository";

class TopicService {
    private static topicRepository: TopicRepository = new TopicRepository()
    private static debateRepository: DebateRepository = new DebateRepository()

    static async createTopic(topic: any) {
        const createdTopic = await TopicService.topicRepository.createTopic(topic);
        return createdTopic;
    }

    static async getTopicById(id: string) {
        const topic = await TopicService.topicRepository.findTopicById(id);
        return topic
    }

    static async getTopics(page: number) {
        const topics = await TopicService.topicRepository.findTopics(page);
        return topics
    }

    static getParentsList() {
        return TopicService.topicRepository.getParentsList();
    }

    static getFullList() {
        return TopicService.topicRepository.getFullList();
    }

    static async getDebatesByTopicId(id: string) {
        const topic = await TopicService.topicRepository.findTopicById(id);
        if (!topic) {
            throw new Error("Topic not found");
        }
        const ids = topic.debates;
        const debates = await TopicService.debateRepository.getByDebatesIds(ids);
        return debates;
        
    }
}

export default TopicService;