import PrismaRepository from "./PrismaRepository";

class TopicRepository extends PrismaRepository {

    findTopicById = async (id: string) => {
        const topic = await this.prismaClient.topic.findUnique({
            where: {
                id
            }
        })
        return topic
    }

    findTopics = async (page: number) => {
        const topics = await this.prismaClient.topic.findMany({
            skip: (page - 1) * 10,
            take: 10
        })
        return topics
    }

    getParentsList = async () => {
        const topics = await this.prismaClient.topic.findMany({
            where: {
                parentTopicId: null
            },
            select: {
                id: true,
                title: true
            }
        })
        return topics
    }

}

export default TopicRepository;