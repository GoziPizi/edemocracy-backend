import PrismaRepository from "./PrismaRepository";

class PartyInvitationRepository extends PrismaRepository {

    getPartyInvitationById = async (id: string) => {
        const partyInvitation = await this.prismaClient.membershipInvite.findUnique({
            where: {
                id
            }
        })
        return partyInvitation
    }

    getPartyInvitationsByUserId = async (userId: string) => {
        const partyInvitations = await this.prismaClient.membershipInvite.findMany({
            where: {
                userId
            }
        })
        return partyInvitations
    }
}

export default PartyInvitationRepository;