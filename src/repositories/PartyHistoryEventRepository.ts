import PrismaRepository from "./PrismaRepository";

class PartyHistoryEventRepository extends PrismaRepository {

    createPartyHistoryEvent = async (data: any) => {
        const partyHistoryEvent = await this.prismaClient.partyHistoryEvent.create({
            data
        })
        return partyHistoryEvent
    }

    deletePartyHistoryEvent = async (id: string) => {
        const partyHistoryEvent = await this.prismaClient.partyHistoryEvent.delete({
            where: {
                id
            }
        })
        return partyHistoryEvent
    }

    getAllPartyHistoryEventsFromPartyId = async (partyId: string) => {
        const partyHistoryEvents = await this.prismaClient.partyHistoryEvent.findMany({
            where: {
                partyId
            }
        })
        return partyHistoryEvents
    }
}

export default PartyHistoryEventRepository;