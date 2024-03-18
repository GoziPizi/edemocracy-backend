import PartyRepository from "@/repositories/PartyRepository";
import { PartyCreateInput } from "@/types/dtos/PartyDto";

class PartyService {

    private static partyRepository: PartyRepository = new PartyRepository();

    static async createParty(party: PartyCreateInput, userId: string) {
        let createdParty = await this.partyRepository.createParty({
            ...party,
            founderId: userId,
            logo: 'default-logo.png'
        });
        return createdParty;
    }

    static async getPartyById(id: string) {
        let party = await this.partyRepository.getPartyById(id);
        return party;
    }

    static async checkAdminRights(id: string, userId: string) {
        let party = await this.partyRepository.getPartyById(id);
        if(!party) {
            throw new Error('Party not found');
        }
        if(party.founderId === userId) {
            return true;
        }
        return false;
    }

    static async updateParty(id: string, data: any, userId: string) {
        let hasAdminRights = await this.checkAdminRights(id, userId);
        if(!hasAdminRights) {
            throw new Error('You are not allowed to do this');
        }
        let party = await this.partyRepository.updateParty(id, data);
        return party;

    }

}

export default PartyService;