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

}

export default PartyRepository;