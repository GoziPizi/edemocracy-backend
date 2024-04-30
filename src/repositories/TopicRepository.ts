import PrismaRepository from "./PrismaRepository";

class TopicRepository extends PrismaRepository {

    createTopic = async (topic: any) => {
        const newTopic = await this.prismaClient.topic.create({
            data: topic
        })
        if(topic.parentTopicId) {
            await this.updateChildrenIds(topic.parentTopicId, newTopic.id)
        }
        return newTopic
    }   

    updateTopic = async (id: string, topic: any) => {
        const updatedTopic = await this.prismaClient.topic.update({
            where: {
                id
            },
            data: topic
        })
        return updatedTopic
    }

    updateChildrenIds = async (topicId: string, childrenId: string) => {
        const topic = await this.prismaClient.topic.findFirst({where: {id: topicId}})
        if (!topic) {
            throw new Error('Topic not found')
        }
        const updatedTopic = await this.prismaClient.topic.update({
            where: {
                id: topicId
            },
            data: {
                childrenId: topic.childrenId ? [...topic.childrenId, childrenId] : [childrenId]
            }
        })
        return updatedTopic
    }

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

    getFullList = async () => {
        const topics = await this.prismaClient.topic.findMany({
            select: {
                id: true,
                title: true
            }
        })
        return topics
    }

    addDebateToTopic = async (topicId: string, debateId: string) => {
        const topic = await this.prismaClient.topic.findFirst({where: {id: topicId}})
        if (!topic) {
            throw new Error('Topic not found')
        }
        const updatedTopic = await this.prismaClient.topic.update({
            where: {
                id: topicId
            },
            data: {
                debates: topic.debates ? [...topic.debates, debateId] : [debateId]
            }
        })
        return updatedTopic
    }

    textSearch = async (search: string) => {
        const topics = await this.prismaClient.topic.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: search, mode: 'insensitive'
                        }
                    },
                    {
                        description: {
                            contains: search, mode: 'insensitive'
                        }
                    }
                ]
            }
        })
        return topics
    }

}

export default TopicRepository;