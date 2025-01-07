import { Affiliation, Prisma } from "@prisma/client";
import PrismaRepository from "./PrismaRepository";

class PersonalityRepository extends PrismaRepository {

    createPersonality = async (userId: string) => {
        const personality = await this.prismaClient.personality.create({
            data: {
                user: {
                    connect: {
                        id: userId
                    }
                },
                description: "",
                for: [],
                against: []
            }
        })
        return personality
    }

    updatePersonality = async (id: string, updates: any) => {
        const personality = await this.prismaClient.personality.update({
            where: {
                id
            },
            data: updates
        })
        return personality
    }

    findPersonalityById = async (id: string) => {
        const personality = await this.prismaClient.personality.findUnique({
            where: {
                id
            }
        })
        return personality
    }

    findPersonalityByUserId = async (userId: string) => {
        const personality = await this.prismaClient.personality.findFirst({
            where: {
                userId
            }
        })
        return personality
    }

    getPersonalityWithUser = async (id: string) => {
        const personality = await this.prismaClient.personality.findUnique({
            where: {
                id
            },
            include: {
                user: true
            }
        })
        return personality
    }

    searchPersonality = async (criterias: any) => {
        const where: Prisma.PersonalityWhereInput = {};
        if(criterias.for && criterias.for.length > 0) where.for = { hasEvery: criterias.for };
        if(criterias.against && criterias.against.length > 0) where.against = { hasEvery: criterias.against };
        if (criterias.politicSide) {
            where.user = {
                is: {
                    politicSide: { equals: criterias.politicSide as Affiliation},
                },
            };
        }
        const personalities = await this.prismaClient.personality.findMany({
            where,
            include: {
                user: true
            }
        })
        return personalities
    }

    textSearch = async (query: string) => {
        const personalities = await this.prismaClient.personality.findMany({
            where: {
            OR: [
                { user: { name: { contains: query, mode: 'insensitive' } } },
                { user: { description: { contains: query, mode: 'insensitive' } } }
            ]
            },
            include: {
            user: true
            }
        })
        return personalities
    }

    //debates related methods

    getDebatesFromPersonalityId = async (personalityId: string) => {
        const debates = await this.prismaClient.debate.findMany({
            where: {
                personalityId
            },
            orderBy: {
                popularityScore: 'desc'
            }
        })
        return debates
    }

    getPersonalDebatesFromPersonalityId = async (personalityId: string) => {
        const debates = await this.prismaClient.debate.findMany({
            where: {
                personalityCreatorId: personalityId
            },
            orderBy: {
                popularityScore: 'desc'
            }
        })
        return debates
    }

    setFirstDebateDisplay = async (personalityId: string, debateId: string) => {
        const personality = await this.prismaClient.personality.update({
            where: {
                id: personalityId
            },
            data: {
                firstDebateDisplay: debateId
            }
        })
        return personality
    }
}

export default PersonalityRepository;