import { PartyRole } from "@prisma/client";
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

    inviteMember = async (partyId: string, userId: string) => {
        const invitation = await this.prismaClient.membershipInvite.create({
            data: {
                partyId,
                userId
            }
        })
        return invitation
    }

    addMember = async (partyId: string, userId: string) => {
        const membership = await this.prismaClient.partyMembership.create({
            data: {
                partyId,
                userId,
                role: PartyRole.MEMBER
            }
        })
        return membership
    }

    getMembersId = async (partyId: string) => {
        const partyMembershipIds = await this.prismaClient.partyMembership.findMany({
            where: {
                partyId
            }
        })
        return partyMembershipIds
    }

    getMembersUser = async (partyId: string) => {
        const partyMembershipIds = await this.prismaClient.partyMembership.findMany({
            where: {
                partyId
            }
        })
        const userIds = partyMembershipIds.map(p => p.userId)
        const users = await this.prismaClient.user.findMany({
            where: {
                id: {
                    in: userIds
                }
            }
        })
        return users
    }
}

export default PartyRepository;