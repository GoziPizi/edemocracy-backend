import { TopicOutputDto } from "@/types/dtos/TopicDtos";

export const TopicOutputDefinition: TopicOutputDto = {
    id: '1',
    title: 'string',
    description: 'string',
    parentTopicId: '2',
    childrenId: ['1'],
    medias: ['https://www.google.com'],
    createdAt: new Date(),
    updatedAt: new Date()
}