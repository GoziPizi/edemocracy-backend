import { PrismaClient } from "@prisma/client";

async function seedTopics(prisma: PrismaClient) {
    await prisma.topic.createMany({
        data: [
            {
                id: '0b147773-f189-40c6-b769-b4c8b7d92c14',
                title: 'Economie',
                parentTopicId: null,
                childrenId: [],
                description: 'La description de l\'économie',
                medias: []
            },
            {
                id: 'd4e05d53-0f5a-473a-846c-80f1e35e8ecf',
                title: 'Immigration',
                parentTopicId: null,
                childrenId: [],
                description: 'La description',
            },
            {
                id: '2489161d-4e22-4244-8c07-3e09699b55b3',
                title: 'Privatisation de la santé',
                parentTopicId: '1',
                childrenId: [],
                description: 'La description',
            }
        ]
    })
}

export default seedTopics;