import { toPublicUserOutput } from "@/mappers/UserMapper";
import PartyHistoryEventRepository from "@/repositories/PartyHistoryEventRepository";
import PartyRepository from "@/repositories/PartyRepository";
import UserRepository from "@/repositories/UserRepository";
import { PartyCreateInput } from "@/types/dtos/PartyDto";

class PartyService {

    private static partyRepository: PartyRepository = new PartyRepository();
    private static userRepository: UserRepository = new UserRepository();
    private static partyHistoryEventRepository: PartyHistoryEventRepository = new PartyHistoryEventRepository();

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

    static async inviteMember(partyId: string, userId: string, newMemberEmail: string) {
        const party = await this.partyRepository.getPartyById(partyId);
        if(!party) {
            throw new Error('Party not found');
        }
        const hasAdminRights = await this.checkAdminRights(partyId, userId);
        if(!hasAdminRights) {
            throw new Error('You are not allowed to do this');
        }
        const newMember = await this.userRepository.getUserByEmail(newMemberEmail);
        if(!newMember) {
            throw new Error('User not found');
        }
        const invitation = await this.partyRepository.inviteMember(partyId, newMember.id);
        return invitation;
    }

    static async searchParty(criterias: any) {
        let finalCriterias = {};
        if(criterias.name) {
            finalCriterias = {
                ...finalCriterias,
                name: criterias.name
            }
        }
        if(criterias.politicSide) {
            finalCriterias = {
                ...finalCriterias,
                politicSide: criterias.politicSide
            }
        }
        if(criterias.for) {
            finalCriterias = {
                ...finalCriterias,
                for: criterias.for
            }
        }
        if(criterias.against) {
            finalCriterias = {
                ...finalCriterias,
                against: criterias.against
            }
        }
        let result = await PartyService.partyRepository.searchParty(finalCriterias);
        return result;
    }

    static async getMembers(id: string) {
        const users = await this.partyRepository.getMembersUser(id);
        const returnUsers = users.map(toPublicUserOutput);
        return returnUsers;
    }

    //history events related methods

    static async createPartyHistoryEvent(id: string,  data: any) {
        const partyHistoryEvent = await this.partyHistoryEventRepository.createPartyHistoryEvent({
            ...data,
            partyId: id
        
        });
        return partyHistoryEvent;
    }

    static async deletePartyHistoryEvent(id: string) {
        const partyHistoryEvent = await this.partyHistoryEventRepository.deletePartyHistoryEvent(id);
        return partyHistoryEvent;
    }

    static async getAllPartyHistoryEventsFromPartyId(partyId: string) {
        const partyHistoryEvents = await this.partyHistoryEventRepository.getAllPartyHistoryEventsFromPartyId(partyId);
        return partyHistoryEvents;
    }

}

export default PartyService;