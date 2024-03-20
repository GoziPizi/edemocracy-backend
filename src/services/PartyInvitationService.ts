import PartyInvitationRepository from "@/repositories/PartyInvitationRepository";

class PartyInvitationService {

    private static partyInvitationRepository: PartyInvitationRepository = new PartyInvitationRepository();

    static async getPartyInvitationById(id: string, userId: string) {
        let partyInvitation = await this.partyInvitationRepository.getPartyInvitationById(id);
        if(!partyInvitation) {
            throw new Error('Party invitation not found');
        }
        if(partyInvitation.userId !== userId) {
            throw new Error('You are not allowed to do this');
        }
        return partyInvitation;
    }

    static async getPartyInvitationsByUserId(userId: string) {
        let partyInvitations = await this.partyInvitationRepository.getPartyInvitationsByUserId(userId);
        return partyInvitations;
    }

}

export default PartyInvitationService;