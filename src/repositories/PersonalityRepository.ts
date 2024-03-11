import { Affiliation, Prisma } from "@prisma/client";
import PrismaRepository from "./PrismaRepository";

class PersonalityRepository extends PrismaRepository {

    findPersonalityById = async (id: string) => {
        const personality = await this.prismaClient.personality.findUnique({
            where: {
                id
            }
        })
        return personality
    }

    searchPersonality = async (criterias: any) => {
        const where: Prisma.PersonalityWhereInput = {};
        if(criterias.for && criterias.for.length > 0) where.for = { has: criterias.for };
        if(criterias.against && criterias.against.length > 0) where.against = { has: criterias.against };
        if (criterias.politicSide) {
            // Ajouter un filtre qui traverse la relation avec User
            where.user = {
                is: {
                    // Supposons que l'orientation politique est un champ dans User, ajustez selon votre modèle
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
}

export default PersonalityRepository;