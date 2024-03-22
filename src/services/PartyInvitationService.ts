import PartyInvitationRepository from "@/repositories/PartyInvitationRepository";
import PartyRepository from "@/repositories/PartyRepository";

class PartyInvitationService {

    private static partyInvitationRepository: PartyInvitationRepository = new PartyInvitationRepository();
    private static partyRepository: PartyRepository = new PartyRepository();

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

    static async answerPartyInvitation(id: string, userId: string, answer: boolean) {
        let partyInvitation = await this.getPartyInvitationById(id, userId);
        if(partyInvitation.userId !== userId) {
            throw new Error('You are not allowed to do this');
        }
        await this.partyInvitationRepository.deletePartyInvitation(id);
        if(answer) {
            await this.partyRepository.addMember(partyInvitation.partyId, userId);
        }
        return;
    }

}

export default PartyInvitationService;