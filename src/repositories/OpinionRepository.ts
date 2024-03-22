import { PrismaClient } from "@prisma/client";
import RawQueryRepository from "./RawQueryRepository";

class OpinionRepository extends PrismaClient{
    private rawQueryRepository = new RawQueryRepository()

    createOpinion = async (userId: string, topicId: string, opinion: string) => {
        const createdOpinion = await this.opinion.create({
            data: {
                userId,
                topicId,
                opinion
            }
        })
        return createdOpinion
    }

    findOpinionsWithTitleByUserId = async (userId: string) => {
        let opinions = await this.opinion.findMany({
            where: {
                userId
            },
            include: {
                topic: {
                    select: {
                        title: true
                    }
                }
            }
        })
        const opinionsWithTitle = opinions.map(opinion => {
            return {
                ...opinion,
                topicTitle: opinion.topic.title
            }
        })
        return opinionsWithTitle
    }
}

export default OpinionRepository;