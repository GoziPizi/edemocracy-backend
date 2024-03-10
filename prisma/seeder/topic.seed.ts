import { PrismaClient } from "@prisma/client";

async function seedTopics(prisma: PrismaClient) {
    await prisma.topic.createMany({
        data: [
            {
                title: 'Economie',
                parentTopicId: null,
                childrenId: [],
                description: 'La description de l\'économie',
                medias: []
            },
            {
                title: 'Immigration',
                parentTopicId: null,
                childrenId: [],
                description: 'La description',
            },
            {
                title: 'Privatisation de la santé',
                parentTopicId: '1',
                childrenId: [],
                description: 'La description',
            }
        ]
    })
}

export default seedTopics;