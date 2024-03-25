import { PartyRole } from "@prisma/client";
import PrismaRepository from "./PrismaRepository";

class PartyRepository extends PrismaRepository {

    createParty = async (data: any) => {
        const party = await this.prismaClient.party.create({
            data
        })
        await this.prismaClient.partyMembership.create({
            data: {
                partyId: party.id,
                userId: party.founderId,
                role: PartyRole.ADMIN
            }
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
        console.log(parties);
        return parties
    }

    findPartisByUserId = async (userId: string) => {
        const partyMemberships = await this.prismaClient.partyMembership.findMany({
            where: {
                userId
            }
        })
        const partyIds = partyMemberships.map(p => p.partyId)
        const parties = await this.prismaClient.party.findMany({
            where: {
                id: {
                    in: partyIds
                }
            }
        })
        return parties
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

    //Comments methods

    getCommentById = async (commentId: string) => {
        const comment = await this.prismaClient.partyComment.findUnique({
            where: {
                id: commentId
            }
        })
        return comment
    }

    addComment(partyId: string, userId: string, content: string) {
        return this.prismaClient.partyComment.create({
            data: {
                content,
                partyId,
                userId
            }
        })
    }

    deleteComment(commentId: string) {
        return this.prismaClient.partyComment.delete({
            where: {
                id: commentId
            }
        })
    }

    getAllCommentsFromPartyId(partyId: string) {
        return this.prismaClient.partyComment.findMany({
            where: {
                partyId
            }
        })
    }

    getAllCommentsWithNameFromPartyId(partyId: string) {
        return this.prismaClient.partyComment.findMany({
            where: {
            partyId
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        name: true
                    }
                }
            }
        })
    }

    textSearch(query: string) {
        return this.prismaClient.party.findMany({
            where: {
                OR: [
                    {
                        name: {
                            contains: query, mode: 'insensitive'
                        }
                    },
                    {
                        description: {
                            contains: query, mode: 'insensitive'
                        }
                    }
                ]
            }
        })
    }
}

export default PartyRepository;