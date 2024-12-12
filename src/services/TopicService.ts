import TopicRepository from "@/repositories/TopicRepository";
import DebateRepository from "@/repositories/DebateRepository";
import AwsService from "./AwsService";
import { ResizeService } from "./ResizeService";
import DebateService from "./DebateService";

class TopicService {
    private static topicRepository: TopicRepository = new TopicRepository()
    private static debateRepository: DebateRepository = new DebateRepository()

    static async createTopic(
        topic: any,
        userId: string,
        image: Express.Multer.File | undefined
    ) {
        let imageUrl = undefined;

        if(topic.medias) {
            topic.medias = JSON.parse(topic.medias);
        }


        if(image) {
            await ResizeService.checkRatio(image, 16 / 9);
            image = await ResizeService.resizeTopicImage(image);
            imageUrl = await AwsService.uploadTopicPicture(image, topic.title);
            delete topic.image;
            topic.medias = [imageUrl];
        }

        const createdTopic = await TopicService.topicRepository.createTopic(topic, userId);
        return createdTopic;
    }

    static async getAuthor(id: string) {
        const topic = await TopicService.topicRepository.findTopicById(id);
        if (!topic) {
            throw new Error("Topic not found");
        }
        return topic.userId;
    }

    static async updateTopic(id: string, topic: any, userId: string) {
        const actualTopic = await TopicService.topicRepository.findTopicById(id);
        if (!actualTopic) {
            throw new Error("Topic not found");
        }
        if(actualTopic.userId !== userId) {
            throw new Error("You are not allowed to update this topic");
        }
        const updatedTopic = await TopicService.topicRepository.updateTopic(id, topic);
        return updatedTopic;
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

    static async getRecentTopics() {
        const topics = await TopicService.topicRepository.findRecentTopics();
        return topics;
    }

    static async deleteTopic(id: string) {
        try {
            const topic = await TopicService.topicRepository.findTopicById(id);
            if (!topic) {
                throw new Error("Topic not found");
            }
            //delete related debates
            const debates = await TopicService.debateRepository.getByDebatesIds(topic.debates);
            await Promise.all(debates.map(async (debate) => {
                await DebateService.deleteDebate(debate.id);
            }));
            //delete link from children
            await this.topicRepository.deleteChildrenLinks(id);
            //delete link from parents
            if(topic.parentTopicId) {
                await this.topicRepository.deleteChildrenPresence(topic.parentTopicId, id);
            }
            //delete all opinions
            await this.topicRepository.deleteAllOpinions(id);
            //delete topic
            await this.topicRepository.deleteTopic(id);
        } catch (error) {
            throw error;
        }
    }

    static async setFlag(id: string, isFlaged: boolean) {
        return this.topicRepository.updateTopic(id, {isFlaged});
    }
}

export default TopicService;