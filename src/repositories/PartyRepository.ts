import PrismaRepository from "./PrismaRepository";

class PartyRepository extends PrismaRepository {

    createParty = async (data: any) => {
        const party = await this.prismaClient.party.create({
            data
        })
        return party
    }

    getPartyById = async (id: string) => {
        const party = await this.prismaClient.party.findUnique({
            where: {
                id
            }
        })
        return party
    }

    updateParty = async (id: string, data: any) => {
        const party = await this.prismaClient.party.update({
            where: {
                id
            },
            data
        })
        return party
    }

    searchParty = async (criterias: any) => {
        const where: any = {};
        if(criterias.name) where.name = { contains: criterias.name };
        if(criterias.politicSide) where.politicSide = { equals: criterias.politicSide };
        if(criterias.for) where.for = { hasEvery: criterias.for };
        if(criterias.against) where.against = { hasEvery: criterias.against };
        console.log(where);
        const parties = await this.prismaClient.party.findMany({
            where
        })
        return parties
    }

    findPartyByUserId = async (userId: string) => {
        const partymembership = await this.prismaClient.partyMembership.findFirst({
            where: {
                userId
            }
        })
        if(!partymembership) return null
        const party = await this.prismaClient.party.findUnique({
            where: {
                id: partymembership.partyId
            }
        })
        return party
    }

}

export default PartyRepository;